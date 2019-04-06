import graphene

from graphene_django.types import DjangoObjectType

from configuration.models import Cycles, Velocity, Wait, Shutdown, AuxiliaryOutput

class CyclesType(DjangoObjectType):
    class Meta:
        model = Cycles

class VelocityType(DjangoObjectType):
    class Meta:
        model = Velocity

class WaitType(DjangoObjectType):
    class Meta:
        model = Wait

class ShutdownType(DjangoObjectType):
    class Meta:
        model = Shutdown

class AuxiliaryOutputType(DjangoObjectType):
    class Meta:
        model = AuxiliaryOutput

class Query(object):
    all_cycles = graphene.List(CyclesType)
    all_velocity = graphene.List(VelocityType)
    all_wait = graphene.List(WaitType)
    all_shutdown = graphene.List(ShutdownType)
    all_auxiliaryoutuput = graphene.List(AuxiliaryOutputType)

    def resolve_all_cycles(self, info, ** kwargs):
        return Cycles.objects.all ()

    def resolve_all_velocity(self, info, ** kwargs):
        return Velocity.objects.all()

    def resolve_all_wait(self, info, ** kwargs):
        return  Wait.objects.all()

    def resolve_all_shutdown(self, info, ** kwargs):
        return  Shutdown.objects.all()
        
    def resolve_all_auxiliaryoutput(self, info, ** kwargs):
        return  AuxiliaryOutput.objects.all()
