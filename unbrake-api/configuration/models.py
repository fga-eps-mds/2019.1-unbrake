'''
    This is the models file of configuration app.
    The models of configuration are divided in Cycles, Velocity,
    Wait, Shutdown and AuxiliaryOutput. The classes
    are based on the defconfig file
'''

from django.db import models


class CyclesConfig(models.Model):
    '''
        This class describe the number end the time between cycles on a test
    '''
    number = models.PositiveIntegerField()
    time_between_cycles = models.PositiveIntegerField()


class VelocityConfig(models.Model):
    '''
        During the test the velocity varies
        between the limits UpperLimit (higher)
        and the InferiorLimit (lower)
    '''
    upper_limit = models.IntegerField()
    inferior_limit = models.IntegerField()


class WaitConfig(models.Model):
    '''
        When the test reach the UpperLimit velocity it stay
        on this state for UpperTime seconds,
        the same with te InferiorTime
    '''
    upper_time = models.IntegerField()
    inferior_time = models.IntegerField()


class ShutdownConfig(models.Model):
    '''
        The boolean DesablesShutdown inhibits the engine
        shutdown during the test
    '''
    disable_shutdown = models.BooleanField()


class AuxiliaryOutputConfig(models.Model):
    '''
        The Auxiliary Output is a external componet to
        increase the testes results
        there is the option of enable of not it's
    '''
    enable_output = models.BooleanField()
    temperature = models.DecimalField(
        blank=True,
        null=True,
        max_digits=10,
        decimal_places=6)
    time = models.DecimalField(
        blank=True,
        null=True,
        max_digits=10,
        decimal_places=6)
