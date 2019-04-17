'''
    Schema to usa ghraphene framework to requirement on db
'''

import graphene
from graphene_django.types import DjangoObjectType
from calibration.models import (
    CalibrationVibration,
    CalibrationForce,
    CalibrationSpeed,
    CalibrationRelations,
    CalibrationTemperature,
    CalibrationCommand,
    Calibration
)

# pylint: disable = too-few-public-methods


class CalibrationVibrationType(DjangoObjectType):
    '''
        Defining the CalibrationVibration Type
    '''

    class Meta:
        '''
            Defining the CalibrationVibration Type
        '''
        model = CalibrationVibration


class CalibrationForceType(DjangoObjectType):
    '''
        Defining the CalibrationForce Type
    '''

    class Meta:
        '''
            Defining the CalibrationForce Type
        '''
        model = CalibrationForce


class CalibrationSpeedType(DjangoObjectType):
    '''
        Defining the CalibrationSpeed Type
    '''

    class Meta:
        '''
            Defining the CalibrationSpeed Type
        '''
        model = CalibrationForce


class CalibrationRelationsType(DjangoObjectType):
    '''
        Defining the CalibrationRelations Type
    '''

    class Meta:
        '''
            Defining the CalibrationRelations Type
        '''
        model = CalibrationRelations


class CalibrationTemperatureType(DjangoObjectType):
    '''
        Defining the CalibrationTemperature Type
    '''

    class Meta:
        '''
            Defining the CalibrationTemperature Type
        '''
        model = CalibrationTemperature


class CalibrationCommandType(DjangoObjectType):
    '''
        Defining the CalibrationCommand Type
    '''

    class Meta:
        '''
            Defining the CalibrationCommand Type
        '''
        model = CalibrationCommand


class CalibrationType(DjangoObjectType):
    '''
        Defining the Calibration Type
    '''

    class Meta:
        '''
            Defining the Calibration Type
        '''
        model = Calibration


class Query:
    # pylint: disable =  unused-argument, no-self-use
    '''
        The Query list all the types created above
    '''

    calibration_vibration = graphene.Field(
        CalibrationVibrationType,
        id=graphene.ID(),
        acquisition_temp=graphene.Int(),
        conversion_factor=graphene.Float(),
        vibrationOffset=graphene.Float()
    )
    all_calibration_vibration = graphene.List(CalibrationVibrationType)

    calibration_force = graphene.Field(
        CalibrationForceType,
        id=graphene.ID(),
        acquisition_temp=graphene.Int(),
        conversion_factor=graphene.Float(),
        force_offset=graphene.Float()
    )
    all_calibration_force = graphene.List(CalibrationForceType)

    calibration_speed = graphene.Field(
        CalibrationSpeedType,
        id=graphene.ID(),
        acquisition_chanel=graphene.Int(),
        tire_radius=graphene.Float()
    )
    all_calibration_speed = graphene.List(CalibrationSpeedType)

    calibratin_relations = graphene.Field(
        CalibrationRelationsType,
        id=graphene.ID(),
        transversal_selection_width=graphene.Int(),
        height_width_relation=graphene.Int(),
        rim_diameter=graphene.Int(),
        sync_motor_rotation=graphene.Int(),
        sheave_move_diameter=graphene.Int(),
        sheave_motor_diameter=graphene.Int()
    )
    all_calibration_relations = graphene.List(CalibrationRelationsType)

    calibration_temperature = graphene.Field(
        CalibrationTemperatureType,
        id=graphene.ID(),
        acquisiton_temp=graphene.Int(),
        conversion_factor=graphene.Float(),
        temperature_offset=graphene.Float(),
    )
    all_calibration_temperature = graphene.List(CalibrationTemperatureType)

    calibration_command = graphene.Field(
        CalibrationCommandType,
        id=graphene.ID(),
        command_chanel_speed=graphene.Int(),
        actual_speed=graphene.Float(),
        max_speed=graphene.Float(),
        chanel_command_pression=graphene.Int(),
        actual_pression=graphene.Float(),
        max_pression=graphene.Float()
    )
    all_calibration_command = graphene.List(CalibrationCommandType)

    def resolve_all_calibration_vibration(self, info, **kwargs):
        '''
            Returning all CalibrationVibration on db
        '''
        return CalibrationVibration.objects.all()

    def resolve_calibration_vibration(self, info, **kwargs):
        '''
            Returning only CalibrationVibration one by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return CalibrationVibration.objects.get(pk=pk)
        return None

    def resolve_all_calibration_force(self, info, **kwargs):
        '''
            Returning all CalibrationFoce on db
        '''
        return CalibrationForce.objects.all()

    def resolve_calibration_force(self, info, **kwargs):
        '''
            Returning only one CalibrationForce by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return CalibrationForce.object.get(pk=pk)
        return None

    def resolve_all_calibration_speed(self, info, **kwargs):
        '''
            Returning all CalibrationSpeed on db
        '''
        return CalibrationSpeed.objects.all()

    def resolve_calibration_speed(self, info, **kwargs):
        '''
            Returning only one CalibrationSpeed by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return CalibrationSpeed.object.get(pk=pk)
        return None

    def resolve_all_calibraton_relations(self, info, **kwargs):
        '''
            Returning all CalibrationRelations on db
        '''
        return CalibrationRelations.objects.all()

    def resolve_calibration_relations(self, info, **kwargs):
        '''
            Returning only one CalibrationRelations by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return CalibrationRelations.get(pk=pk)
        return None

    def resolves_all_calibration_temperature(self, info, **kwargs):
        '''
            Returning all CalibrationTemperature on db
        '''
        return CalibrationTemperature.objects.all()

    def resolves_calibration_temperature(self, info, **kwargs):
        '''
            Returning only one CalibrationTemperature by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return CalibrationTemperature.objects.get(pk=pk)
        return None

    def resolves_all_calibration_command(self, info, **kwargs):
        '''
            Returning all CalibrationCommand on db
        '''
        return CalibrationCommand.objects.all()

    def resolves_calibration_command(self, info, **kwargs):
        '''
            Returning only one CalibrationCommand by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return CalibrationCommand.objects.get(pk=pk)
        return None
