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
import stripe
import decimal  
import requests 


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
reverse_match_statuses = {
    0: 'confirmed',
    1: 'in transit',
    2: 'completed',
    -1: 'error'
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


def send_simple_message(msg, buyer_name, traveller_name, buyer_email, traveller_email, domain_name="getferry.com"):
    return requests.post(
        "https://api.mailgun.net/v3/{domain_name}/messages".format(domain_name=domain_name),
        auth=("api", "key-97cdbf7ad4918e992b345eb7070aff12"),
        data={"from": "{buyer_name} <support@{domain_name}>".format(buyer_name=buyer_name, domain_name=domain_name),
              "to": [traveller_email, buyer_email],
              "subject": "{buyer_name} and {traveller_name} via Ferry".format(buyer_name=buyer_name, traveller_name=traveller_name),
              "text": "Please use this email thread to figure out logistics and further ways to communicate. {buyer_name} said: {msg}".format(buyer_name=buyer_name, msg=msg)})

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        serial = obj.isoformat()
        return serial
    if isinstance(obj, decimal.Decimal):
        return float(obj)
      
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
    def serialize_item(self, item):
        if item is not None:

            return {
                'id': item[0],
                'title': item[1],
                'category': item[2],
                'description': item[3],
                'price': item[4],
                'filepath': item[5],
                'url': item[6],
                'status': item[7],
                'size': item[8]
            }

    @gen.coroutine
    def serialize_order(self, order):
        if order is not None:
            cursor = yield self.db.execute(
                '''
                select * from items where id=%(id)s;
                ''', { 'id': order[1] }
            )
            item = yield self.serialize_item(cursor.fetchone())

            cursor = yield self.db.execute(
                '''
                select * from buyers where id=%(id)s;
                ''', { 'id': order[2] }
            )
            buyer = yield self.serialize_buyer(cursor.fetchone())

            cursor = yield self.db.execute(
                '''
                select * from matches where id=%(id)s;
                ''', { 'id': order[3] }
            )
            match = yield self.serialize_match(cursor.fetchone())                        

            return {
                'id': order[0],
                'item': item,
                'buyer': buyer,
                'match': match
            }
        else:
            return ''


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
            'trip': trip,
            'status': reverse_match_statuses.get(match[2]),
            'first_msg': match[3]
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


class BuyersHandler(BaseHandler):

    # create buyer i.e. create Stripe objects and 
    ## store stripe_customer_id and stripe_card_token
    @gen.coroutine
    def post(self):
        body = json.loads( self.request.body.decode('utf-8') )
        user_id = body.get('user_id')
        stripe_token = body.get('stripe_token')

        if (stripe_token, user_id) is not None:

            cursor = yield self.db.execute(
                '''
                select * from users 
                where id=%(id)s;
                ''', {
                    'id': user_id
                }
            )

            user = yield self.serialize_user(cursor.fetchone())


            # create stripe object to 
            ## get stripe_customer_id and stripe_card_token

            stripe.api_key = "sk_test_YzSBTX1h58lDKnJ0qlQKfYQM"
            
            # create stripe customer object
            stripe_customer_res = stripe.Customer.create(
                description="Customer for {}".format(user.get('email')),
                source=stripe_token.get('id') # obtained with Stripe.js
            )

            stripe_customer_id = stripe_customer_res.id

            # insert into buyers db and return created obj
            cursor = yield self.db.execute(
                '''
                insert into buyers (stripe_customer_id, stripe_card_token)
                values (%(stripe_customer_id)s, %(stripe_card_token)s)
                returning *;
                ''', {
                    'stripe_customer_id': stripe_customer_id,
                    'stripe_card_token': stripe_token.get('id')
                }
            )

            buyer = yield self.serialize_buyer(cursor.fetchone())

            # insert into user, relating created buyer object with user
            cursor = yield self.db.execute(
                '''
                update users set buyer_id=%(buyer_id)s
                where id=%(user_id)s
                returning *;
                ''', {
                    'buyer_id': buyer.get('id'),
                    'user_id': user.get('id')
                }
            )

            user = yield self.serialize_user(cursor.fetchone())
            
            self.set_status(200)
            self.finish(json.dumps(user, default=json_serial))


class MatchesHandler(BaseHandler):

    @gen.coroutine
    def post(self):
        body = json.loads( self.request.body.decode('utf-8') )
        trip_id = body.get('trip_id')


        if trip_id is not None:

            cursor = yield self.db.execute(
                '''
                insert into matches (trip_id, status)
                values ( %(trip_id)s, %(status)s)
                returning *;
                ''', {
                    'trip_id': trip_id,
                    'status': match_statuses.get('confirmed')
                }
            )

            match = yield self.serialize_match(cursor.fetchone())

            # update relevant trip with status 'matched'
            yield self.db.execute(
                '''
                update trips 
                set status=%(status)s
                where id=%(trip_id)s;
                ''', {
                    'status': trip_statuses.get('matched'),
                    'trip_id': trip_id
                }
            )

            self.set_status(200)
            self.finish(json.dumps(match, default=json_serial))
    

class OrdersListHandler(BaseHandler):

    @gen.coroutine
    def post(self):
        body = json.loads( self.request.body.decode('utf-8') )
        user_id = body.get('user_id')

        if ( user_id ) is not None:
            # get user
            cursor = yield self.db.execute(
                '''
                select * from users
                where id=%(id)s;
                ''', {
                    'id': user_id
                }
            )

            user = yield self.serialize_user(cursor.fetchone())
            
            # get buyer id
            buyer_id = user.get('buyer').get('id')

            # get all orders where buyer id matches
            cursor = yield self.db.execute(
                '''
                select * from orders
                where buyer_id=%(buyer_id)s;
                ''', {
                    'buyer_id': buyer_id
                }
            )

            matches = {}
            for order in cursor.fetchall():
                dict_order = yield self.serialize_order(order)

                # get user associated with traveller
                traveller_id = dict_order.get('match').get('trip').get('traveller').get('id')
                cursor = yield self.db.execute(
                    '''
                    select * from users
                    where traveller_id=%(traveller_id)s;
                    ''', {
                        'traveller_id': traveller_id
                    }
                )
                user = yield self.serialize_user(cursor.fetchone())
                dict_order['user'] = user
                
                # put into matches dict to pair all orders with corresponding match
                if dict_order.get('match').get('id') not in matches.keys():
                    matches[dict_order.get('match').get('id')] = { 
                        'id': dict_order.get('match').get('id'), 
                        'status': dict_order.get('match').get('status'),
                        'orders': [dict_order],
                        'first_msg': dict_order.get('match').get('first_msg')
                        }
                else:
                    matches[dict_order.get('match').get('id')]['orders'].append(dict_order)
            self.set_status(200)
            self.finish(json.dumps(matches, default=json_serial))




class OrdersHandler(BaseHandler):

    @gen.coroutine
    def post(self):
        body = json.loads( self.request.body.decode('utf-8') )
        item_id = body.get('item_id')
        buyer_id = body.get('buyer_id')
        match_id = body.get('match_id')


        if (item_id, buyer_id, match_id) is not None:
            cursor = yield self.db.execute(
                '''
                insert into orders (item_id, buyer_id, match_id)
                values (%(item_id)s, %(buyer_id)s, %(match_id)s)
                returning *;
                ''', {
                    'item_id': item_id,
                    'buyer_id': buyer_id,
                    'match_id': match_id
                }
            )

            momoko_order = cursor.fetchone()
            order = yield self.serialize_order(momoko_order)
            self.set_status(200)

            self.finish(json.dumps(order, default=json_serial))



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
                    and status <> %(matched_status)s
                    and arrival_date > now();
                ''', 
                {
                    'city_id': res_city.get('id'),
                    'buyer_traveller_id': buyer_traveller_id,
                    'matched_status': trip_statuses.get('matched')
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
            self.write("There was an error. Email support@getferry.com, we'll get back to you within the hour.")
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


class SendHandler(BaseHandler):

    @gen.coroutine
    def post(self):
        body = json.loads( self.request.body.decode('utf-8') )

        buyer_name = body.get('buyer_name')
        traveller_name = body.get('traveller_name')
        buyer_email = body.get('buyer_email')
        traveller_email = body.get('traveller_email')
        message = body.get('message')
        match_id = body.get('match_id')

        if (buyer_name, traveller_name, buyer_email, traveller_email, message, match_id) is not None:

            # send message
            response = send_simple_message(message, buyer_name, traveller_name, buyer_email, traveller_email)

            # update message in match
            yield self.db.execute(
                '''
                update matches
                set first_msg=%(message)s
                where id=%(match_id)s;
                ''', {
                    'message': message,
                    'match_id': match_id
                }
            )

            self.set_status(200)
            self.finish("message sent!")


class ItemsHandler(BaseHandler):

    @gen.coroutine
    def get(self):
        cursor = yield self.db.execute(
            '''
            select * from items
            where status='alive';
            '''
        )

        items = []
        for item in cursor.fetchall():
            dict_item = yield self.serialize_item(item)
            items.append(dict_item)
        

        self.set_status(200)
        self.finish(json.dumps(items, default=json_serial))


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
            (r'/buyers', BuyersHandler),
            (r'/orders', OrdersHandler),
            (r'/matches', MatchesHandler),
            (r'/orders/list', OrdersListHandler),
            (r'/send', SendHandler),
            (r'/items', ItemsHandler),

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