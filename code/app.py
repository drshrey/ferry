import tornado
from tornado import gen

from routes.auth_handlers import auth_handlers
from routes.service_handlers import service_handlers
from routes.template_handlers import template_handlers
from routes.user_handlers import user_handlers

from tools import crypto

import os

port = 7778

mypath = os.path.dirname(os.path.realpath(__file__))

if 'PERSISTENT_PATH' in os.environ:
    PERSISTENT_PATH = os.environ['PERSISTENT_PATH']
    # in case they specify with trailing comma
    if PERSISTENT_PATH[-1] == '/':
        PERSISTENT_PATH = PERSISTENT_PATH[:-1]
else:
    PERSISTENT_PATH = mypath

# create cookie_secret if it doesn't exist
if not os.path.exists(mypath + '/cookie_secret'):
    with open(mypath + '/cookie_secret', 'wb') as outfile:
        outfile.write(str(crypto.random_integer(10**4)).encode())

with open(mypath + '/cookie_secret', 'rb') as infile:
    COOKIE_SECRET = infile.read()

settings = {
    'cookie_secret': str(COOKIE_SECRET),
    'login_url': '/login',
    'debug': True
}


application = tornado.web.Application(
    [
        *template_handlers,
        *service_handlers,
        *auth_handlers,
        *user_handlers,


        ## STATIC HANDLERS ##
        (r'/css/(.+)', tornado.web.StaticFileHandler, {'path': './static/css/'}),
        (r'/js/(.+)', tornado.web.StaticFileHandler, {'path': './static/js/'}),
        (r'/images/(.+)', tornado.web.StaticFileHandler, {'path': './static/images/'}),
        (r'/(favicon\.ico)', tornado.web.StaticFileHandler, {'path': './favicons/'})
    ],
    **settings
)


if __name__ == '__main__':
    application.listen(port)
    print('starting tornado server on port %s' % port)
    tornado.ioloop.IOLoop().instance().start()
