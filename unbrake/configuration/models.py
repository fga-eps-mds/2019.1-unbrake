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
	AtivarSaida = models.BooleanField(blank=True, null=True, max_digits=10, decimal_places=6)
	Temperatura = models.DecimalField(blank=True, null=True, max_digits=10, decimal_places=6)
	Tempo = models.DecimalField()