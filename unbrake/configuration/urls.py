from rest_framework import routers
from .views import CiclosViewSet, VelocidadeViewSet, EsperaViewSet, DesligamentoViewSet, SaidaAuxiliarViewSet

ROUTER = routers.DefaultRouter()
ROUTER.register(r'ciclos', CiclosViewSet)
ROUTER.register(r'velocidade', VelocidadeViewSet)
ROUTER.register(r'espera', EsperaViewSet)
ROUTER.register(r'desligamento', DesligamentoViewSet)
ROUTER.register(r'saida', SaidaAuxiliarViewSet)

urlpatterns = ROUTER.urls 