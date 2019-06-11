'''
    This is the model's file os testing app.
    The model of the Testing app have the create_by atribute and
    the foreignKey of calibration and config
'''
from django.db import models


class Testing(models.Model):
    '''
        This class describe a test, and have the create_by, calibration
        and config fields
    '''
    create_by = models.CharField(max_length=20)
