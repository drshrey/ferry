from tornado import gen

from routes import datastore
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

    @gen.coroutine
    def login(self, email, password):
        user_entry = datastore['users'].find_one(email=email)


        # valid login
        if user_entry is not None and crypto.hash(
            password,
            email,
            user_entry['salt']
        ) == user_entry['hash']:

            self.set_secure_cookie(
                'user',
                email,
                expires_days=3
            )
            return True

        # invalid login
        else:
            yield gen.sleep(1)
            return False


class LogoutHandler(AuthenticatedHandler):
    def get(self):
        self.set_secure_cookie('user', '')
        self.redirect('/')


class LoginHandler(AuthenticatedHandler):
    def get(self):
        self.render(
            '../templates/login.html',
            bad_login=False
        )

    @gen.coroutine
    def post(self):
        email = self.get_body_argument('email')
        password = self.get_body_argument('password')
        login = yield self.login(email, password)
        if login:
            self.redirect('/')
        else:
            self.render(
                '../templates/login.html',
                bad_login=True,
            )

class SignupHandler(AuthenticatedHandler):
    def get(self):
        self.render(
            '../templates/signup.html',
            bad_signup=False
        )

    @gen.coroutine
    def post(self):
        yield gen.sleep(0.5)

        email = self.get_body_argument('email', None)
        if datastore['users'].find_one(email=email) is not None:
            # this user already exists
            self.render('../templates/signup.html',
                bad_signup=True)
        else:

            password = self.get_body_argument('password')
            salt = crypto.salt()
            user_id = crypto.user_id()
            first_name = self.get_body_argument('first_name')
            last_name = self.get_body_argument('last_name')

            datastore['users'].insert({
                'user_id': user_id,
                'email': email,
                'salt': salt,
                'card_number': '',
                'cvc': '',
                'expiration_month': '',
                'expire_year': '',
                'shipping_address': '',
                'validated': False,
                'state': '',
                'first_name': first_name,
                'last_name': last_name,
                'apt_num': '',
                'hash': crypto.hash(password, email, salt),
            })
            self.set_secure_cookie(
                'user',
                email,
                expires_days=3
            )
            self.redirect('/')


class LoginWithCheckoutHandler(AuthenticatedHandler):

    @gen.coroutine
    def post(self):
        email = self.get_body_argument('email', None)
        password = self.get_body_argument('password', None)


        login = yield self.login(email, password)
        if login:
            user_entry = datastore['users'].find_one(email=email)
            self.render(
                '../templates/billing.html',
                msg='',
                user=email,
                user_entry=user_entry
                )
        else:
            self.render(
                '../templates/welcome_back.html',
                email=email,
                user=None,
                msg="Invalid username or password. Please try again."
            )


class SignupWithCheckoutHandler(AuthenticatedHandler):

    @gen.coroutine
    def post(self):
        yield gen.sleep(0.5)

        email = self.get_body_argument('email', None)
        first_name = self.get_body_argument('first_name', None)
        last_name = self.get_body_argument('last_name', None)

        if datastore['users'].find_one(email=email) is not None:
            # this user already exists
            self.render('../templates/new_user.html',
                msg="User already exists.",
                user=None,
                first_name=first_name,
                last_name=last_name,
                email=''
                )
        else:
            password = self.get_body_argument('password', None)
            confirm_password = self.get_body_argument('confirm-password', None)

            if password != confirm_password:
                self.render('../templates/new_user.html',
                msg="Passwords don't match.",
                user=None,
                email=email,
                first_name=first_name,
                last_name=last_name)

            salt = crypto.salt()
            user_id = crypto.user_id()

            datastore['users'].insert({
                'user_id': user_id,
                'email': email,
                'salt': salt,
                'card_number': '',
                'cvc': '',
                'expiration_month': '',
                'expire_year': '',
                'shipping_address': '',
                'validated': False,
                'state': '',
                'first_name': first_name,
                'last_name': last_name,
                'apt_num': '',
                'hash': crypto.hash(password, email, salt),
            })
            self.set_secure_cookie(
                'user',
                email,
                expires_days=3
            )
            self.render(
                '../templates/billing.html',
                msg='',
                user=email,
                user_entry=datastore['users'].find_one(email=email)
            )


auth_handlers = [
    (r'/login_with_checkout', LoginWithCheckoutHandler),
    (r'/signup_with_checkout', SignupWithCheckoutHandler),
    (r'/signup', SignupHandler),
    (r'/login', LoginHandler),
    (r'/logout', LogoutHandler)
]
