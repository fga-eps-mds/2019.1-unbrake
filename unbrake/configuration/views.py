from django.shortcuts import render
from rest_framework import viewsets
from .models import Ciclos, Velocidade, Espera, Desligamento, SaidaAuxiliar
from .serializers import CiclosSerializer, VelocidadeSerializer, EsperaSerializer, DesligamentoSerializer, SaidaAuxiliarSerializer

# Create your views here.
class CiclosViewSet(viewsets.ModelViewSet):

	queryset = Ciclos.objects.all()
	serializer_class = CiclosSerializer

class VelocidadeViewSet(viewsets.ModelViewSet):
	
	queryset = Velocidade.objects.all()
	serializer_class = VelocidadeSerializer

class EsperaViewSet(viewsets.ModelViewSet):
	
	queryset = Espera.objects.all()
	serializer_class = EsperaSerializer

class DesligamentoViewSet(viewsets.ModelViewSet):
	
	queryset = Desligamento.objects.all()
	serializer_class = DesligamentoSerializer

class SaidaAuxiliarViewSet(viewsets.ModelViewSet):
	
	queryset = SaidaAuxiliar.objects.all()
	serializer_class = SaidaAuxiliarSerializer
