'''
    Schema to Testing model
'''
import json
import graphene
from emitter import Client
from django.core import serializers
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required
from testing.models import Testing
from configuration.models import Config
from calibration.models import (
    CalibrationVibration,
    CalibrationSpeed,
    CalibrationRelations,
    CalibrationCommand,
    Calibration
)

# pylint: disable = too-few-public-methods


class TestingType(DjangoObjectType):
    '''
        Defining the Testing Type with django
    '''
    class Meta:
        '''
            Defining the Testing Type
        '''
        model = Testing


class Query:
    # pylint: disable =  unused-argument, no-self-use
    '''
        Defining the resolves to queries of Graphene
    '''
    testing = graphene.Field(
        TestingType,
        id=graphene.ID(),
    )

    all_testing = graphene.List(TestingType)

    @login_required
    def resolve_testing(self, info, **kwargs):
        '''
            Return a Testing object on db by id
        '''
        pk = kwargs.get('id')
        return Testing.objects.get(pk=pk)

    @login_required
    def resolve_all_testing(self, info):
        '''
            Return all Testing objects on db
        '''
        return Testing.objects.all()


class CreateTesting(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use
    '''
        Defining the mutate to create a new Testing object on db
    '''
    testing = graphene.Field(TestingType)
    error = graphene.String()

    class Arguments:
        '''
            Arguments required to create a new Testing object
        '''
        create_by = graphene.String()
        id_calibration = graphene.Int()
        id_configuration = graphene.Int()

    @login_required
    def mutate(
            self,
            info,
            create_by,
            id_calibration,
            id_configuration):
        '''
            Define how the arguments are used to create a new Testing object
        '''

        calibration = Calibration.objects.get(id=id_calibration)
        configuration = Config.objects.get(id=id_configuration)

        testing = Testing(
            create_by=create_by,
            calibration=calibration,
            configuration=configuration
        )

        testing.save()

        return CreateTesting(testing=testing)


class SendTesting(graphene.Mutation):
    '''
        Mutation to send a testing to unbrake-local with mqtt
    '''
    # pylint: disable =  unused-argument, no-self-use

    succes = graphene.String()

    class Arguments:
        '''
            Id of the Testing object that will be sent to unbrake-local
        '''
        testing_id = graphene.Int()

    def mutate(self, info, testing_id):
        '''
            Function to get all objects on db and create a string to be sent
            to unbrake-local
        '''

        testing = Testing.objects.get(pk=testing_id)
        testing = serializers.serialize("json", [testing, ])
        testing = json.loads(testing)[0]

        config = Config.objects.get(pk=testing['fields']['configuration'])
        config = serializers.serialize("json", [config, ])
        config = json.loads(config)[0]

        testing['fields']['configuration'] = config['fields']

        calibration = Calibration.objects.get(
            pk=testing['fields']['calibration']
        )

        calibration_aux = Calibration.objects.get(
            pk=testing['fields']['calibration']
        )

        calibration = serializers.serialize("json", [calibration, ])
        calibration = json.loads(calibration)[0]

        testing['fields']['calibration'] = calibration['fields']

        temperature = calibration_aux.calibrationtemperature_set.all()
        temperature = serializers.serialize("json", temperature)
        temperature = json.loads(temperature)
        temperature[0] = temperature[0]['fields']
        temperature[1] = temperature[1]['fields']

        testing['fields']['calibration']['temperature'] = temperature

        force = calibration_aux.calibrationforce_set.all()
        force = serializers.serialize("json", force)
        force = json.loads(force)
        force[0] = force[0]['fields']
        force[1] = force[1]['fields']

        testing['fields']['calibration']['force'] = force

        vibration = CalibrationVibration.objects.get(
            pk=testing['fields']['calibration']['vibration']
        )
        vibration = serializers.serialize("json", [vibration, ])
        vibration = json.loads(vibration)[0]

        testing['fields']['calibration']['vibration'] = vibration['fields']

        speed = CalibrationSpeed.objects.get(
            pk=testing['fields']['calibration']['speed']
        )
        speed = serializers.serialize("json", [speed, ])
        speed = json.loads(speed)[0]

        testing['fields']['calibration']['speed'] = speed['fields']

        relations = CalibrationRelations.objects.get(
            pk=testing['fields']['calibration']['relations']
        )
        relations = serializers.serialize("json", [relations, ])
        relations = json.loads(relations)[0]

        testing['fields']['calibration']['relations'] = relations['fields']

        command = CalibrationCommand.objects.get(
            pk=testing['fields']['calibration']['command']
        )
        command = serializers.serialize("json", [command, ])
        command = json.loads(command)[0]

        testing['fields']['calibration']['command'] = command['fields']

        testing = json.dumps(testing)

        client = Client()

        client.connect(
            host="unbrake.ml",
            port=8080,
            secure=False
        )

        client.publish(
            "",
            "unbrake/galpao/testing",
            testing
        )

        return SendTesting(succes=testing)


class Mutation(graphene.ObjectType):
    '''
        Graphene class concat all mutations
    '''
    create_testing = CreateTesting.Field()
    send_testing = SendTesting.Field()
