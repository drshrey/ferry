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


auth_handlers = [
    (r'/login', LoginHandler),
    (r'/logout', LogoutHandler)
]