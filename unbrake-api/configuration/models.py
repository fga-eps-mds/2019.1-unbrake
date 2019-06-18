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
    name = models.CharField(max_length=15, null=False, blank=False)
    is_default = models.BooleanField(null=False, blank=False)
    number = models.PositiveIntegerField()
    time_between_cycles = models.PositiveIntegerField()
    upper_limit = models.IntegerField()
    inferior_limit = models.IntegerField()
    upper_time = models.IntegerField()
    inferior_time = models.IntegerField()
    disable_shutdown = models.BooleanField()
    enable_output = models.BooleanField()
    temperature = models.FloatField(default=1.0)
    time = models.FloatField(default=1.0)

    def __str__(self):
        '''
            Define the way the objects are shown
        '''
        return "Id: " + str(self.id) + " - " + "Name: " + self.name
