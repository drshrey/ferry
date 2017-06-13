import tornado.web
from tornado import gen

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
            'trip': trip,
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
            'destination_city': destination_city
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
