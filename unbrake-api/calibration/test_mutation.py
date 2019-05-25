'''
    This file test the mutations of the calibration app
'''

import json
import pytest
from django.test import Client


def stringfy(entrada):
    '''
        This function receve a json end return a string of the json
        without the '{' end '}'
    '''
    aux = json.dumps(entrada)
    return aux.replace('{', '}').replace('}', '').replace('"', '')


CLIENT = Client()

RESPONSE_FIRST_TEMPERATURE = {
    'acquisitionChanel': 1,
    'conversionFactor': 0.2,
    'temperatureOffset': -1.25
}

RESPONSE_SECOND_TEMPERATURE = {
    'acquisitionChanel': 2,
    'conversionFactor': 0.2,
    'temperatureOffset': -1.25
}

RESPONSE_FIRST_FORCE = {
    'acquisitionChanel': 3,
    'conversionFactor': 1.0,
    'forceOffset': 1.0
}

RESPONSE_SECOND_FORCE = {
    'acquisitionChanel': 4,
    'conversionFactor': 1.0,
    'forceOffset': 1.0
}

RESPONSE_SPEED = {
    'acquisitionChanel': 5,
    'tireRadius': 0.29
}

RESPONSE_VIBRATION = {
    'acquisitionChanel': 6,
    'conversionFactor': 1.0,
    'vibrationOffset': 1.0
}

RESPONSE_COMMAND = {
    'commandChanelSpeed': 7,
    'actualSpeed': 0.0,
    'maxSpeed': 100.0,
    'chanelCommandPression': 8,
    'actualPression': 0.0,
    'maxPression': 30.0
}

RESPONSE_RELATIONS = {
    'transversalSelectionWidth': 175,
    'heigthWidthRelation': 65,
    'rimDiameter': 14,
    'syncMotorRodation': 1700,
    'sheaveMoveDiameter': 12,
    'sheaveMotorDiameter': 30
}

RESPONSE_CALIBRATION = {
    'name': "Teste",
    'speed': RESPONSE_SPEED,
    'vibration': RESPONSE_VIBRATION,
    'command': RESPONSE_COMMAND,
    'relations': RESPONSE_RELATIONS,
    'calibrationforceSet': [RESPONSE_FIRST_FORCE, RESPONSE_SECOND_FORCE],
    'calibrationtemperatureSet': [RESPONSE_FIRST_TEMPERATURE,
                                  RESPONSE_SECOND_TEMPERATURE]
}


@pytest.mark.django_db
def test_mutation_speed():
    '''
        This function create a speed calibration using the graphene mutation
        end check if the return of graphene is equal to the parameters used
        to create it
    '''
    url = (
        '/graphql?query=mutation{createSpeed(' + stringfy(RESPONSE_SPEED) + ')'
        '{speed{acquisitionChanel, tireRadius}}}')
    create_speed = CLIENT.post(url)
    assert create_speed.status_code == 200
    response = create_speed.json()['data']['createSpeed']['speed']
    assert response == RESPONSE_SPEED


@pytest.mark.django_db
def test_mutation_command():
    '''
        This function create a command calibration using the graphene
        mutation end check if the return of graphene is equal to
        the parameters used to create it
    '''
    url = ('/graphql?query=mutation'
           '{createCommand(' + stringfy(RESPONSE_COMMAND) + ')'
           '{command{ commandChanelSpeed, actualSpeed, maxSpeed,'
           'chanelCommandPression, actualPression, maxPression}}}')
    create_command = CLIENT.post(url)
    assert create_command.status_code == 200
    response = create_command.json()['data']['createCommand']['command']
    assert response == RESPONSE_COMMAND


@pytest.mark.django_db
def test_mutation_relations():
    '''
        This function create a relations calibration using the graphene
        mutation end check if the return of graphene is equal to
        the parameters used to create it
    '''
    url = ('/graphql?query=mutation'
           '{createRelations(' + stringfy(RESPONSE_RELATIONS) + ')'
           '{relations{transversalSelectionWidth, heigthWidthRelation,'
           'rimDiameter, syncMotorRodation,'
           'sheaveMoveDiameter, sheaveMotorDiameter}}}')
    create_relation = CLIENT.post(url)
    assert create_relation.status_code == 200
    response = create_relation.json()['data']['createRelations']['relations']
    assert response == RESPONSE_RELATIONS


@pytest.mark.django_db
def test_mutation_vibration():
    '''
        This function create a vibration calibration using the graphene
        mutation end check if the return of graphene is equal to
        the parameters used to create it
    '''
    url = (
        '/graphql?query=mutation'
        '{createVibration(' + stringfy(RESPONSE_VIBRATION) + ')'
        '{vibration{acquisitionChanel, conversionFactor, vibrationOffset}}}')
    create_vibration = CLIENT.post(url)
    assert create_vibration.status_code == 200
    response = create_vibration.json()['data']['createVibration']['vibration']
    assert response == RESPONSE_VIBRATION


@pytest.mark.django_db
def test_mutation_force():
    '''
        This function create a force calibration using the graphene
        mutation end check if the return of graphene is equal to
        the parameters used to create it
    '''
    url = ('/graphql?query=mutation'
           '{createForce(' + stringfy(RESPONSE_FIRST_FORCE) + ')'
           '{force{acquisitionChanel, conversionFactor, forceOffset}}}')
    create_first_force = CLIENT.post(url)
    assert create_first_force.status_code == 200
    response = create_first_force.json()['data']['createForce']['force']
    assert response == RESPONSE_FIRST_FORCE


@pytest.mark.django_db
def test_mutation_temperature():
    '''
        This function create a temperature calibration using the graphene
        mutation end check if the return of graphene is equal to
        the parameters used to create it
    '''
    url = ('/graphql?query=mutation'
           '{createTemperature(' + stringfy(RESPONSE_FIRST_TEMPERATURE) + ')'
           '{temperature{acquisitionChanel,'
           'conversionFactor, temperatureOffset}}}')
    create_first_temperature = CLIENT.post(url)
    assert create_first_temperature.status_code == 200
    response = create_first_temperature.json()['data']['createTemperature']
    assert response['temperature'] == RESPONSE_FIRST_TEMPERATURE


@pytest.mark.django_db
def test_mutation_calibrate():
    '''
        This function create a command calibration using the graphene
        mutation end check if the return of graphene is equal to
        the parameters used to create it
    '''
    url = (
        '/graphql?query=mutation{createSpeed(' + stringfy(RESPONSE_SPEED) + ')'
        '{speed{acquisitionChanel, tireRadius}}}')
    CLIENT.post(url)

    url = ('/graphql?query=mutation'
           '{createCommand(' + stringfy(RESPONSE_COMMAND) + ')'
           '{command{ commandChanelSpeed, actualSpeed, maxSpeed,'
           'chanelCommandPression, actualPression, maxPression}}}')
    CLIENT.post(url)

    url = ('/graphql?query=mutation'
           '{createRelations(' + stringfy(RESPONSE_RELATIONS) + ')'
           '{relations{transversalSelectionWidth, heigthWidthRelation,'
           'rimDiameter, syncMotorRodation,'
           'sheaveMoveDiameter, sheaveMotorDiameter}}}')
    CLIENT.post(url)

    url = (
        '/graphql?query=mutation'
        '{createVibration(' + stringfy(RESPONSE_VIBRATION) + ')'
        '{vibration{acquisitionChanel, conversionFactor, vibrationOffset}}}')
    CLIENT.post(url)

    url = ('/graphql?query=mutation'
           '{createForce(' + stringfy(RESPONSE_FIRST_FORCE) + ')'
           '{force{acquisitionChanel, conversionFactor, forceOffset}}}')
    CLIENT.post(url)

    url = ('/graphql?query=mutation'
           '{createForce(' + stringfy(RESPONSE_SECOND_FORCE) + ')'
           '{force{acquisitionChanel, conversionFactor, forceOffset}}}')
    CLIENT.post(url)

    url = ('/graphql?query=mutation'
           '{createTemperature(' + stringfy(RESPONSE_FIRST_TEMPERATURE) + ')'
           '{temperature{acquisitionChanel,'
           'conversionFactor, temperatureOffset}}}')
    CLIENT.post(url)

    url = ('/graphql?query=mutation'
           '{createTemperature(' + stringfy(RESPONSE_SECOND_TEMPERATURE) + ')'
           '{temperature{acquisitionChanel,'
           'conversionFactor, temperatureOffset}}}')
    CLIENT.post(url)

    url = ('/graphql?query=mutation{createCalibration(idVibration: 1,'
           'name: "Teste", idSpeed:1, idCommand: 1, idRelations: 1,'
           ' idFirstForce: 1, idSecondForce: 2, idFirstTemperature: 1,'
           'idSecondTemperature: 2){calibration'
           '{name, speed {acquisitionChanel, tireRadius}, '
           'vibration {acquisitionChanel, conversionFactor, vibrationOffset}'
           'command {commandChanelSpeed, actualSpeed, maxSpeed,'
           'chanelCommandPression, actualPression, maxPression},'
           'relations {transversalSelectionWidth, heigthWidthRelation,'
           'rimDiameter, syncMotorRodation, sheaveMoveDiameter,'
           'sheaveMotorDiameter}, '
           'calibrationforceSet {acquisitionChanel, conversionFactor,'
           'forceOffset, acquisitionChanel, conversionFactor, forceOffset},'
           'calibrationtemperatureSet {acquisitionChanel, conversionFactor,'
           'temperatureOffset, acquisitionChanel, conversionFactor,'
           'temperatureOffset}}}}')
    create_calibration = CLIENT.post(url)
    status_calibration = create_calibration.status_code == 200
    create_calibration = create_calibration.json()['data']['createCalibration']
    assert create_calibration['calibration'] == RESPONSE_CALIBRATION

    get_calibration = CLIENT.get(
        '/graphql?query=query{calibration(id:1)'
        '{name, speed {acquisitionChanel, tireRadius}, '
        'vibration {acquisitionChanel, conversionFactor, vibrationOffset}'
        'command {commandChanelSpeed, actualSpeed, maxSpeed,'
        'chanelCommandPression, actualPression, maxPression},'
        'relations {transversalSelectionWidth, heigthWidthRelation,'
        'rimDiameter, syncMotorRodation, sheaveMoveDiameter,'
        'sheaveMotorDiameter}, '
        'calibrationforceSet {acquisitionChanel, conversionFactor,'
        'forceOffset, acquisitionChanel, conversionFactor, forceOffset},'
        'calibrationtemperatureSet {acquisitionChanel, conversionFactor,'
        'temperatureOffset, acquisitionChanel, conversionFactor,'
        'temperatureOffset}}}')
    status_get_calibration = get_calibration.status_code == 200
    get_calibration = get_calibration.json()['data']['calibration']
    assert get_calibration == RESPONSE_CALIBRATION

    get_all_calibration = CLIENT.get(
        '/graphql?query=query{allCalibration'
        '{name, speed {acquisitionChanel, tireRadius}, '
        'vibration {acquisitionChanel, conversionFactor, vibrationOffset}'
        'command {commandChanelSpeed, actualSpeed, maxSpeed,'
        'chanelCommandPression, actualPression, maxPression},'
        'relations {transversalSelectionWidth, heigthWidthRelation,'
        'rimDiameter, syncMotorRodation, sheaveMoveDiameter,'
        'sheaveMotorDiameter}, '
        'calibrationforceSet {acquisitionChanel, conversionFactor,'
        'forceOffset, acquisitionChanel, conversionFactor, forceOffset},'
        'calibrationtemperatureSet {acquisitionChanel, conversionFactor,'
        'temperatureOffset, acquisitionChanel, conversionFactor,'
        'temperatureOffset}}}')
    status_get_all = get_all_calibration.status_code == 200
    assert status_calibration and status_get_all and status_get_calibration
    get_all_calibration = get_all_calibration.json()['data']
    assert get_all_calibration['allCalibration'][0] == RESPONSE_CALIBRATION
