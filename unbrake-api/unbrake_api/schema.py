'''
Needed for GraphQL configuration
'''

import graphene
import configuration.schema


class Query(configuration.schema.Query, graphene.ObjectType):
    '''
    This class will inherit from multiple Queries
    as we begin to add more apps to our project
    '''


schema = graphene.Schema(query=Query)  # pylint: disable=invalid-name
