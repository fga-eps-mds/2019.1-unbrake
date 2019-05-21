'''
Needed for GraphQL configuration
'''

import graphene
import graphql_jwt
import user.schema
import configuration.schema
import calibration.schema
import calibration.mutation

# pylint: disable = too-few-public-methods


class Query(
        user.schema.Query,
        configuration.schema.Query,
        calibration.schema.Query,
        graphene.ObjectType):
    '''
    This class will inherit from multiple Queries
    as we begin to add more apps to our project
    '''


class Mutation(
        user.schema.Mutation,
        configuration.schema.Mutation,
        calibration.mutation.Mutation,
        graphene.ObjectType,):
    '''
    This class is responsible for providing the token to user
    '''
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

# pylint: disable=invalid-name


schema = graphene.Schema(
    query=Query,
    mutation=Mutation)
