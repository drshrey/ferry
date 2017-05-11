from tornado import gen

import json
import psycopg2
import momoko

import decimal

from routes.base import BaseHandler
        

class TripsHandler(BaseHandler):
    
    @gen.coroutine
    def create_trip(self):
        pass

    @gen.coroutine
    def post(self, item_id=None):
        pass


trips_handlers = [
    (r'/trips', TripsHandler),
]