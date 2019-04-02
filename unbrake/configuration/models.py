from django.db import models

# Create your models here.
class Ciclos(models.Model):
	NumeroCiclos = models.PositiveIntegerField()
	TempoCiclos = models.PositiveIntegerField()

class Velocidade(models.Model):
	LimiteSuperior = models.IntegerField() 
	LimiteInferior = models.IntegerField()

class Espera(models.Model):
	TempoSuperior = models.IntegerField()
	TempoInferior = models.IntegerField()

class Desligamento(models.Model):
	InibeDesligamento = models.BooleanField()

class SaidaAuxiliar(models.Model):
	AtivarSaida = models.BooleanField()
	Temperatura = models.DecimalField()
	Tempo = models.DecimalField()