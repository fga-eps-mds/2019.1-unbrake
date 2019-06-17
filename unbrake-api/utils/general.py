'''
For keeping general util functions to the whole project
'''

import os


def get_secret(secret_name):
    '''
    For getting project secrets which are mount on docker-compose files
    '''

    key_file = None
    try:
        key_file = open(os.path.join('/', 'run', 'secrets', secret_name))
    except FileNotFoundError:
        raise FileNotFoundError(
            f"""
            ===================================================================
            '{secret_name}' secret not found.
            Ask the development team the secrets or use your owns.
            ===================================================================
            """
        )

    return key_file.read().strip()
