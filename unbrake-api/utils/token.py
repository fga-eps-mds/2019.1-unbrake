'''
    This fixture create a user and a token to be used in te test
'''
import pytest
from graphql_jwt.shortcuts import get_token
from django.contrib.auth import get_user_model


@pytest.fixture
@pytest.mark.django_db
def create_token(is_superuser=False):
    '''
        Save a user on db and return the token
    '''
    def _create_token(is_superuser=is_superuser):

        user = get_user_model()(
            username="Teste",
            email="mail@mail.com",
            is_superuser=is_superuser
        )
        user.set_password("abobora")
        user.save()

        token = get_token(user)
        return "JWT " + token
    return _create_token
