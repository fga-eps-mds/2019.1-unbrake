'''
Link check_tests script to a manage.py commanD
'''

import os
from django.core.management import BaseCommand


class Command(BaseCommand):
    '''
    Check if tests are OK
    '''
    help = "Check if tests are OK"

    def handle(self, *args, **options):
        os.system('./scripts/check_tests')
