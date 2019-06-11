'''
    Tests of mutations to Testing model
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

QUERY_CALIBRATION = (
    'calibration{name, speed {acquisitionChanel,'
    ' tireRadius}, vibration {acquisitionChanel, conversionFactor,'
    ' vibrationOffset}command {commandChanelSpeed, actualSpeed,'
    ' maxSpeed,chanelCommandPression, actualPression, maxPression},'
    'relations {transversalSelectionWidth, heigthWidthRelation,'
    'rimDiameter, syncMotorRodation, sheaveMoveDiameter,'
    'sheaveMotorDiameter}, calibrationforceSet {acquisitionChanel,'
    ' conversionFactor,forceOffset, acquisitionChanel, conversionFactor,'
    ' forceOffset},calibrationtemperatureSet {acquisitionChanel,'
    ' conversionFactor,temperatureOffset, acquisitionChanel,'
    ' conversionFactor,temperatureOffset}}')

QUERY_CONFIGURATION = ('configuration{number, timeBetweenCycles, upperLimit, '
                       'inferiorLimit, upperTime, inferiorTime, '
                       'disableShutdown, enableOutput, temperature, time}')

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

RESPONSE_CONFIGURATION = {
    'number': 10,
    'timeBetweenCycles': 5,
    'upperLimit': 10,
    'inferiorLimit': 0,
    'upperTime': 3,
    'inferiorTime': 5,
    'disableShutdown': False,
    'enableOutput': False,
    'temperature': 25.0,
    'time': 9.0
}

RESPONSE_TESTING = {
    'createBy': "Teste",
    'calibration': RESPONSE_CALIBRATION,
    'configuration': RESPONSE_CONFIGURATION
}


@pytest.mark.django_db
def test_mutation_testing():
    '''
        Is create a calibraion and a configuration object, then is create
        a Testing object using the mutations of graphene
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
    CLIENT.post(url)

    url = ('/graphql?query=mutation'
           '{createConfig(name: "Teste", '
           + stringfy(RESPONSE_CONFIGURATION) + ')'
           '{config{id}}}'
           )

    CLIENT.post(url)

    url = ('/graphql?query=mutation{createTesting(createBy:"Teste", '
           'idCalibration: 1, idConfiguration: 1){testing{'
           'createBy,'
           + QUERY_CALIBRATION + ', ' + QUERY_CONFIGURATION + '}}}')

    testing = CLIENT.post(url)
    assert testing.status_code == 200
    res = testing.json()['data']['createTesting']['testing']
    assert res == RESPONSE_TESTING
