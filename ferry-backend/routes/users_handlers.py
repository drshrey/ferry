from tornado import gen

import json
import psycopg2
import momoko

import decimal

from tools import crypto
from routes.base import BaseHandler

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
            self.write(e.__str__())
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


users_handlers = [
    (r'/users', AllUsersHandler),
    (r"/users/([0-9]+)", UsersHandler)
]