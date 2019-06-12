'''
Tests for models of configuration app
'''

# pylint: disable = unused-import
import pytest
from django.test import Client
from configuration.models import Config
from utils.token import create_token

CLIENT = Client()
# First argument are the parameters names
# Second is a tuple of params
# First argument of param is the first parameter name and so on
# id is like the name for the test case
# Is possible to test only one test case with: pytest [file] -k [id]
# pylint: disable = redefined-outer-name, unused-import


@pytest.mark.django_db
def test_config(create_token):
    '''
        This test save a ConfigType object on db,
        require the saved object by graphql,
        and check if the requirement is equal the saved object
    '''
    token = create_token()

    response = {'number': 10,
                'timeBetweenCycles': 20,
                'upperLimit': 32,
                'inferiorLimit': 16,
                'upperTime': 5,
                'inferiorTime': 5,
                'disableShutdown': True,
                'enableOutput': False,
                'temperature': 64,
                'time': 51,
                'name': 'teste',
                'isDefault': False,
                }

    Config(
        number=10,
        time_between_cycles=20,
        upper_limit=32,
        inferior_limit=16,
        upper_time=5,
        inferior_time=5,
        disable_shutdown=True,
        enable_output=False,
        temperature=64,
        time=51,
        name='teste',
        is_default=False,
    ).save()

    result = CLIENT.get(
        '/graphql?query={configAt(id: 1){number,timeBetweenCycles,upperLimit,'
        'inferiorLimit, upperTime, inferiorTime,'
        'disableShutdown, enableOutput, temperature,name, isDefault,time}}',
        HTTP_AUTHORIZATION=token)

    assert result.status_code == 200

    assert result.json()['data']['configAt'] == response


@pytest.mark.django_db
def test_create_config(create_token):
    '''
        This test create an object on db using a post request,
        require the saved object by graphql,
        and check if the requirement is equal the saved object
    '''
    token = create_token()
    create = CLIENT.post(
        '/graphql?query=mutation{createConfig'
        '(number: 10, '
        'timeBetweenCycles: 20, '
        'upperLimit: 32, '
        'inferiorLimit: 16, '
        'upperTime: 5, '
        'inferiorTime: 5, '
        'disableShutdown: true, '
        'enableOutput: false, '
        'temperature: 64, '
        'name: "teste", '
        'time: 51)'
        '{config{number, timeBetweenCycles,upperLimit,inferiorLimit,'
        'upperTime, inferiorTime, disableShutdown,'
        'enableOutput, temperature,name, isDefault, time}}}',
        HTTP_AUTHORIZATION=token)
    assert create.status_code == 200

    result = CLIENT.get(
        '/graphql?query=query{configAt(id: 1){number, timeBetweenCycles,'
        ' upperLimit, inferiorLimit, upperTime, inferiorTime,'
        'disableShutdown, enableOutput, temperature, name, isDefault,time}}',
        HTTP_AUTHORIZATION=token)
    assert result.status_code == 200

    assert create.json()['data']['createConfig']['config'] == result.json()[
        'data']['configAt']
