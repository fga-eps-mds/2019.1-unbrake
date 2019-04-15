'''
Link check_tests script to a manage.py commanD
'''

from django.core.management import BaseCommand
from ._script import run_script


class Command(BaseCommand):
    '''
    Check if tests are OK
    '''
    help = "Check if tests are OK"

    def handle(self, *args, **options):
        run_script('./scripts/check_tests')
