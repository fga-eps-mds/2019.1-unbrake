'''
    Schema to use graphene framework to requirement on db
'''

import graphene
from graphene_django.types import DjangoObjectType
from configuration.models import CyclesConfig, VelocityConfig, WaitConfig
from configuration.models import ShutdownConfig, AuxiliaryOutputConfig

# pylint: disable = too-few-public-methods


class CyclesConfigType(DjangoObjectType):

    '''
        Defining the CyclesConfig Type
    '''

    class Meta:
        '''
            Defining the CyclesConfig Type
        '''
        model = CyclesConfig


class VelocityConfigType(DjangoObjectType):
    '''
        Defining the VelocityConfig Type
    '''

    class Meta:
        '''
            Defining the VelocityConfig Type
        '''
        model = VelocityConfig


class WaitConfigType(DjangoObjectType):
    '''
        Defining the WaitConfig Type
    '''
    class Meta:
        '''
            Defining the WaitConfig Type
        '''
        model = WaitConfig


class ShutdownConfigType(DjangoObjectType):
    '''
        Defining the ShutdownConfig Type
    '''
    class Meta:
        '''
            Defining the ShutdownConfig Type
        '''
        model = ShutdownConfig


class AuxiliaryOutputConfigType(DjangoObjectType):
    '''
        Defining the AuxiliaryOutputConfig Type
    '''
    class Meta:
        '''
            Defining the AuxiliaryOutputConfig Type
        '''
        model = AuxiliaryOutputConfig


class Query:
    # pylint: disable =  unused-argument, no-self-use
    '''
        The Query list all the types created above
    '''
    cycles_config = graphene.Field(
        CyclesConfigType,
        id=graphene.Int(),
        number=graphene.Int(),
        time_between_cycles=graphene.Int())
    all_cycles_config = graphene.List(CyclesConfigType, id=graphene.Int())

    velocity_config = graphene.Field(
        VelocityConfigType,
        id=graphene.Int(),
        upper_limit=graphene.Int(),
        inferior_limit=graphene.Int())
    all_velocity_config = graphene.List(VelocityConfigType)

    wait_config = graphene.Field(
        WaitConfigType,
        id=graphene.Int(),
        upper_time=graphene.Int(),
        inferior_time=graphene.Int())
    all_wait_config = graphene.List(WaitConfigType)

    shutdown_config = graphene.Field(
        ShutdownConfigType,
        id=graphene.Int(),
        disable_shutdown=graphene.Boolean())
    all_shutdown_config = graphene.List(ShutdownConfigType)

    auxiliary_output_config = graphene.Field(
        AuxiliaryOutputConfigType,
        id=graphene.Int(),
        enable_output=graphene.Boolean(),
        temperature=graphene.Float(),
        Time=graphene.Float())
    all_auxiliary_output_config = graphene.List(AuxiliaryOutputConfigType)

    def resolve_all_cycles_config(self, info, **kwargs):
        '''
            Returning all CyclesConfig on db
        '''
        return CyclesConfig.objects.all()

    def resolve_cycles_config(self, info, **kwargs):
        '''
            Returning only one CyclesConfig by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return CyclesConfig.objects.get(pk=pk)
        return None

    def resolve_all_velocity_config(self, info, **kwargs):
        '''
            Returning all VelocityConfig on db
        '''
        return VelocityConfig.objects.all()

    def resolve_velocity_config(self, info, **kwargs):
        '''
            Returning only one VelocityConfig by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return VelocityConfig.objects.get(pk=pk)
        return None

    def resolve_all_wait_config(self, info, **kwargs):
        '''
            Returning all WaitConfig on db
        '''
        return WaitConfig.objects.all()

    def resolve_wait_config(self, info, **kwargs):
        '''
            Returning only one WaitConfig by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return WaitConfig.objects.get(pk=pk)
        return None

    def resolve_all_shutdown_config(self, info, **kwargs):
        '''
            Returning all ShutdownConfig on db
        '''
        return ShutdownConfig.objects.all()

    def resolve_shutdown_config(self, info, **kwargs):
        '''
            Returning only one ShutdownConfig by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return ShutdownConfig.objects.get(pk=pk)
        return None

    def resolve_all_auxiliary_output_config(self, info, **kwargs):
        '''
            Returning all AuxiliaryOutputConfig on db
        '''
        return AuxiliaryOutputConfig.objects.all()

    def resolve_auxiliary_output_config(self, info, **kwargs):
        '''
            Returning only one AuxiliaryOutputConfig by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return AuxiliaryOutputConfig.objects.get(pk=pk)
        return None
