from tornado import gen
import json
from routes.base import BaseHandler

from tools import crypto

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
        email = self.get_body_argument('email')
        password = self.get_body_argument('password')

        try:
            cursor = yield self.db.execute(
                '''
                select * from users where email=%(email)s;
                ''',{
                    'email': email,
                }
            )
            user = yield self.serialize_user(cursor.fetchone())

            if not user:
                self.set_status(400)
                self.finish()
            else:
                if crypto.hash(password, email, user.get('salt')) == user.get('hash'):
                    self.write(json.dumps(user))
                    self.set_status(200)
                    self.finish()            
                else:
                    self.set_status(400)
                    self.finish()
        except Excpetion as e:
            print(e)
            self.set_status(500)
            self.finish()
            self.write(e.__str__())


auth_handlers = [
    (r'/login', LoginHandler),
    (r'/logout', LogoutHandler)
]