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
    cycles = graphene.Field(CyclesType, id=graphene.Int(), CyclesNumber=graphene.Int(), CyclesTime=graphene.Int() )
    all_cycles = graphene.List(CyclesType, id=graphene.Int())

    velocity = graphene.Field(VelocityType, id=graphene.Int(), UpperLimit=graphene.Int(), InferiorLimit=graphene.Int() )
    all_velocity = graphene.List(VelocityType)

    wait = graphene.Field(WaitType, id=graphene.Int(), UpperTime=graphene.Int(), InferiorTime=graphene.Int() )
    all_wait = graphene.List(WaitType)

    shutdown = graphene.Field(ShutdownType, id=graphene.Int(), DisablesShutdown=graphene.Boolean() )
    all_shutdown = graphene.List(ShutdownType)

    auxiliaryoutput = graphene.Field(AuxiliaryOutputType, id=graphene.Int(), EnableOutput=graphene.Boolean(), Temperature=graphene.Float(), Time=graphene.Float() )
    all_auxiliaryoutuput = graphene.List(AuxiliaryOutputType)

    def resolve_all_cycles(self, info, ** kwargs):
        return Cycles.objects.all()

    def resolve_cycles(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Cycles.objects.get(pk=id)
        return None


    def resolve_all_velocity(self, info, ** kwargs):
        return Velocity.objects.all()

    def resolve_velocity(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Velocity.objects.get(pk=id)
        return None


    def resolve_all_wait(self, info, ** kwargs):
        return  Wait.objects.all()

    def resolve_wait(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Wait.objects.get(pk=id)
        return None


    def resolve_all_shutdown(self, info, ** kwargs):
        return  Shutdown.objects.all()

    def resolve_shutdown(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Shutdown.objects.get(pk=id)
        return None
        

    def resolve_all_auxiliaryoutput(self, info, ** kwargs):
        return  AuxiliaryOutput.objects.all()

    def resolve_auxiliaryoutput(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return AuxiliaryOutput.objects.get(pk=id)
        return None
