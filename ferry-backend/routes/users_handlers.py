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

users_handlers = [
    (r'/users', AllUsersHandler),
    (r"/users/([0-9]+)", UsersHandler),
    (r"/users/profile_picture", ProfilePictureHandler)
]