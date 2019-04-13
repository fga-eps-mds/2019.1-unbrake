'''
Link check_all script to a manage.py commanD
'''

import os
from django.core.management import BaseCommand


class Command(BaseCommand):
    '''
    Run general script for checking
    '''
    help = "Run general script for checking"

    def handle(self, *args, **options):
        os.system('./scripts/check_all')
