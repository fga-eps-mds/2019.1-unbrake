from django.shortcuts import render
from .models import Ciclos, Velocidade, Espera, Desligamento, SaidaAuxiliar
from .serializers import CiclosSerializer, VelocidadeSerializer, EsperaSerializer, DesligamentoSerializer, SaidaAuxiliarSerializer

# Create your views here.
class CiclosViewSet(viewset.ModelViewSet):

	queryset = Ciclos.objects.all()
	serializer_class = CiclosSerializer

class VelocidadeViewSet(viewset.ModelViewSet):
	
	queryset = Velocidade.objects.all()
	serializer_class = VelocidadeSerializer

class EsperaViewSet(viewset.ModelViewSet):
	
	queryset = Espera.objects.all()
	serializer_class = EsperaSerializer

class DesligamentoViewSet(viewset.ModelViewSet):
	
	queryset = Desligamento.objects.all()
	serializer_class = DesligamentoSerializer

class SaidaAuxiliarViewSet(viewset.ModelViewSet):
	
	queryset = SaidaAuxiliar.objects.all()
	serializer_class = SaidaAuxiliarSerializer
