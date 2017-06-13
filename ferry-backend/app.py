import os
import tornado
import tornado.httpserver

from tools import setup

from tornado import gen
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.options import parse_command_line
from tornado import web

import psycopg2
import momoko

from routes.trips_handlers import trips_handlers
from routes.users_handlers import users_handlers
from routes.auth_handlers import auth_handlers
from routes.travellers_handlers import travellers_handlers
from routes.shop_handlers import shop_handlers

app_config = setup.tornado_app_config_setup()

PERSISTENT_PATH = app_config.get('persistent_path', None)
COOKIE_SECRET = app_config.get('cookie_secret', None)
PORT = app_config.get('port', None)
SETTINGS = app_config.get('settings', None)

application = None
if (PERSISTENT_PATH, COOKIE_SECRET, PORT, SETTINGS) is not None:


    application = tornado.web.Application(
        [
            *trips_handlers,
            *users_handlers,
            *auth_handlers,
            *travellers_handlers,
            *shop_handlers,

            ## STATIC HANDLERS ##
            (r'/static/(.+)', tornado.web.StaticFileHandler, {'path': './static/'}),
            (r'/css/(.+)', tornado.web.StaticFileHandler, {'path': './static/css/'}),
            (r'/js/(.+)', tornado.web.StaticFileHandler, {'path': './static/js/'}),
            (r'/images/(.+)', tornado.web.StaticFileHandler, {'path': './static/images/'})
        ],
        **SETTINGS
    )


if __name__ == '__main__':
    if application is not None:
        ioloop = IOLoop.instance()

        application.db = momoko.Pool(
            dsn=os.environ['DB_FQDN'],
            size=1,
            ioloop=ioloop,
        )

        # this is a one way to run ioloop in sync
        future = application.db.connect()
        ioloop.add_future(future, lambda f: ioloop.stop())
        ioloop.start()
        future.result()  # raises exception on connection error

        server = tornado.httpserver.HTTPServer(application, max_buffer_size=10485760000)         
        server.listen(PORT)
        print('Starting Tornado server on port %s' % PORT)
        ioloop.start()
    else:
        print("Error in app_config. Please fix before starting app.")

## EOF ##