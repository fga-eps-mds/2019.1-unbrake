'''
    This is the models file of calibration app.
    The models of calibration are divided in:
    Calibration Validation,
    Calibration Force,
    Calibration Speed,
    Calibration Relations,
    Calibration Temperature,
    Calibration Command.
    The classes are based on the defcalibra file
'''

from django.db import models

# Create your models here.


class CalibrationVibration(models.Model):
    '''
        This class has vibration calibration information.
        aqusitionTemp is CHVB in the file,
        conversionFactor is FCVB in the file,
        vibrationOffset is OFVB in the file.
    '''
    acquisition_chanel = models.IntegerField()
    conversion_factor = models.FloatField()
    vibration_offset = models.FloatField()


class CalibrationSpeed(models.Model):
    '''
        This class has speed calibration information.
        acquitionChanel is CHR1 in the file,
        tireRadius is RAP in the file.
    '''
    acquisition_chanel = models.IntegerField()
    tire_radius = models.FloatField()


class CalibrationRelations(models.Model):
    '''
        This class has relations calibrations information.
        transversalSelectionWidth is LST in the file,
        heigthWidthRelation is RAL in the file,
        rimDiameter is DIA in the file,
        syncMotorRodation is RSM in the file,
        sheaveMoveDiameter is DPM in the file,
        sheaveMotorDiameter is DPO in the file.
    '''
    transversal_selection_width = models.IntegerField()
    heigth_width_relation = models.IntegerField()
    rim_diameter = models.IntegerField()
    sync_motor_rodation = models.IntegerField()
    sheave_move_diameter = models.IntegerField()
    sheave_motor_diameter = models.IntegerField()


class CalibrationCommand(models.Model):
    '''
        This class has command calibration information.
        commandChanelSpeed is CHVC in the file,
        actualSpeed is CUVC in the file,
        maxSpee is MAVC in the file,
        chanelCommandPression is CHPC in the file,
        actualPression is CUPC in the file,
        maxPression is MAPC in the file.
    '''
    command_chanel_speed = models.IntegerField()
    actual_speed = models.FloatField()
    max_speed = models.FloatField()
    chanel_command_pression = models.IntegerField()
    actual_pression = models.FloatField()
    max_pression = models.FloatField()


class Calibration(models.Model):
    '''
        This class has all the information of a calibration definition.
    '''

    name = models.CharField(max_length=15, null=False, blank=True)
    is_default = models.BooleanField(null=False, blank=False)
    vibration = models.OneToOneField(
        CalibrationVibration, on_delete=models.CASCADE)
    speed = models.OneToOneField(
        CalibrationSpeed, on_delete=models.CASCADE)
    relations = models.OneToOneField(
        CalibrationRelations, on_delete=models.CASCADE)
    command = models.OneToOneField(
        CalibrationCommand, on_delete=models.CASCADE)


class CalibrationTemperature(models.Model):
    '''
        This class has temperature calibration information.
        This class is used twice per calibration.
        acqusitonTemp is CTH in the file,
        conversionFactor is FCT in the file.
    '''
    acquisition_chanel = models.IntegerField()
    conversion_factor = models.FloatField()
    temperature_offset = models.FloatField()
    calibration = models.ForeignKey(Calibration,
                                    on_delete=models.CASCADE,
                                    blank=True,
                                    null=True
                                    )


class CalibrationForce(models.Model):
    '''
        This class has force calibration information.
        This class is used twice per calibration.
        acquisitionTemp is CNHF in the file,
        converionFactor is FCF int the file,
        forceOffset is OFF 1int the file.
    '''
    acquisition_chanel = models.IntegerField()
    conversion_factor = models.FloatField()
    force_offset = models.FloatField()
    calibration = models.ForeignKey(Calibration,
                                    on_delete=models.CASCADE,
                                    blank=True,
                                    null=True
                                    )
