from tornado import gen
from tornado.web import authenticated

from routes import datastore
from routes.auth_handlers import AuthenticatedHandler


class UpdateUserHandler(AuthenticatedHandler):

    def post(self):
        information = self.get_argument('information')
        user = self.get_current_user()

        if information == 'shipping':
            street_address = self.get_body_argument('street_address', None)
            floor_apt = self.get_body_argument('floor_apt', None)
            city = self.get_body_argument('city', None)
            state = self.get_body_argument('state', None)
            zipcode = self.get_body_argument('zipcode', None)

            account_number = self.get_body_argument('account_number', None)
            routing_number = self.get_body_argument('routing_number', None)

            if (street_address, floor_apt, city, state, zipcode,\
                account_number, routing_number) is not None:
                datastore['users'].update({
                    'email': user,
                    'shipping_address': street_address,
                    'apt_num': floor_apt,
                    'city': city,
                    'state': state,
                    'zip_code': zipcode,
                    'validated': True,
                    'account_number': account_number,
                    'routing_number': routing_number                    
                    }, ['email'])
                return self.redirect('/profile?page=travel&success=True')

            elif (user, street_address, city, state, zipcode) is not None:
                user_entry = datastore['users'].find_one(email=user)
                
                datastore['users'].update({
                    'email': user,
                    'shipping_address': street_address,
                    'apt_num': floor_apt,
                    'city': city,
                    'state': state,
                    'zip_code': zipcode
                }, ['email'])
                return self.redirect('/profile?page=travel&success=True')
            else:
                return self.redirect('/profile?page=travel&success=False')                


        elif information == 'banking':
            account_number = self.get_body_argument('account_number', None)
            routing_number = self.get_body_argument('routing_number', None)

            if (account_number, routing_number) is not None:
                user_entry = datastore['users'].find_one(email=user)
                datastore['users'].update({
                    'email': user,
                    'account_number': account_number,
                    'routing_number': routing_number
                }, ['email'])
                return self.redirect('/profile?page=travel&success=True')
            else:
                return self.redirect('/profile?page=travel&success=False')


        elif information == 'all':
            street_address = self.get_body_argument('street_address', None)
            floor_apt = self.get_body_argument('floor_apt', None)
            city = self.get_body_argument('city', None)
            state = self.get_body_argument('state', None)
            zipcode = self.get_body_argument('zipcode', None)
            
            account_number = self.get_body_argument('account_number', None)
            routing_number = self.get_body_argument('routing_number', None)

            if (street_address, floor_apt, city, state, zipcode,\
                account_number, routing_number) is not None:
                datastore['users'].update({
                    'email': user,
                    'shipping_address': street_address,
                    'apt_num': floor_apt,
                    'city': city,
                    'state': state,
                    'zip_code': zipcode,
                    'validated': True,
                    'account_number': account_number,
                    'routing_number': routing_number                    
                    }, ['email'])
                return self.redirect('/travel')
            else:
                return self.redirect('/profile?page=travel&success=False')


class UpdateAccountHandler(AuthenticatedHandler):

    def post(self):
        user = self.get_current_user()
        user_entry = datastore['users'].find_one(email=user)

        if user is not None:
            photo = self.get_body_argument('photo', None)
            first_name = self.get_body_argument('first_name', None)
            last_name = self.get_body_argument('last_name', None)

            email = self.get_body_argument('email', None)
            password = self.get_body_argument('password', None)

            if photo:
                with open('{}'.format(user_entry['email']), 'w+') as photofile:
                    photofile.write(photo)


            self.redirect('/profile?page=account&success=True')


user_handlers = [
    (r'/update', UpdateUserHandler),
    (r'/update_account', UpdateAccountHandler)    
]