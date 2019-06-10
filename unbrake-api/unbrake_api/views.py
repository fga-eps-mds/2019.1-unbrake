'''
Views of general purpose on Unbrake API
'''

from django.http import HttpResponse


def get_mqtt_reading_key(request):
    '''
    Route for getting key with reading permission of unbrake MQTT broker
    '''
    key_file = None
    try:  # On run
        key_file = open('/run/secrets/mqtt-reading-key')
    except FileNotFoundError:
        raise FileNotFoundError(
            """
            ===================================================================
            'MQTT_READING_KEY' secret not found.
            Ask the development team the secrets or use your owns.
            ===================================================================
            """
        )
    return HttpResponse(key_file.read())
