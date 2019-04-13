'''
Link check_format script to a manage.py commanD
'''

import os
from django.core.management import BaseCommand


class Command(BaseCommand):
    '''
    Fix some formatting fixes
    '''
    help = "Fix some formatting fixes"

    def handle(self, *args, **options):
        os.system('./scripts/fix')
