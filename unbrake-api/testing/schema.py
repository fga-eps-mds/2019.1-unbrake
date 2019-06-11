'''
    Schema to Testing model
'''
import graphene
from graphene_django.types import DjangoObjectType
from testing.models import Testing
from calibration.models import Calibration
from configuration.models import Config

# pylint: disable = too-few-public-methods


class TestingType(DjangoObjectType):
    '''
        Defining the Testing Type with django
    '''
    class Meta:
        '''
            Defining the Testing Type
        '''
        model = Testing


class Query:
    # pylint: disable =  unused-argument, no-self-use
    '''
        Defining the resolves to queries of Graphene
    '''
    testing = graphene.Field(
        TestingType,
        id=graphene.ID(),
    )

    all_testing = graphene.List(TestingType)

    def resolve_testing(self, info, **kwargs):
        '''
            Return a Testing object on db by id
        '''
        pk = kwargs.get('id')
        return Testing.objects.get(pk=pk)

    def resolve_all_testing(self, info):
        '''
            Return all Testing objects on db
        '''
        return Testing.objects.all()


class CreateTesting(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use
    '''
        Defining the mutate to create a new Testing object on db
    '''
    testing = graphene.Field(TestingType)

    class Arguments:
        '''
            Arguments required to create a new Testing object
        '''
        create_by = graphene.String()
        id_calibration = graphene.Int()
        id_configuration = graphene.Int()

    def mutate(
            self,
            info,
            create_by,
            id_calibration,
            id_configuration):
        '''
            Define how the arguments are used to create a new Testing object
        '''
        calibration = Calibration.objects.get(id=id_calibration)
        configuration = Config.objects.get(id=id_configuration)

        testing = Testing(
            create_by=create_by,
            calibration=calibration,
            configuration=configuration
        )

        testing.save()

        return CreateTesting(testing=testing)


class Mutation(graphene.ObjectType):
    '''
        Graphene class concat all mutations
    '''
    create_testing = CreateTesting.Field()
