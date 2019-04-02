from rest_framework import routers
from .views import CiclosViewSet, VelocidadeViewSet, EsperaSerializer, DesligamentoSerializer, SaidaAuxiliarSerializer

ROUTER = routers.DefaultRouter()
ROUTER.register(r'ciclos', CiclosViewSet)
ROUTER.register(r'velocidade', VelocidadeViewSet)
ROUTER.register(r'espera', EsperaSerializer)
ROUTER.register(r'desligamento', DesligamentoSerializer)
ROUTER.register(r'saida', SaidaAuxiliarSerializer)