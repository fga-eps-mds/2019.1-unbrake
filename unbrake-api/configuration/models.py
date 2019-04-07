from django.db import models

# Create your models here.
class Cycles(models.Model):
	CyclesNumber = models.PositiveIntegerField()
	CyclesTime = models.PositiveIntegerField()


class Velocity(models.Model):
	UpperLimit = models.IntegerField() 
	InferiorLimit = models.IntegerField()

class Wait(models.Model):
	UpperTime = models.IntegerField()
	InferiorTime = models.IntegerField()

class Shutdown(models.Model):
	DisablesShutdown = models.BooleanField()

class AuxiliaryOutput(models.Model):
	EnableOutput = models.BooleanField()
	Temperature = models.DecimalField(blank=True, null=True, max_digits=10, decimal_places=6)
	Time = models.DecimalField(blank=True, null=True, max_digits=10, decimal_places=6)
