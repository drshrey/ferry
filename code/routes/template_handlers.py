from tornado import gen
from tornado.web import authenticated

from routes import datastore, Size
from routes.auth_handlers import AuthenticatedHandler

from tools.date import datetime_handler

class DashboardHandler(AuthenticatedHandler):
    @authenticated
    def get(self):
        self.render(
            '../templates/dashboard.html',
            user=self.get_current_user()
        )

class TravelInfoHandler(AuthenticatedHandler):

    def get(self):
        user = self.get_current_user()
        self.render(
            '../templates/travel-info.html',
            user=user
        )


class TravelHandler(AuthenticatedHandler):

    @authenticated
    def get(self):
        user = self.get_current_user()
        user_entry = datastore['users'].find_one(email=user)

        delete_trip_id = self.get_argument('delete_trip_id', None)

        if delete_trip_id is not None:
            trip = datastore['trips'].find_one(id=delete_trip_id)
            # check if matches 
            match = datastore['matches'].find_one(trip_id=trip['id'])
            if match is not None:
                # charge customer

                # delete trip
                # delete match
                datastore['matches'].delete(id=match['id'])
            datastore['trips'].delete(id=delete_trip_id)
            return


        trips = [x for x in datastore['trips'].find(traveller_id=user_entry['id'])]
        airports = [x for x in datastore['airports'].all()]
        import json

        for trip in trips:
            # see if match exists
            match = datastore['matches'].find_one(trip_id=trip['id'])
            destination = datastore['airports'].find_one(id=trip['destination_airport_id'])
            origin = None
            if trip['origin_airport_id'] is not None:
                origin = datastore['airports'].find_one(id=trip['origin_airport_id'])
            
            if destination is not None:
                trip['destination'] = destination
            if origin is not None:
                trip['origin'] = origin
            
            if match is not None:
                trip['match'] = match
                trip['status'] = 'matched'
            else:
                trip['status'] = 'pending'

            trip['departure_date'] = trip['departure_date'].__str__().split(' ')[0]
            
            if trip['arrival_date'] is not None:
                trip['arrival_date'] = trip['arrival_date'].__str__().split(' ')[0]

        self.render(
            '../templates/travel.html',
            user=user,
            trips=[trip for trip in reversed(trips)],
            user_entry=user_entry,
            jsonuser=json.dumps(user_entry, default=datetime_handler),   
            airports=airports
        )

    def post(self):
        user = self.get_current_user()
        user_entry = datastore['users'].find_one(email=user)

        arrival_city = self.get_body_argument('arrival_city', None)
        arrival_date = self.get_body_argument('arrival_date', None)

        flight_number = self.get_body_argument('flight_number', None)
        size = self.get_body_argument('size', None)


        if (user_entry, arrival_city, arrival_date, flight_number) is not None:
            print(destination, arrival_date, flight_number)

            destination_airport_entry = datastore['airports'].find_one(initials=departure_city)
            origin_airport_entry = datastore['airports'].find_one(initials=origin_city)

            import datetime

            # FAKE FUCKING ARRIVAL DATE
            ## THIS IS TO MANUALLY GO IN AND CHANGE ALL THE ONSS
            ## THAT ARE REVIEWED AND NEW
            departure_date = datetime.datetime(1999, 1, 1)

            datastore['trips'].insert({
                'origin_airport_id': None,
                'traveller_id': user_entry['id'],
                'destination_airport_id': destination_airport_entry['id'],
                'departure_date': departure_date,
                'arrival_date': str_to_date(departure_date),
                'flight_number': flight_number,
                'size': size,
                'created_at': datetime.datetime.now()
            })

            self.redirect('/travel')



def str_to_date(date_str):

    import datetime
    try:
        return datetime.datetime.strptime(date_str, '%Y-%m-%d')
    except:
        return None


class CheckoutHandler(AuthenticatedHandler):

    def post(self):
        user = self.get_current_user()

        if user is not None:

            user_entry = datastore['users'].find_one(email=user)

            credit_card_number = self.get_body_argument('credit_card_number', None)
            cvc = self.get_body_argument('cvc', None)
            expiration_date = self.get_body_argument('expiration-date', None)


            self.render(
                '../templates/checkout.html',
                user=user,
                user_entry=user_entry,
                msg=''
            )
        else:
            self.render(
                '../templates/sign_in_checkout.html',
                user=None,
                msg=''
            )            


class ProfileHandler(AuthenticatedHandler):

    @authenticated
    def get(self):
        import json
        user = self.get_current_user()
        user_entry = datastore['users'].find_one(email=user)

        page = self.get_argument('page', None)
        if page == 'travel':
            validated = self.get_argument('validated', True)
            if validated == 'False':
                validated = False

            success = self.get_argument('success', None)
            if success == 'False':
                self.render(
                    '../templates/traveller_info.html',
                    user=user,
                    user_entry=user_entry,
                    json_user=json.dumps(user_entry),
                    msg='Something went wrong, please try again or contact <a href="mailto:help@ferry.com">help@ferry.com</a> if you continue to have problems.',
                    validated=validated
                )
            elif success == 'True':
                self.render(
                    '../templates/traveller_info.html',
                    user=user,
                    user_entry=user_entry,
                    json_user=json.dumps(user_entry),
                    msg="You've successfully updated your traveller information!",
                    validated=validated
                )
            else:                
                self.render(
                    '../templates/traveller_info.html',
                    user=user,
                    user_entry=user_entry,
                    json_user=json.dumps(user_entry),
                    msg="",
                    validated=validated
                )
        elif page == 'orders':
            self.render(
                '../templates/orders.html',
                user=user,
                user_entry=user_entry,
                json_user=json.dumps(user_entry),
                msg="",
                orders=[]
            )     
        elif page == 'pay':
            self.render(
                '../templates/payment.html',
                user=user,
                user_entry=user_entry,
                json_user=json.dumps(user_entry),
                msg=""
            )     
        elif page == 'account':
            self.render(
                '../templates/account.html',
                user=user,
                user_entry=user_entry,
                json_user=json.dumps(user_entry),
                msg=""
            )     
        elif page == 'invite':
            self.render(
                '../templates/invite.html',
                user=user,
                user_entry=user_entry,
                json_user=json.dumps(user_entry),
                msg=""
            )              
        else:
            self.render('../templates/404.html', user=user, user_entry=user_entry, msg="404 Page Not Found.")


    def save_payment(self, user):
        card_number = self.get_body_argument('card_number', None)
        cvc = self.get_body_argument('cvc', None)
        expiration_month = self.get_body_argument('expiration_month', None)
        expire_year = self.get_body_argument('expire_year', None)

        if (card_number, cvc, expiration_month, expire_year) is not None:
            datastore['users'].update({
                'id': user['id'],
                'card_number': card_number,
                'cvc': cvc,
                'expiration_month': expiration_month,
                'expire_year': expire_year
            }, ['id'])
            return "Successfully saved payment information!"
        return "Failure!"

    def save_shipping(self, user):
        first_name = self.get_body_argument('first_name', None)
        last_name = self.get_body_argument('last_name', None)
        shipping_address = self.get_body_argument('shipping_address', None)
        apt_num = self.get_body_argument('apt_num', None)
        state = self.get_body_argument('state', None)

        if (first_name, last_name, shipping_address, apt_num, state) is not None:
            datastore['users'].update({
                'id': user['id'],
                'first_name': first_name,
                'last_name': last_name,
                'shipping_address': shipping_address,
                'apt_num': apt_num,
                'state': state
            }, ['id'])
            return "Successfully saved shipping information!"
        return "Failure!"

    def post(self):
        user = self.get_current_user()
        user_entry = datastore['users'].find_one(email=user)
        import json

        # check if shipping or payment
        save_type = self.get_body_argument('type', None)
        
        if save_type == 'payment':
            msg = self.save_payment(user_entry)
            user_entry = datastore['users'].find_one(email=user)
            self.render('../templates/profile.html',
                user=user,
                user_entry=user_entry,
                json_user=json.dumps(user_entry),
                msg=msg)
        elif save_type == 'shipping':
            msg = self.save_shipping(user_entry)
            user_entry = datastore['users'].find_one(email=user)
            self.render('../templates/profile.html',
                user=user,
                user_entry=user_entry,
                json_user=json.dumps(user_entry),
                msg=msg)

        user_entry = datastore['users'].find_one(email=user)
        self.render(
            '../templates/profile.html',
            user=user,
            user_entry=user_entry,
            json_user=json.dumps(user_entry),
            msg=""
        )





class BuyItemsHandler(AuthenticatedHandler):

    def post(self):

        total = self.get_body_argument('total', None)
        commission = self.get_body_argument('commission', None)
        item_price_total = self.get_body_argument('item_price_total', None)
        cart = self.get_body_argument('cart', None)
        trip = self.get_body_argument('trip', None)
        destination = self.get_body_argument('destination', None)
        payment_info = self.get_body_argument('payment_info', None)
        email = self.get_body_argument('email', None)

        import json

        if (total, commission, item_price_total, cart, \
                trip, destination, payment_info, email) is not None:        
            total = float(total)
            commission = float(commission)
            item_price_total = float(item_price_total)
            cart = json.loads(cart)
            trip = json.loads(trip)
            payment_info = json.loads(payment_info)

            import datetime
            from uuid import uuid4

            order_id = uuid4().__str__()


            # create order DB entry
            for item in cart.items():
                datastore['orders'].insert({
                    'item_id': int(item[1]['item_id']),
                    'base_delivery_fee': 50,
                    'commission_fee': commission,
                    'created_at': datetime.datetime.now(),
                    'buyer_id': email,
                    'order_id': order_id,
                    'product_price': float(item[1]['price']),
                    'stripe_payment_id': 'None'
                })
                datastore['matches'].insert({
                    'order_id': order_id,
                    'trip_id': trip['id'],
                    'created_at': datetime.datetime.now()
                })


            # buy items from amazon (fake for now)

            # post through stripe (fake for now)

            # send confirmation email to traveller
            traveller = datastore['users'].find_one(id=trip['traveller_id'])
            # traveller = datastore['users'].find_one(user_id=traveller['user_id'])


            send_simple_message(subject='Order made for your trip! Items coming',
                text="""
                Hey {},

                We found you an order coming your way, to dropoff at:

                {}.
                The items listed are: {}

                We've shipped the buyer's items from Amazon, and you can click this link
                to see the order status of all the items.

                Thanks,
                Friends at Ferry
                """.format(
                    'shreyas',
                    destination,
                    cart
                ),
                email=traveller['email'])

            # send confirmation email to buyer
            send_simple_message(subject='Order made for your trip! Items coming',
                text="""
                Hey {},

                Thank you for buying with Ferry.

                To confirm, these are the requested items:
                {}.

                You'll be picking them up at {} from {}.

                We've shipped your items, and you can click this link
                to see the order status of all the items, from Amazon shipment
                to the moment it's handed to you.

                Thanks,
                Friends at Ferry
                """.format(
                    email,
                    cart,
                    traveller,
                    destination
                ),
                email=email)            

            self.render(
                '../templates/done.html',
                destination=destination,
                user=self.get_current_user(),
                user_entry=datastore['users'].find_one(email=user)
            )


class FindHandler(AuthenticatedHandler):

    def unmatched_trip(self, trip):
        match = datastore['matches'].find_one(trip_id=trip['id'])
        if match is not None:
            return False
        return True

    def find_trips(self, location):
        import datetime
        now = datetime.datetime.now()
        user = self.get_current_user()
        trips = []
        if user is not None:
            user_entry = datastore['users'].find_one(\
                email=user)
            query = """
            select * from trips
            where destination_airport_id={}
            and traveller_id <> '{}'
            and arrival_date > '{}';
            """.format(location, user_entry['id'], now)
            trips = [x for x in datastore.query(query) if self.unmatched_trip(x)]
        else:
            query = """
            select * from trips
            where destination_airport_id={}
            and arrival_date > '{}';
            """.format(location, now)
            trips = [x for x in datastore.query(query) if self.unmatched_trip(x)]

        max_size = Size.SMALL
        STR_TO_NUM_SIZE = {
            'small': 3,
            'medium': 6, 
            'large': 10,
        }

        for trip in trips:
            size = STR_TO_NUM_SIZE[trip['size']]
            if size > max_size:
                max_size = size
        return (trips, max_size)


    def get_items(self, max_size):
        query = """
        select * from items
        where size <= {};
        """.format(max_size)

        items = [x for x in datastore.query(query)]
        return items

    def post(self):
        location = self.get_body_argument('location', None)
        user = self.get_current_user()
        user_entry = datastore['users'].find_one(email=user)

        airport = datastore['airports'].find_one(id=int(location))

        # find trips
        trips, max_size = self.find_trips(int(location))
        if len(trips) == 0:
            import datetime
            if user is not None:
                user_entry = datastore['users'].find_one(email=user)
                datastore['order_requests'].insert({
                    'email': user_entry['email'],
                    'created_at': datetime.datetime.now(),
                    'destination_airport_id': int(location),
                    'status': 'active'
                })
                self.render(
                    '../templates/notfound.html',
                    user=user,
                    user_entry=user_entry,
                    location=location,
                    msg="Unfortunatley, nobody's headed to {} right now. You'll get an email as soon as someone does.".format(airport['city_served'])
                )
            else:
                self.render(
                    '../templates/notfound.html',
                    user=user,
                    location=location,
                    msg=""
                )
            return

        airports = [x for x in datastore['airports'].all()]
        items = self.get_items(max_size)
        import json
        self.render(
            '../templates/buy.html',
            trips=json.dumps(trips, default=datetime_handler),
            trip_size=len(trips),
            max_size=max_size,
            items=items,
            user=user,
            user_entry=user_entry,
            airports=airports
        )


class OrdersHandler(AuthenticatedHandler):
    @gen.coroutine
    @authenticated
    def get(self):
        user = self.get_current_user()
        user_entry = datastore['users'].find_one(email=user)
        orders = datastore['orders'].find(buyer_id=user)
        self.render(
            '../templates/orders.html',
            orders=orders,
            user=user,
            user_entry=user_entry)      


class HomeHandler(AuthenticatedHandler):
    def get(self):
        user = self.get_current_user()
        user_entry = datastore['users'].find_one(email=user)
        airports = [x for x in datastore['airports']]

        self.render(
            '../templates/index.html',
            airports=airports,
            user=user,
            user_entry=user_entry
        )

template_handlers = [
    (r'/', HomeHandler),
    (r'/dashboard', DashboardHandler),
    (r'/find', FindHandler),
    (r'/travel', TravelHandler),
    (r'/travel-info', TravelInfoHandler),
    (r'/checkout', CheckoutHandler),
    (r'/finalize_buy', BuyItemsHandler),
    (r'/orders', OrdersHandler),   
    (r'/profile', ProfileHandler),
]