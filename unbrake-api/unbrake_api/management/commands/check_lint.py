'''
Link check_lint script to a manage.py commanD
'''

import os
from django.core.management import BaseCommand


class Command(BaseCommand):
    '''
    Run lint checkers
    '''
    help = "Run lint checkers"

    def handle(self, *args, **options):
        os.system('./scripts/check_lint')
