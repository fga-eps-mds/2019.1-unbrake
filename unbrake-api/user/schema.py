'''
Schema to create and authenticate user
'''

from django.contrib.auth import get_user_model
import graphene
from graphene_django import DjangoObjectType

# pylint: disable = too-few-public-methods


class UserType(DjangoObjectType):
    '''
    Create UserType object
    '''
    class Meta:
        '''
        Get the user model from django.contrib.auth
        '''
        model = get_user_model()


class CreateUser(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments

    '''
    Class to create a new user
    '''
    user = graphene.Field(UserType)

    class Arguments:
        '''
        Arguments required to create a new user
        '''
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        is_superuser = graphene.Boolean(required=True)

    def mutate(self, info, username, email, password, is_superuser):
        '''
        Create the user with the given parameters end add to db
        '''
        user = get_user_model()(
            username=username,
            email=email,
            is_superuser=is_superuser
        )
        user.set_password(password)
        user.save()

        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    '''
    GraphQL class to declare all the mutations
    '''
    create_user = CreateUser.Field()


class Query(graphene.ObjectType):
    # pylint: disable =  unused-argument, no-self-use
    '''
    GraphQL class to declare all the queries
    '''
    current_user = graphene.Field(UserType)
    user = graphene.Field(UserType, username=graphene.String())
    users = graphene.List(UserType)

    def resolve_users(self, info):
        '''
        Return all user on db
        '''
        return get_user_model().objects.all()

    def resolve_current_user(self, info):
        '''
        Return the current user
        '''
        return info.context.user

    def resolve_user(self, info, **kwargs):
        '''
            Returning only one User by username
        '''
        username = kwargs.get('username')

        return get_user_model().objects.get(username=username)
