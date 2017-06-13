from tornado import gen

import json
import psycopg2
import momoko

import decimal

from tools import crypto
from routes.base import BaseHandler

class ShopHandler(BaseHandler):  

    @gen.coroutine
    def get(self, city):
        print(city)
        self.write(json.dumps(
            [1,2,3,4]
        ))

shop_handlers = [
    (r'/shop/(.*)', ShopHandler),
]