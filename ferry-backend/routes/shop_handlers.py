from tornado import gen

import json
import psycopg2
import momoko

import decimal

from tools import crypto
from routes.base import BaseHandler

class ShopHandler(BaseHandler):  

    @gen.coroutine
    def post(self):
        req_city = self.get_body_argument('city', None)
        buyer_traveller_id = self.get_body_argument('traveller_id', None)

        cursor = yield self.db.execute('select * from cities;')

        # validate that this is a real city and get id
        res_city = None
        for city in cursor.fetchall():
            dict_city = yield self.serialize_city(city)
            if dict_city.get('name') == req_city:
                res_city = dict_city
                break
        
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
                    'city_id': res_city.get('id')
                })
            
            trips = []
            for trip in cursor.fetchall():
                dict_trip = self.serialize_trip(trip)
                trips.append(dict_trip)

        
            self.write(json.dumps(
                trips
            ))

shop_handlers = [
    (r'/shop', ShopHandler),
]