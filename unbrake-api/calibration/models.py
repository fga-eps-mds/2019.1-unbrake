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


class CabibrationVibration(models.Model):
    '''
        This class has vibration calibration information.
        aqusitionTemp is CHVB in the file,
        conversionFactor is FCVB in the file,
        vibrationOffset is OFVB in the file.
    '''
    acquisitionTemp = models.IntegerField()
    conversionFactor = models.FloatField()
    vibrationOffset = models.FloatField()


class CalibrationForce(models.Model):
    '''
        This class has force calibration information.
        This class is used twice per calibration.
        acquisitonTemp is CNHF in the file,
        converionFactor is FCF int the file,
        forceOffset is OFF 1int the file.
    '''
    acquisitionTemp = models.IntegerField()
    conversionFactor = models.FloatField()
    forceOffset = models.FloatField()


class CalibrationSpeed(models.Model):
    '''
        This class has speed calibration information.
        acquitionChanel is CHR1 in the file,
        tireRadius is RAP in the file.
    '''
    acquisitionChanel = models.IntegerField()
    tireRadius = models.FloatField()


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
    transversalSelectionWidth = models.IntegerField()
    heigthWidthRelation = models.IntegerField()
    rimDiameter = models.IntegerField()
    syncMotorRodation = models.IntegerField()
    sheaveMoveDiameter = models.IntegerField()
    sheaveMotorDiameter = models.IntegerField()


class CalibrationTemperature(models.Model):
    '''
        This class has temperature calibration information.
        This class is used twice per calibration.
        acqusitonTemp is CTH in the file,
        conversionFactor is FCT in the file.
    '''
    acquisitonTemp = models.IntegerField()
    conversionFactor = models.FloatField()
    temperatureOffset = models.FloatField()


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
    commandChanelSpeed = models.IntegerField()
    actualSpeed = models.FloatField()
    maxSpeed = models.FloatField()
    chanelCommandPression = models.IntegerField()
    actualPression = models.FloatField()
    maxPression = models.FloatField()


class Calibration(models.Model):
    '''
        This class has all the information of a calibration definition.
    '''
    cabibrationVibration = models.OneToOneField(
        CabibrationVibration, on_delete=models.CASCADE)
    calibrationForce = models.ManyToManyField(CalibrationForce)
    calibrationSpeed = models.OneToOneField(
        CalibrationSpeed, on_delete=models.CASCADE)
    calibrationRelations = models.OneToOneField(
        CalibrationRelations, on_delete=models.CASCADE)
    calibrationTemperature = models.ManyToManyField(
        CalibrationTemperature)
    calibrationCommand = models.OneToOneField(
        CalibrationCommand, on_delete=models.CASCADE)
