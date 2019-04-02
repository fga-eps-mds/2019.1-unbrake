from rest_framework import serializers
from .models import Ciclos, Velocidade, Espera, Desligamento, SaidaAuxiliar

class CiclosSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Ciclos
		fields = '__all__' 

class VelocidadeSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Velocidade
		fields = '__all__' 

class EsperaSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Espera
		fields = '__all__' 


class DesligamentoSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Desligamento
		fields = '__all__' 


class SaidaAuxiliarSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = SaidaAuxiliar
		fields = '__all__' 