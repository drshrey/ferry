import datetime

def datetime_handler(x):    
    if isinstance(x, datetime.datetime):
        return x.strftime('%H:%M:%S — %B %d, %Y')
    raise TypeError("Unknown type") 
