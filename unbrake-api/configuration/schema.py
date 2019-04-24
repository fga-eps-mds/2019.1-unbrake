'''
    Schema to use graphene framework to requirement on db
'''

import graphene
from graphene_django.types import DjangoObjectType
from configuration.models import Config

# pylint: disable = too-few-public-methods


class ConfigType(DjangoObjectType):
    '''
        Defining the CyclesConfig Type
    '''
    class Meta:
        '''
            Defining the CyclesConfig Type
        '''
        model = Config


class CreateConfig(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments
    '''
    Class to create a new Config object on db
    '''
    config = graphene.Field(ConfigType)

    class Arguments:
        '''
        Arguments required to create a new config
        '''
        number = graphene.Int()
        time_between_cycles = graphene.Int()
        upper_limit = graphene.Int()
        inferior_limit = graphene.Int()
        upper_time = graphene.Int()
        inferior_time = graphene.Int()
        disable_shutdown = graphene.Boolean()
        enable_output = graphene.Boolean()
        temperature = graphene.Float()
        time = graphene.Float()

    def mutate(self, info, number, time_between_cycles, upper_limit,
               inferior_limit, upper_time, inferior_time, disable_shutdown,
               enable_output, temperature, time):
        '''
        Create the user with the given parameters end add to db
        '''
        config = Config(
            number=number,
            time_between_cycles=time_between_cycles,
            upper_limit=upper_limit,
            inferior_limit=inferior_limit,
            upper_time=upper_time,
            inferior_time=inferior_time,
            disable_shutdown=disable_shutdown,
            enable_output=enable_output,
            temperature=temperature,
            time=time,
        )
        config.save()

        return CreateConfig(config=config)


class Mutation(graphene.ObjectType):
    '''
    GraphQL class to declare all the mutations
    '''
    create_config = CreateConfig.Field()


class Query:
    # pylint: disable =  unused-argument, no-self-use
    '''
        The Query list all the types created above
    '''
    config = graphene.Field(
        ConfigType,
        id=graphene.Int(),
        number=graphene.Int(),
        time_between_cycles=graphene.Int(),
        upper_limit=graphene.Int(),
        inferior_limit=graphene.Int(),
        upper_time=graphene.Int(),
        inferior_time=graphene.Int(),
        disable_shutdown=graphene.Boolean(),
        enable_output=graphene.Boolean(),
        temperature=graphene.Float(),
        Time=graphene.Float())

    all_config = graphene.List(ConfigType)

    def resolve_all_config(self, info, **kwargs):
        '''
            Returning all CyclesConfig on db
        '''
        return Config.objects.all()

    def resolve_config(self, info, **kwargs):
        '''
            Returning only one CyclesConfig by id
        '''
        pk = kwargs.get('id')

        if pk is not None:
            return Config.objects.get(pk=pk)
        return None
