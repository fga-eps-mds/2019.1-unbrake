'''
Link check_format script to a manage.py commanD
'''

from django.core.management import BaseCommand
from ._script import run_script


class Command(BaseCommand):
    '''
    Check if formatting of code is OK
    '''
    help = "Check if formatting of code is OK"

    def handle(self, *args, **options):
        run_script('./scripts/check_format')
