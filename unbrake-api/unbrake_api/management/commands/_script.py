'''
General helper module for running scripts
'''

import os
from django.core.management import CommandError


def run_script(script, error_message=''):
    '''
    General function for running scripts
    '''
    return_code = os.system(script)

    if return_code:
        if not error_message:
            error_message = f'{script.split("/")[-1]} failed!'
        raise CommandError(error_message)
