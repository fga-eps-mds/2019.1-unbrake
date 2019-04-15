'''
Link check_all script to a manage.py command
'''

from django.core.management import BaseCommand
from ._script import run_script


class Command(BaseCommand):
    '''
    Run general script for checking
    '''
    help = "Run general script for checking"

    def handle(self, *args, **options):
        run_script('./scripts/check_all')
