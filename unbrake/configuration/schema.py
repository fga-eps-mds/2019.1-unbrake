 # cookbook/ingredients/schema.py
#import graphene
#from graphene_django.types import DjangoObjectType
#from unbrake.configuration.models import Ciclos, Velocidade, Espera, Desligamento, SaidaAuxiliar
#
#class CiclosType(DjangoObjectType):
#    class Meta:
#        model = Ciclos
#
#class VelocidadeType(DjangoObjectType):
#    class Meta:
#        model = Velocidade
#
#class EsperaType(DjangoObjectType):
#    class Meta:
#        model = Espera
#
#class DesligamentoType(DjangoObjectType):
#    class Meta:
#        model = Desligamento
#
#class SaidaAuxiliarType(DjangoObjectType):
#    class Meta:
#        model = SaidaAuxiliar
#
#class Query(object):
#    all_ciclos = graphene.List(CiclosType)
#    all_velocidade = graphene.List(VelocidadeType)
#    all_espera = graphene.List(EsperaType)
#    all_desligamento = graphene.List(DesligamentoType)
#    all_saidaauxiliar = graphene.List(SaidaAuxiliarType)
#
#    def resolve_all_ciclos(self, info, ** kwargs):
#        return Ciclos.objects.all ()
#
#    def resolve_all_velocidade(self, info, ** kwargs):
#        return Velocidade.objects.all()
#
#    def resolve_all_espera(self, info, ** kwargs):
#        return  Espera.objects.all()
#
#    def resolve_all_desligamento(self, info, ** kwargs):
#        return  Desligamento.objects.all()
#        
#    def resolve_all_saidaauxiliar(self, info, ** kwargs):
#        return  SaidaAuxiliar.objects.all()
