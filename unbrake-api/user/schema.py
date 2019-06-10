'''
Schema to create and authenticate user
'''

import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

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


class UpdatePassword(graphene.Mutation):
    # pylint: disable =  unused-argument, no-self-use, too-many-arguments
    '''
    Class to update the password of a user
    '''

    error = graphene.String()
    user = graphene.Field(UserType)

    class Arguments:
        '''
        Arguements required to update a password
        '''
        username = graphene.String(required=True)
        old_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    def mutate(self, info, username, old_password, new_password):
        '''
        Mutate to check if the user exist and check the password
        '''

        try:

            user = get_user_model().objects.get(username=username)

        except ObjectDoesNotExist:

            return UpdatePassword(error="User no found")

        if user.check_password(old_password):

            user.set_password(new_password)
            user.save()
            return UpdatePassword(user=user)

        return UpdatePassword(error="Wrong password")


class Mutation(graphene.ObjectType):
    '''
    GraphQL class to declare all the mutations
    '''
    create_user = CreateUser.Field()
    update_password = UpdatePassword.Field()


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
