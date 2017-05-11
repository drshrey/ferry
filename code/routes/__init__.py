import dataset
import os

datastore = dataset.connect(os.environ['DB_FQDN'])

class Size(object):
    SMALL = 3
    MEDIUM = 6
    LARGE = 10

#### EOF ####