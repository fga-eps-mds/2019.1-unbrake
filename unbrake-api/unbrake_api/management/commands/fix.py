'''
Link check_format script to a manage.py commanD
'''

from django.core.management import BaseCommand
from ._script import run_script


class Command(BaseCommand):
    '''
    Fix some formatting fixes
    '''
    help = "Fix some formatting fixes"

    def handle(self, *args, **options):
        run_script('./scripts/fix')
