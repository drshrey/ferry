import os
from tools import crypto
import sys
import json


def tornado_app_config_setup():
    """tornado_app_config_setup provides the relevant information
    for initializing a tornado app"""

    PORT = None
    
    try:
        with open('config.json', 'r') as config_file:
            config = json.loads(config_file.read())
            
            PORT = config.get('port')
            PERSISTENT_PATH = config.get('persistent_path', None)

    except Exception as e:
        print("""
            {exception}
            Error in reading config.json
        
        """.format(exception=e))
        sys.exit(0)

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

    SETTINGS = {
        'cookie_secret': COOKIE_SECRET,
        'login_url': '/login',
        'debug': True
    }
    port = 7778

    return {
        'persistent_path': PERSISTENT_PATH,
        'cookie_secret': COOKIE_SECRET,
        'port': PORT,
        'settings': SETTINGS
    }

## EOF ##