'''
Link check_lint script to a manage.py commanD
'''

from django.core.management import BaseCommand
from ._script import run_script


class Command(BaseCommand):
    '''
    Run lint checkers
    '''
    help = "Run lint checkers"

    def handle(self, *args, **options):
        run_script('./scripts/check_lint')
