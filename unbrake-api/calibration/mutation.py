'''
    Mutation to the calibrate model
'''

import graphene
from calibration.models import (
    CalibrationVibration,
    CalibrationForce,
    CalibrationSpeed,
    CalibrationRelations,
    CalibrationTemperature,
    CalibrationCommand,
    Calibration
)

from calibration.schema import (
    CalibrationVibrationType,
    CalibrationForceType,
    CalibrationSpeedType,
    CalibrationRelationsType,
    CalibrationTemperatureType,
    CalibrationCommandType,
    CalibrationType
)

# pylint: disable = too-few-public-methods


class CreateVibration(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments
    '''
        Class to create a new object os Calibration vibration on bata base
    '''
    vibration = graphene.Field(CalibrationVibrationType)

    class Arguments:
        '''
            Arguments required to create a new config
        '''
        acquisition_chanel = graphene.Int()
        conversion_factor = graphene.Float()
        vibration_offset = graphene.Float()

    def mutate(self, info, acquisition_chanel,
               conversion_factor, vibration_offset):
        '''
            Recive the parameters end save the object on database
        '''

        vibration = CalibrationVibration(
            acquisition_chanel=acquisition_chanel,
            conversion_factor=conversion_factor,
            vibration_offset=vibration_offset
        )

        vibration.save()

        return CreateVibration(vibration=vibration)


class CreateForce(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments
    '''
        Class to create a new object os Calibration Force on bata base
    '''
    force = graphene.Field(CalibrationForceType)

    class Arguments:
        '''
            Arguments required to create a new config
        '''

        acquisition_chanel = graphene.Int()
        conversion_factor = graphene.Float()
        force_offset = graphene.Float()

    def mutate(self, info, acquisition_chanel,
               conversion_factor, force_offset):
        '''
            Recive the parameters end save the object on database
        '''

        force = CalibrationForce(
            acquisition_chanel=acquisition_chanel,
            conversion_factor=conversion_factor,
            force_offset=force_offset
        )

        force.save()

        return CreateForce(force=force)


class CreateSpeed(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments
    '''
        Class to create a new object os Calibration Speed on bata base
    '''
    speed = graphene.Field(CalibrationSpeedType)

    class Arguments:
        '''
            Arguments required to create a new config
        '''

        acquisition_chanel = graphene.Int()
        tire_radius = graphene.Float()

    def mutate(self, info, acquisition_chanel, tire_radius):
        '''
            Recive the parameters end save the object on database
        '''

        speed = CalibrationSpeed(
            acquisition_chanel=acquisition_chanel,
            tire_radius=tire_radius
        )

        speed.save()

        return CreateSpeed(speed=speed)


class CreateRelations(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments
    '''
        Class to create a new object os Calibration Relations on bata base
    '''
    relations = graphene.Field(CalibrationRelationsType)

    class Arguments:
        '''
            Arguments required to create a new config
        '''

        transversal_selection_width = graphene.Int()
        heigth_width_relation = graphene.Int()
        rim_diameter = graphene.Int()
        sync_motor_rodation = graphene.Int()
        sheave_move_diameter = graphene.Int()
        sheave_motor_diameter = graphene.Int()

    def mutate(self, info, transversal_selection_width, heigth_width_relation,
               rim_diameter, sync_motor_rodation, sheave_move_diameter,
               sheave_motor_diameter):
        '''
            Recive the parameters end save the object on database
        '''

        relations = CalibrationRelations(
            transversal_selection_width=transversal_selection_width,
            heigth_width_relation=heigth_width_relation,
            rim_diameter=rim_diameter,
            sync_motor_rodation=sync_motor_rodation,
            sheave_move_diameter=sheave_move_diameter,
            sheave_motor_diameter=sheave_motor_diameter
        )

        relations.save()

        return CreateRelations(relations=relations)


class CreateTemperature(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments
    '''
        Class to create a new object os Calibration Temperature on bata base
    '''
    temperature = graphene.Field(CalibrationTemperatureType)

    class Arguments:
        '''
            Arguments required to create a new Temperature Calibration
        '''

        acquisition_chanel = graphene.Int()
        conversion_factor = graphene.Float()
        temperature_offset = graphene.Float()

    def mutate(self, info, acquisition_chanel,
               conversion_factor, temperature_offset):
        '''
            Recive the parameters end save the object on database
        '''

        temperature = CalibrationTemperature(
            acquisition_chanel=acquisition_chanel,
            conversion_factor=conversion_factor,
            temperature_offset=temperature_offset
        )

        temperature.save()

        return CreateTemperature(temperature=temperature)


class CreateCommand(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments
    '''
        Class to create a new Calibration Command object on bata base
    '''
    command = graphene.Field(CalibrationCommandType)

    class Arguments:
        '''
            Arguments required to create a new Calibration Command
        '''

        command_chanel_speed = graphene.Int()
        actual_speed = graphene.Float()
        max_speed = graphene.Float()
        chanel_command_pression = graphene.Int()
        actual_pression = graphene.Float()
        max_pression = graphene.Float()

    def mutate(self, info, command_chanel_speed, actual_speed, max_speed,
               chanel_command_pression, actual_pression, max_pression):
        '''
            Recive the parameters end save the object on database
        '''

        command = CalibrationCommand(
            command_chanel_speed=command_chanel_speed,
            actual_speed=actual_speed,
            max_speed=max_speed,
            chanel_command_pression=chanel_command_pression,
            actual_pression=actual_pression,
            max_pression=max_pression
        )

        command.save()

        return CreateCommand(command=command)


class CreateCalibration(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments
    # pylint: disable = too-many-locals
    '''
        Class to create a new Calibration object on bata base
    '''
    calibration = graphene.Field(CalibrationType)

    class Arguments:
        '''
            Arguments required to create a new Calibration
        '''
        name = graphene.String()
        id_vibration = graphene.Int()
        id_first_force = graphene.Int()
        id_second_force = graphene.Int()
        id_speed = graphene.Int()
        id_relations = graphene.Int()
        id_first_temperature = graphene.Int()
        id_second_temperature = graphene.Int()
        id_command = graphene.Int()

    def mutate(
            self,
            info,
            name,
            id_vibration,
            id_first_force,
            id_second_force,
            id_speed,
            id_relations,
            id_first_temperature,
            id_second_temperature,
            id_command):
        '''
            Define how the argumets are used to create the object on db
        '''
        vibration = CalibrationVibration.objects.get(id=id_vibration)
        first_force = CalibrationForce.objects.get(id=id_first_force)
        second_force = CalibrationForce.objects.get(id=id_second_force)
        speed = CalibrationSpeed.objects.get(id=id_speed)
        relations = CalibrationRelations.objects.get(id=id_relations)
        first_temperature = CalibrationTemperature.objects.get(
            id=id_first_temperature)
        second_temperature = CalibrationTemperature.objects.get(
            id=id_second_temperature)
        command = CalibrationCommand.objects.get(id=id_command)

        calibration = Calibration(
            name=name,
            is_default=False,
            vibration=vibration,
            speed=speed,
            relations=relations,
            command=command,
        )

        calibration.save()
        calibration.calibrationforce_set.add(first_force)
        calibration.calibrationforce_set.add(second_force)
        calibration.calibrationtemperature_set.add(first_temperature)
        calibration.calibrationtemperature_set.add(second_temperature)

        first_force.calibration = calibration
        second_force.calibration = calibration
        first_temperature.calibration = calibration
        second_temperature.calibration = calibration

        return CreateCalibration(calibration=calibration)


class Mutation(graphene.ObjectType):

    '''
        GraphQL class to declare all the mutations
    '''

    create_vibration = CreateVibration.Field()
    create_force = CreateForce.Field()
    create_speed = CreateSpeed.Field()
    create_relations = CreateRelations.Field()
    create_temperature = CreateTemperature.Field()
    create_command = CreateCommand.Field()
    create_calibration = CreateCalibration.Field()
