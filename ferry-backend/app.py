import os
import tornado
import tornado.httpserver

from tools import setup
from tools import crypto

from tornado import gen
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.options import parse_command_line
from tornado import web

import psycopg2
import momoko
import json


trip_statuses = {
    'unmatched': 0,
    'matched': 1,
    'expired': -1
}

reverse_trip_statuses = {
    0: 'unmatched',
    1: 'matched',
    -1: 'expired'
}

#####

match_statuses = {
    'confirmed': 0,
    'in transit': 1,
    'completed': 2,
    'error': -1
}

#####

sizes = {
    'small': 0,
    'medium': 1,
    'large': 2
}

reverse_sizes = {
    0: 'small',
    1: 'medium',
    2: 'large'
}

#####

# tools 

from datetime import date, datetime

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        serial = obj.isoformat()
        return serial
    raise TypeError ("Type %s not serializable" % type(obj))

class BaseHandler(tornado.web.RequestHandler):

    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "Content-Type, x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'PUT, DELETE, POST, GET, OPTIONS')
    
    def options(self):
        self.set_status(204)
        self.finish()
        
    @property
    def db(self):
        return self.application.db

    @gen.coroutine
    def serialize_traveller(self, traveller):
        if traveller is not None:
            return {
                'id': traveller[0],
                'street_address': traveller[1],
                'state': traveller[2],
                'zip_code': traveller[3],
                'is_verified': traveller[4]
            }
        else:
            return ''
    
    @gen.coroutine
    def serialize_user(self, user):
        traveller = None
        if user[6] is not None:
            cursor = yield self.db.execute('select * from travellers where id=%(traveller_id)s;',{
                'traveller_id': user[6]
            })
            traveller = yield self.serialize_traveller(cursor.fetchone())

        buyer = None
        if user[7] is not None:
            cursor = yield self.db.execute('select * from buyers where id=%(buyer_id)s;',{
                'buyer_id': user[7]
            })
            buyer = yield self.serialize_buyer(cursor.fetchone())

        
        profile_picture = user[8]
        if user[8] is not None:
            import base64
            profile_picture = base64.b64encode(open(user[8], "rb").read()).decode('utf-8')
        
        return {
            'id': user[0],
            'email': user[1],
            'salt': user[2],
            'hash': user[3],
            'first_name': user[4],
            'last_name': user[5],
            'profile_picture_url': profile_picture,            
            'traveller': traveller,
            'buyer': buyer
        }
    
    @gen.coroutine
    def serialize_city(self, city):
        return {
            'id': city[0],
            'name': city[1],
            'state': city[2],
            'country': city[3]
        }
    
    @gen.coroutine
    def serialize_match(self, match):
        cursor = yield self.db.execute('select * from trips where id=%(id)s;',{
            'id': match[1]
        })        
        trip = yield self.serialize_trip(cursor.fetchone())

        return {
            'id': match[0],
            'traveller_id': trip,
            'status': match[2]
        }   

    @gen.coroutine
    def serialize_trip(self, result):
        # get traveller
        cursor = yield self.db.execute('select * from travellers where id=%(traveller_id)s;',{
            'traveller_id': result[1]
        })
        traveller = yield self.serialize_traveller(cursor.fetchone())

        cursor = yield self.db.execute('select * from cities where id=%(city_id)s;',{
            'city_id': result[3]
        })
        destination_city = yield self.serialize_city(cursor.fetchone())

        return {
            'id': result[0],
            'traveller': traveller,
            'arrival_date': result[2],
            'destination_city': destination_city,
            'departure_date': result[4],
            'status': reverse_trip_statuses.get(result[5]),
            'size': reverse_sizes.get(result[6])
        }           
    
    @gen.coroutine
    def serialize_buyer(self, buyer):
        if buyer:
            return {
                'id': buyer[0],
                'stripe_customer_id': buyer[1],
                'stripe_card_token': buyer[2]
            }
        else:
            return ''

class AuthenticatedHandler(BaseHandler):
    def get_current_user(self):
        user = self.get_secure_cookie(
            'user',
            max_age_days=10
        )
        if user:
            return user.decode('ascii')
        else:
            return None


class LogoutHandler(AuthenticatedHandler):
    def get(self):
        self.set_secure_cookie('user', '')
        self.redirect('/')


class LoginHandler(AuthenticatedHandler):
    @gen.coroutine
    def post(self):
        body = json.loads(self.request.body.decode('utf-8'))        
        email = body.get('email')
        password = body.get('password')

        try:
            cursor = yield self.db.execute(
                '''
                select * from users where email=%(email)s;
                ''',{
                    'email': email,
                }
            )
            user = cursor.fetchone()

            if not user:
                self.write('Invalid username/ password.')
                self.set_status(400)
                self.finish()
            else:
                user = yield self.serialize_user(user)
                if crypto.hash(password, email, user.get('salt')) == user.get('hash'):
                    self.write(json.dumps(user))
                    self.set_status(200)
                    self.finish()            
                else:
                    self.write('Invalid username/ password.')
                    self.set_status(400)
                    self.finish()
        except Exception as e:
            print(e)
            self.write(e.__str__())            
            self.set_status(500)
            self.finish()


class TripsHandler(BaseHandler):

    @gen.coroutine
    def get_trips(self, traveller_id):
        cursor = yield self.db.execute(
            '''
            select * from trips
            where traveller_id=%(traveller_id)s;
            ''', {
                'traveller_id': traveller_id
            }
        )
        trips = []
        for trip in cursor.fetchall():
            dict_trip = yield self.serialize_trip(trip)
            trips.append(dict_trip)
        return trips

    @gen.coroutine
    def get(self, traveller_id):
        trips = yield self.get_trips(traveller_id)

        self.set_status(200)
        self.finish(json.dumps(trips, default=json_serial))

    @gen.coroutine
    def get_city(self, city_id):
        cursor = yield self.db.execute(
            '''
            select * from cities 
            where id=%(id)s;
            ''', {
                'id': city_id
            }
        )

        city = yield self.serialize_city(cursor.fetchone())
        return city

    @gen.coroutine
    def post(self, item_id=None):
        body = json.loads(self.request.body.decode('utf-8'))
        traveller_id = body.get('traveller_id', None)
        destination_name = body.get('destination', None)
        arrival = body.get('arrival', None)
        size = body.get('size', None)
        departure = body.get('departure', None)

        if (traveller_id, destination_name, arrival, size, departure) is not None:

            # get destination_city_id (make sure the city is legit)
            destination_city = yield self.get_city(destination_name)


            # trip obj
            trip = {
                'traveller_id': traveller_id,
                'destination': destination_city.get('id'),
                'arrival': arrival,
                'size': sizes.get(size.lower()),
                'departure': departure,
                'status': trip_statuses.get('unmatched')
            }

            # create trip
            cursor = yield self.db.execute(
                '''
                insert into trips (traveller_id, destination_city_id, arrival_date, size, departure_date, status)
                values (%(traveller_id)s, %(destination)s, %(arrival)s, %(size)s,
                    %(departure)s, %(status)s)
                returning *;
                ''', trip
            )


            created_trip = yield self.serialize_trip(cursor.fetchone())
            print(created_trip)            
            self.set_status(200)
            self.finish(json.dumps(created_trip, default=json_serial))


class ShopHandler(BaseHandler):  

    @gen.coroutine
    def post(self):
        body = json.loads( self.request.body.decode('utf-8') )
        req_city = body.get('city', None)
        buyer_traveller_id = body.get('traveller_id', None)

        print(buyer_traveller_id)

        cursor = yield self.db.execute('select * from cities where id=%(id)s;', { 'id': req_city })
        res_city = yield self.serialize_city(cursor.fetchone())
        
        if res_city is not None:
            # find travellers where city id is associated
            ## with them
            cursor = yield self.db.execute(
                '''
                select * from trips 
                where destination_city_id=%(city_id)s 
                    and traveller_id <> %(buyer_traveller_id)s
                    and arrival_date > now();
                ''', 
                {
                    'city_id': res_city.get('id'),
                    'buyer_traveller_id': buyer_traveller_id
                })
            

            trips = []
            for trip in cursor.fetchall():
                dict_trip = yield self.serialize_trip(trip)
                trips.append(dict_trip)
            
            shop_return_obj = {
                'trips': trips,
                'city': res_city
            }

            self.write(json.dumps(
                shop_return_obj, 
                default=json_serial
            ))

class AllTravellersHandler(BaseHandler):
    
    @gen.coroutine
    def get(self):
        cursor = yield self.db.execute('select * from travellers;')

        res = []
        for item in cursor.fetchall():
            dict_item = yield self.serialize_traveller(item)
            res.append(dict_item)

        self.write(
            json.dumps(res)
        )
        self.set_status(200)
        self.finish()
    
    @gen.coroutine
    def post(self):
        body= json.loads(self.request.body.decode('utf-8'))
        
        user_id = body.get('user_id')
        street_address= body.get('streetAddress')
        public_token = body.get('publicToken')
        state = body.get('state')
        zip_code = body.get('zipCode')
        country = body.get('country')

        try:
            # store traveller
            cursor = yield self.db.execute(
                '''
                insert into travellers (street_address, public_token, state,
                    zip_code, country, is_verified)
                values (%(street_address)s, %(public_token)s, %(state)s,
                    %(zip_code)s, %(country)s, %(is_verified)s)
                returning *;
                ''',{
                    'street_address': street_address,
                    'public_token': public_token,
                    'state': state,
                    'zip_code': zip_code,
                    'country': country,
                    'is_verified': True
                }
            )     
            traveller = yield self.serialize_traveller(cursor.fetchone())

            # store newly created traveller object's id
            ## in relevant user object
            yield self.db.execute(
                '''
                update users
                set traveller_id=%(traveller_id)s
                where id=%(user_id)s;
                ''',{
                    'traveller_id': traveller.get('id'),
                    'user_id': user_id
                }
            )

            self.write(json.dumps(traveller))
            self.set_status(200)
            self.finish()
        except Exception as e:
            print(e)
            self.write("There was an error. Email support@getferry.com, we'll get back to you within the hour.".format(email))
            self.set_status(400)
            self.finish()


class TravellersHandler(BaseHandler):
    
    @gen.coroutine
    def get(self, user_id=None):
        if user_id is not None:
            cursor = yield self.db.execute('select * from travellers where id=%(traveller_id)s;',{
                'traveller_id': traveller_id
            })
            res = yield self.serialize_traveller(cursor.fetchone())

            self.write(
                json.dumps(res)
            )
            self.set_status(200)
            self.finish()
        else:
            self.set_status(400)
            self.finish()


class AllUsersHandler(BaseHandler):
    
    @gen.coroutine
    def get(self):
        cursor = yield self.db.execute('select * from users;')

        res = []
        for item in cursor.fetchall():
            dict_item = yield self.serialize_user(item)
            res.append(dict_item)

        self.write(
            json.dumps(res)
        )
        self.set_status(200)
        self.finish()
    
    @gen.coroutine
    def put(self):
        body = json.loads(self.request.body.decode('utf-8'))
        first_name = body.get('first_name')
        last_name = body.get('last_name')
        email = body.get('email')
        user_id = body.get('id')

        try:
            cursor = yield self.db.execute(
                '''
                update users
                set first_name=%(first_name)s, last_name=%(last_name)s, 
                    email=%(email)s
                where id=%(id)s
                returning *;
                ''',{
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'id': user_id
                }
            )

            user = yield self.serialize_user(cursor.fetchone())
            self.write(json.dumps(user))
            self.set_status(200)
            self.finish()
        except Exception as e:
            print(e)
            self.write('''There was a server error in updating your profile.
                          Please try again later, or email support@getferry.com if the problem continues.''')            
            self.set_status(500)
            self.finish()

    
    @gen.coroutine
    def post(self):
        body = json.loads(self.request.body.decode('utf-8'))
        email = body.get('email')
        password = body.get('password')
        first_name = body.get('first_name')
        last_name = body.get('last_name')
        salt = crypto.salt()

        try:
            yield self.db.execute(
                '''
                insert into users (email, salt, hash, first_name, last_name)
                values (%(email)s, %(salt)s, %(hash)s, %(first_name)s, %(last_name)s);
                ''',{
                    'email': email,
                    'salt': salt,
                    'hash': crypto.hash(password, email, salt),
                    'first_name': first_name,
                    'last_name': last_name
                }
            )
            cursor = yield self.db.execute(
                '''
                select * from users where email=%(email)s;
                ''', {
                    'email': email
                }
            )
            user = yield self.serialize_user(cursor.fetchone())

            self.write(json.dumps(user))
            self.set_status(200)
            self.finish()
        except Exception as e:
            print(e)
            self.write("Please try again with a different email. {} is already being used.".format(email))
            self.set_status(400)
            self.finish()


class UsersHandler(BaseHandler):
    
    @gen.coroutine
    def get(self, user_id=None):
        if user_id is not None:
            cursor = yield self.db.execute('select * from users where id=%(user_id)s;',{
                'user_id': user_id
            })
            res = yield self.serialize_user(cursor.fetchone())

            self.write(
                json.dumps(res)
            )
            self.set_status(200)
            self.finish()
        else:
            self.set_status(400)
            self.finish()


class ProfilePictureHandler(BaseHandler):
    
    @gen.coroutine
    def put(self):
        body = json.loads(self.request.body.decode('utf-8'))
        user_id = body.get('id')
        img = body.get('img')
        title = body.get('title')

        import datetime
        title = datetime.datetime.now().__str__() + '_' + title


        import re
        imgstr = re.search(r'base64,(.*)', img).group(1)
        output = open(title, 'wb')
        import base64
        output.write(base64.b64decode(imgstr))
        output.close()  

        cursor = yield self.db.execute(
            '''
            update users
            set profile_picture_url=%(url)s
            where id=%(id)s
            returning *;
            ''',{
                'url': title,
                'id': user_id
            }
        )

        user = yield self.serialize_user(cursor.fetchone())

        self.write(json.dumps(user))
        self.set_status(200)
        self.finish()   


class CitiesHandler(BaseHandler):

    @gen.coroutine
    def get(self):
        cursor = yield self.db.execute('select * from cities;')
        cities = []
        for city in cursor.fetchall():
            dict_city = yield self.serialize_city(city)
            cities.append(dict_city)
        
        self.set_status(200)
        self.finish(json.dumps(
            cities, default=json_serial
        ))



app_config = setup.tornado_app_config_setup()

PERSISTENT_PATH = app_config.get('persistent_path', None)
COOKIE_SECRET = app_config.get('cookie_secret', None)
PORT = app_config.get('port', None)
SETTINGS = app_config.get('settings', None)

application = None
if (PERSISTENT_PATH, COOKIE_SECRET, PORT, SETTINGS) is not None:


    application = tornado.web.Application(
        [
            (r'/users', AllUsersHandler),
            (r"/users/([0-9]+)", UsersHandler),
            (r"/users/profile_picture", ProfilePictureHandler),
            (r'/travellers', AllTravellersHandler),
            (r"/travellers/([0-9]+)", TravellersHandler),
            (r'/trips', TripsHandler),
            (r'/trips/([0-9]+)', TripsHandler),
            (r'/shop', ShopHandler),
            (r'/login', LoginHandler),
            (r'/logout', LogoutHandler),         
            (r'/cities', CitiesHandler),

            ## STATIC HANDLERS ##
            (r'/static/(.+)', tornado.web.StaticFileHandler, {'path': './static/'}),
            (r'/css/(.+)', tornado.web.StaticFileHandler, {'path': './static/css/'}),
            (r'/js/(.+)', tornado.web.StaticFileHandler, {'path': './static/js/'}),
            (r'/images/(.+)', tornado.web.StaticFileHandler, {'path': './static/images/'})
        ],
        **SETTINGS
    )


if __name__ == '__main__':
    if application is not None:
        ioloop = IOLoop.instance()

        application.db = momoko.Pool(
            dsn=os.environ['DB_FQDN'],
            size=1,
            ioloop=ioloop,
        )

        # this is a one way to run ioloop in sync
        future = application.db.connect()
        ioloop.add_future(future, lambda f: ioloop.stop())
        ioloop.start()
        future.result()  # raises exception on connection error

        server = tornado.httpserver.HTTPServer(application, max_buffer_size=10485760000)         
        server.listen(PORT)
        print('Starting Tornado server on port %s' % PORT)
        ioloop.start()
    else:
        print("Error in app_config. Please fix before starting app.")

## EOF ##