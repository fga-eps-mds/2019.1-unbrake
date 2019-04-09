'''
Tests for models of configuration app
'''

import pytest
from django.test import Client
from configuration.models import CyclesConfig, VelocityConfig, WaitConfig
from configuration.models import ShutdownConfig, AuxiliaryOutputConfig


# First argument are the parameters names
# Second is a tuple of params
# First argument of param is the first parameter name and so on
# id is like the name for the test case
# Is possible to test only one test case with: pytest [file] -k [id]
@pytest.mark.django_db
@pytest.mark.parametrize(
    "number_aux,time_between_cycles_aux", (
        pytest.param(10, 20, id='cycle_test_1'),
    )
)
def test_cycle_config(number_aux, time_between_cycles_aux):
    '''
        This test save a CyclesConfigType object on db,
        require the saved object by graphql,
        and check if the requirement is equal the saved object
    '''

    CyclesConfig(
        number=number_aux,
        time_between_cycles=time_between_cycles_aux,
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={cyclesConfig(id: 1){number, timeBetweenCycles}}')
    assert result.status_code == 200
    cycles_config = result.json()['data']['cyclesConfig']
    assert cycles_config['number'] == number_aux
    assert cycles_config['timeBetweenCycles'] == time_between_cycles_aux


@pytest.mark.django_db
@pytest.mark.parametrize(
    ("number_aux_0,number_aux_1,"
     "time_between_cycles_aux_0, time_between_cycles_aux_1"),
    (pytest.param(10, 20, 20, 10, id='all_cycle_test_1'),
     )
)
def test_all_cycle_config(
        number_aux_0,
        number_aux_1,
        time_between_cycles_aux_0,
        time_between_cycles_aux_1):
    '''
        This test save two CyclesConfigType objects on db,
        require all the saved objects by graphql,
        and check if the requirement is equal the saveds objects
    '''

    CyclesConfig(
        number=number_aux_0,
        time_between_cycles=time_between_cycles_aux_0,
    ).save()

    CyclesConfig(
        number=number_aux_1,
        time_between_cycles=time_between_cycles_aux_1,
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={allCyclesConfig{id, number, timeBetweenCycles}}')
    assert result.status_code == 200
    cycles_config0 = result.json()['data']['allCyclesConfig'][0]
    cycles_config1 = result.json()['data']['allCyclesConfig'][1]
    assert cycles_config0['number'] == number_aux_0
    assert cycles_config0['timeBetweenCycles'] == time_between_cycles_aux_0
    assert cycles_config1['number'] == number_aux_1
    assert cycles_config1['timeBetweenCycles'] == time_between_cycles_aux_1


@pytest.mark.django_db
@pytest.mark.parametrize(
    "upper_limit_aux,inferior_limit_aux", (
        pytest.param(30, 15, id='velocity_test_1'),
    )
)
def test_velocity_config(upper_limit_aux, inferior_limit_aux):
    '''
        This test save a VelocityConfigType object on db,
        require the saved object by graphql,
        and check if the requirement is equal the saved object
    '''

    VelocityConfig(
        upper_limit=upper_limit_aux,
        inferior_limit=inferior_limit_aux,
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={velocityConfig(id: 1){upperLimit, inferiorLimit}}')
    assert result.status_code == 200

    velocity_config = result.json()['data']['velocityConfig']

    assert velocity_config['upperLimit'] == upper_limit_aux
    assert velocity_config['inferiorLimit'] == inferior_limit_aux


@pytest.mark.django_db
@pytest.mark.parametrize(
    ("upper_limit_aux_0,upper_limit_aux_1,"
     "inferior_limit_aux_0, inferior_limit_aux_1"),
    (pytest.param(30, 15, 40, 30, id='all_velocity_test_1'),
     )
)
def test_all_velocity_config(upper_limit_aux_0, upper_limit_aux_1,
                             inferior_limit_aux_0, inferior_limit_aux_1):
    '''
        This test save two VelocityConfigType objects on db,
        require all the saved objects by graphql,
        and check if the requirement is equal the saveds objects
    '''

    VelocityConfig(
        upper_limit=upper_limit_aux_0,
        inferior_limit=inferior_limit_aux_0,
    ).save()

    VelocityConfig(
        upper_limit=upper_limit_aux_1,
        inferior_limit=inferior_limit_aux_1,
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={allVelocityConfig{id, upperLimit, inferiorLimit}}')
    assert result.status_code == 200

    velocity_config0 = result.json()['data']['allVelocityConfig'][0]
    velocity_config1 = result.json()['data']['allVelocityConfig'][1]

    assert velocity_config0['upperLimit'] == upper_limit_aux_0
    assert velocity_config0['inferiorLimit'] == inferior_limit_aux_0

    assert velocity_config1['upperLimit'] == upper_limit_aux_1
    assert velocity_config1['inferiorLimit'] == inferior_limit_aux_1


@pytest.mark.django_db
@pytest.mark.parametrize(
    "upper_time_aux,inferior_time_aux", (
        pytest.param(42, 37, id='wait_test_1'),
    )
)
def test_wait_config(upper_time_aux, inferior_time_aux):
    '''
        This test save a WaitConfigType object on db,
        require the saved object by graphql,
        and check if the requirement is equal the saved object
    '''

    WaitConfig(
        upper_time=upper_time_aux,
        inferior_time=inferior_time_aux,
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={waitConfig(id: 1){upperTime, inferiorTime}}')
    assert result.status_code == 200
    wait_config = result.json()['data']['waitConfig']
    assert wait_config['upperTime'] == upper_time_aux
    assert wait_config['inferiorTime'] == inferior_time_aux


@pytest.mark.django_db
@pytest.mark.parametrize(
    ("upper_time_aux_0,upper_time_aux_1,"
     "inferior_time_aux_0, inferior_time_aux_1"),
    (pytest.param(42, 37, 37, 42, id='all_wait_test_1'),
     )
)
def test_all_wait_config(upper_time_aux_0, upper_time_aux_1,
                         inferior_time_aux_0, inferior_time_aux_1):
    '''
        This test save two WaitConfigType objects on db,
        require all the saved objects by graphql,
        and check if the requirement is equal the saveds objects
    '''

    WaitConfig(
        upper_time=upper_time_aux_0,
        inferior_time=inferior_time_aux_0,
    ).save()

    WaitConfig(
        upper_time=upper_time_aux_1,
        inferior_time=inferior_time_aux_1,
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={allWaitConfig{id, upperTime, inferiorTime}}')
    assert result.status_code == 200

    wait_config0 = result.json()['data']['allWaitConfig'][0]
    wait_config1 = result.json()['data']['allWaitConfig'][1]

    assert wait_config0['upperTime'] == upper_time_aux_0
    assert wait_config0['inferiorTime'] == inferior_time_aux_0

    assert wait_config1['upperTime'] == upper_time_aux_1
    assert wait_config1['inferiorTime'] == inferior_time_aux_1


@pytest.mark.django_db
@pytest.mark.parametrize(
    "disables_shutdown_aux", (
        pytest.param(True, id='shutdown_test_1'),
        pytest.param(False, id='shutdown_test_2'),
    )
)
def test_shutdown_config(disables_shutdown_aux):
    '''
        This test save a ShutdownConfigType object on db,
        require the saved object by graphql,
        and check if the requirement is equal the saved object
    '''

    ShutdownConfig(
        disables_shutdown=disables_shutdown_aux
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={shutdownConfig(id: 1){disablesShutdown}}')
    assert result.status_code == 200
    shutdown_config = result.json()['data']['shutdownConfig']
    assert shutdown_config['disablesShutdown'] == disables_shutdown_aux


@pytest.mark.django_db
@pytest.mark.parametrize(
    "disables_shutdown_aux_0,disables_shutdown_aux_1,", (
        pytest.param(True, False, id='all_shut_down_test_1'),
    )
)
def test_all_shutdown_config(disables_shutdown_aux_0, disables_shutdown_aux_1):
    '''
        This test save two ShutdownConfigType objects on db,
        require all the saved objects by graphql,
        and check if the requirement is equal the saveds objects
    '''
    ShutdownConfig(
        disables_shutdown=disables_shutdown_aux_0
    ).save()

    ShutdownConfig(
        disables_shutdown=disables_shutdown_aux_1
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={allShutdownConfig{id, disablesShutdown}}')
    assert result.status_code == 200

    shut_down_config0 = result.json()['data']['allShutdownConfig'][0]
    shut_down_config1 = result.json()['data']['allShutdownConfig'][1]

    assert shut_down_config0['disablesShutdown'] == disables_shutdown_aux_0
    assert shut_down_config1['disablesShutdown'] == disables_shutdown_aux_1


@pytest.mark.django_db
@pytest.mark.parametrize(
    "enable_output_aux,temperature_aux,time_aux", (
        pytest.param(True, 56.8, 65.7, id='auxiliary_output_test_1'),
        pytest.param(False, 56.8, 65.7, id='auxiliary_output_test_2'),
    )
)
def test_auxiliary_output_config(enable_output_aux, temperature_aux, time_aux):
    '''
        This test save a AuxiliaryConfigType object on db,
        require the saved object by graphql,
        and check if the requirement is equal the saved object
    '''

    AuxiliaryOutputConfig(
        enable_output=enable_output_aux,
        temperature=temperature_aux,
        time=time_aux,
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={auxiliaryOutputConfig(id:1)'
        '{enableOutput,temperature,time}}'
    )
    assert result.status_code == 200
    auxiliary_output_config = result.json()['data']['auxiliaryOutputConfig']
    assert auxiliary_output_config['enableOutput'] == enable_output_aux
    assert auxiliary_output_config['temperature'] == temperature_aux
    assert auxiliary_output_config['time'] == time_aux


@pytest.mark.django_db
@pytest.mark.parametrize(
    ("enable_output_aux_0,enable_output_aux_1,"
     "parameters"),
    (pytest.param(True, False, [42, 37, 37, 42], id='all_Auxliary_test_1'),
     )
)
def test_all_auxiliary_config(enable_output_aux_0, enable_output_aux_1,
                              parameters):
    '''
        This test save two AuxiliaryOutputConfigType objects on db,
        require all the saved objects by graphql,
        and check if the requirement is equal the saveds objects
    '''

    temperature_aux_0 = parameters[0]
    temperature_aux_1 = parameters[1]
    time_aux_0 = parameters[2]
    time_aux_1 = parameters[3]

    AuxiliaryOutputConfig(
        enable_output=enable_output_aux_0,
        temperature=temperature_aux_0,
        time=time_aux_0,
    ).save()

    AuxiliaryOutputConfig(
        enable_output=enable_output_aux_1,
        temperature=temperature_aux_1,
        time=time_aux_1,
    ).save()

    client = Client()
    result = client.get(
        '/graphql?query={allAuxiliaryOutputConfig'
        '{id, enableOutput, temperature, time}}'
    )
    assert result.status_code == 200

    auxiliary_config0 = result.json()['data']['allAuxiliaryOutputConfig'][0]
    auxiliary_config1 = result.json()['data']['allAuxiliaryOutputConfig'][1]

    assert auxiliary_config0['enableOutput'] == enable_output_aux_0
    assert auxiliary_config0['temperature'] == temperature_aux_0
    assert auxiliary_config0['time'] == time_aux_0

    assert auxiliary_config1['enableOutput'] == enable_output_aux_1
    assert auxiliary_config1['temperature'] == temperature_aux_1
    assert auxiliary_config1['time'] == time_aux_1
