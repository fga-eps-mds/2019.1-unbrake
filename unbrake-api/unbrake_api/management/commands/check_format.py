'''
Link check_format script to a manage.py commanD
'''

import os
from django.core.management import BaseCommand


class Command(BaseCommand):
    '''
    Check if formatting of code is OK
    '''
    help = "Check if formatting of code is OK"

    def handle(self, *args, **options):
        os.system('./scripts/check_format')
