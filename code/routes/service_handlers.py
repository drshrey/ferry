from tornado import gen

from routes import datastore
from routes.auth_handlers import AuthenticatedHandler

from tools.date import datetime_handler

def send_simple_message(subject, text, email):
    import requests
    return requests.post(
        "https://api.mailgun.net/v3/sandbox11f1af74abee422d85f17b60458477e1.mailgun.org/messages",
        auth=("api", "key-97cdbf7ad4918e992b345eb7070aff12"),
        data={"from": "Ferry Support <postmaster@sandbox11f1af74abee422d85f17b60458477e1.mailgun.org>",
              "to": email,
              "subject": subject,
              "text": text})            


class AirportsHandler(AuthenticatedHandler):

    def get(self):
        airports = [x for x in datastore['airports'].all()]
        import json
        self.write(json.dumps(airports, default=datetime_handler))


class OrderRequestsHandler(AuthenticatedHandler):

    @gen.coroutine
    def post(self):
        email = self.get_body_argument('email', None)
        destination = self.get_body_argument('destination', None)

        import datetime
        datastore['order_requests'].insert({
            'email': email,
            'created_at': datetime.datetime.now(),
            'destination_airport_id': int(destination),
            'status': 'active'
        })
        destination = datastore['airports'].find_one(id=destination)

        self.write("""Request submitted successfully. We'll let you know as soon as we find a traveller headed to {}!""".format(destination['name']))


class FlightsHandler(AuthenticatedHandler):
    @gen.coroutine
    def post(self):
        destination = self.get_body_argument('arrival_city', None)
        flight_number = self.get_body_argument('flight_number', None)
        arrival_date = self.get_body_argument('arrival_date', None)
        size = self.get_body_argument('size', None)

        user = self.get_current_user()
        user_entry = datastore['users'].find_one(email=user)

        if destination is not None:
            destination = datastore['airports'].find_one(name=destination)

        from datetime import datetime
        if (destination, flight_number, arrival_date, size) is not None:
            # add flight

            # convert departure date, arrival date into datetime objects

            arrival = datetime.strptime('{}'.format(arrival_date), '%Y-%m-%d')

            datastore['trips'].insert({
                'destination_airport_id': destination['id'],
                'arrival_date': arrival,
                'flight_number': flight_number,
                'created_at': datetime.now(),
                'traveller_id': user_entry['id'],
                'size': size
            })

            # alert any buyers
            requests = datastore['order_requests'].find(destination_airport_id=destination['id'], status='active')
            for request in requests:
                dest_airport = datastore['airports'].find_one(id=destination['id'])
                if request['status'] == 'active' and request['email'] != user_entry['email']:
                    send_simple_message(subject='We found a traveller headed your way!',
                        text="""
                        Hey {},

                        We found a traveller headed to {} landing at {}.
                        Buy your items here at http://getferry.com/buy?airport={}.

                        Thanks,
                        Friends at Ferry
                        """.format(
                            request['email'],
                            dest_airport['city_served'],
                            dest_airport['name'],
                            destination
                        ),
                        email=request['email'])
                    datastore['order_requests'].update({
                        'id': request['id'],
                        'status': 'inactive'
                    }, ['id'])

            return self.write('success')

        return self.write('err')          



class CheckUserHandler(AuthenticatedHandler):

    def post(self):
        email = self.get_body_argument('email', None)
        user = self.get_current_user()

        if email is not None:
            user_entry = datastore['users'].find_one(email=email)
            if user_entry is not None:
                return self.render(
                    '../templates/welcome_back.html',
                    user=None,
                    email=email,
                    msg=''
                )
            else:
                return self.render(
                    '../templates/new_user.html',
                    user=None,
                    msg="",
                    email=email,
                    first_name='',
                    last_name=''
                )
        else:
            return self.write('failure')




service_handlers = [
    (r'/flights', FlightsHandler),
    (r'/airports', AirportsHandler),
    (r'/order_requests', OrderRequestsHandler),
    (r'/check_user', CheckUserHandler)
]
