import dataset
import sqlalchemy
import json
from uuid import uuid4
from tools import crypto
import datetime
import os

db = dataset.connect(os.environ['DB_FQDN'])

def init():
	db.create_table('users')
	db.create_table('traveller_profiles')
	db.create_table('trips')
	db.create_table('orders')
	db.create_table('matches')
	db.create_table('items')
	db.create_table('airports')


	airports = db.get_table('airports')
	users = db.get_table('users')
	travellers = db.get_table('travellers')
	trips = db.get_table('trips')
	orders = db.get_table('orders')
	matches = db.get_table('matches')
	items = db.get_table('items')



	airports.create_column('airport_id', sqlalchemy.String)
	airports.create_column('name', sqlalchemy.String)
	airports.create_column('initials', sqlalchemy.String)
	airports.create_column('created_at', sqlalchemy.DateTime)
	airports.create_column('city_served', sqlalchemy.String)
	airports.create_column('type', sqlalchemy.String)

	users.create_column('user_id', sqlalchemy.String)
	users.create_column('user', sqlalchemy.String)
	users.create_column('photo', sqlalchemy.String)
	users.create_column('email', sqlalchemy.String)
	users.create_column('hash', sqlalchemy.String)
	users.create_column('salt', sqlalchemy.String)
	users.create_column('first_name', sqlalchemy.String)
	users.create_column('last_name', sqlalchemy.String)
	users.create_column('city', sqlalchemy.String)
	users.create_column('default_airport_id', sqlalchemy.Integer)
	users.create_column('state', sqlalchemy.String)
	users.create_column('zip_code', sqlalchemy.String)
	users.create_column('apt_num', sqlalchemy.String)
	
	users.create_column('account_number', sqlalchemy.String)
	users.create_column('routing_number', sqlalchemy.String)

	
	users.create_column('expiration_month', sqlalchemy.String)
	users.create_column('expire_year', sqlalchemy.String)
	users.create_column('card_number', sqlalchemy.String)
	users.create_column('cvc', sqlalchemy.String)
	users.create_column('shipping_address', sqlalchemy.String)
	users.create_column('validated', sqlalchemy.Boolean)


	travellers.create_column('user_id', sqlalchemy.Integer)
	travellers.create_column('verified', sqlalchemy.Boolean)

	trips.create_column('origin_airport_id', sqlalchemy.Integer)
	trips.create_column('traveller_id', sqlalchemy.Integer)
	trips.create_column('destination_airport_id', sqlalchemy.Integer)
	trips.create_column('departure_date', sqlalchemy.DateTime)
	trips.create_column('arrival_date', sqlalchemy.DateTime)
	trips.create_column('flight_number', sqlalchemy.String)
	trips.create_column('size', sqlalchemy.String)
	trips.create_column('created_at', sqlalchemy.DateTime)


	orders.create_column('item_id', sqlalchemy.Integer)
	orders.create_column('stripe_payment_id', sqlalchemy.String)
	orders.create_column('buyer_id', sqlalchemy.String)
	orders.create_column('product_price', sqlalchemy.Float)
	orders.create_column('base_delivery_fee', sqlalchemy.Float)
	orders.create_column('commission_fee', sqlalchemy.Float)
	orders.create_column('order_id', sqlalchemy.String)
	orders.create_column('created_at', sqlalchemy.DateTime)


	matches.create_column('order_id', sqlalchemy.Integer)
	matches.create_column('trip_id', sqlalchemy.Integer)
	matches.create_column('created_at', sqlalchemy.DateTime)


	items.create_column('amazon_id', sqlalchemy.Integer)
	items.create_column('created_at', sqlalchemy.DateTime)
	items.create_column('size', sqlalchemy.Integer)
	items.create_column('image_path', sqlalchemy.String)
	items.create_column('title', sqlalchemy.String)


import random
import time

def strTimeProp(start, end, format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formated in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """

    stime = time.mktime(time.strptime(start, format))
    etime = time.mktime(time.strptime(end, format))

    ptime = stime + prop * (etime - stime)

    return time.localtime(ptime)


def randomDate(start, end, prop):
    return strTimeProp(start, end, '%m/%d/%Y %I:%M %p', prop)


def init_trips(trips):
	from haikunator import Haikunator
	h = Haikunator()
	origin_cities = ['San Francisco, USA', 'New York City, USA', 'Chicago, USA']
	dest_cities = ['San José - Juan Santamaría', 'San José - Tobías Bolaños', 'Limón International', 'Liberia - Daniel Oduber Quirós']
	for i in range(trips):
		# create user
		user_id = uuid4()
		password = 'idaman'
		username = h.haikunate()
		salt = crypto.salt()

		user = {
			'user_id': user_id.__str__(),
			'user': username,
			'email': 'foo@gmail.com',
			'salt': salt,
			'hash': crypto.hash(password, username, salt)
		}
		db['users'].insert(user)

		user = db['users'].find_one(user_id=user_id.__str__())

		departure_date = datetime.datetime(2017, random.choice(range(3,7)), random.choice(range(1,30)), \
			random.choice(range(1,24)), random.choice(range(1,60)),1 )
		incremented_day = departure_date.day + 1
		arrival_date = datetime.datetime(departure_date.year, departure_date.month, incremented_day, 
			random.choice(range(1,24)), random.choice(range(1,60)), 1)

		# create trip
		db['trips'].insert({
			'origin': random.choice(origin_cities),
			'traveller_id': user['id'],
			'destination': random.choice(dest_cities),
			'departure_date': departure_date,
			'arrival_date': arrival_date,
			'flight_number': 'FA-{}'.format(random.choice(range(100,300))),
			'size': random.choice(['small', 'medium', 'large']),
			'created_at': datetime.datetime.now()
		})


def init_airports():
	import datetime
	all_airports = [
		('JFK', 'John F. Kennedy International Airport', 'origin', 'New York, NY'),
		('SFO', 'San Francisco International Airport', 'origin', 'San Francisco, CA'),
		('LAX', 'Los Angeles International Airport', 'origin', 'Los Angeles, CA'),
		('SJO', 'Juan Santamaría International Airport', 'destination', 'San Jose, Costa Rica'),
		('SYQ', 'Tobías Bolaños International Airport', 'destination', 'San Jose, Costa Rica'),
		('LIO', 'Limón International Airport', 'destination', 'Limon, Costa Rica'),
		('LIR', 'Daniel Oduber Quirós International Airport', 'destination', 'Liberia, Costa Rica')
	]
	
	for airport in all_airports:
		from uuid import uuid4
		airport_id = uuid4()
		db['airports'].insert({
			'created_at': datetime.datetime.now(),
			'name': airport[1],
			'initials': airport[0],
			'airport_id': airport_id.__str__(),
			'type': airport[2],
			'city_served': airport[3]
		})


def init_items():
	import datetime
	with open('inventory.json', 'r') as items:
		items = json.load(items)
		for idx, item in enumerate(items):
			db['items'].insert({
				'created_at': datetime.datetime.now(),
				'size': item['size'],
				'image_path': item['file-path'],
				'price': item['price'],
				'title': item['title'],
				'href': item['href']
			})

if __name__ == '__main__':
	init()
	init_airports()
	init_items()






