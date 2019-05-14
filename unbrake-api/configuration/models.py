'''
    This is the models file of configuration app.
    The models of configuration are divided in Cycles, Velocity,
    Wait, Shutdown and AuxiliaryOutput. The classes
    are based on the defconfig file
'''

from django.db import models


class Config(models.Model):
    '''
    This class is based on the configuration file, and describe an entire test
    '''
    name = models.CharField(max_length=15)
    is_default = models.BooleanField()
    number = models.PositiveIntegerField()
    time_between_cycles = models.PositiveIntegerField()
    upper_limit = models.IntegerField()
    inferior_limit = models.IntegerField()
    upper_time = models.IntegerField()
    inferior_time = models.IntegerField()
    disable_shutdown = models.BooleanField()
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
