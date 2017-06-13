from tornado import gen

import json
import psycopg2
import momoko

import decimal

from tools import crypto
from routes.base import BaseHandler

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


travellers_handlers = [
    (r'/travellers', AllTravellersHandler),
    (r"/travellers/([0-9]+)", TravellersHandler)
]