'''
Test of create user and token verify
'''

import pytest
from django.test import Client
from utils.token import create_token  # pylint: disable = unused-import


# pylint: disable = redefined-outer-name

@pytest.mark.django_db
@pytest.mark.parametrize(
    "username, email, password", (
        pytest.param("usermane", "email", "password", id='create_user_test_1'),
    )
)
def test_create_user(username, email, password, create_token):
    '''
    Test the create of a user
    '''
    client = Client()
    token = create_token(is_superuser=True)

    result = client.post(
        '/graphql?query=mutation{createUser(username: "' +
        username +
        '", password: "' +
        password +
        '", email: "' +
        email +
        '", isSuperuser: false'
        '){user{id, username}}}', HTTP_AUTHORIZATION=token)
    assert result.status_code == 200
    user = result.json()['data']['createUser']['user']
    assert user['username'] == username


@pytest.mark.django_db
@pytest.mark.parametrize(
    "username, password, email", (
        pytest.param("usermane", "password", "email", id='test_token_auth_1'),
    )
)
def test_token_auth(username, password, email, create_token):
    '''
    Create a user, get the token and verify it
    '''
    client = Client()
    token = create_token(is_superuser=True)
    result = client.post(
        '/graphql?query=mutation{createUser(username: "' +
        username +
        '", password: "' +
        password +
        '", email: "' +
        email +
        '", isSuperuser: false'
        '){user{id, username}}}', HTTP_AUTHORIZATION=token)

    assert result.status_code == 200

    token = client.post(
        '/graphql?query=mutation{tokenAuth(username: "' +
        username +
        '", password: "' +
        password +
        '"){token}}')

    assert token.status_code == 200

    result_token = token.json()['data']['tokenAuth']['token']

    verify = client.post(
        '/graphql?query=mutation{verifyToken'
        '(token: "' + result_token + '"){payload}}')
    assert verify.status_code == 200
    assert verify.json()[
        'data']['verifyToken']['payload']['username'] == username


@pytest.mark.django_db
@pytest.mark.parametrize(
    "username, password, email1, email2",
    (pytest.param(
        "username",
        "password",
        "email1",
        "email2",
        id='all_users_test_1'),
     ))
def test_get_all_users(
        username,
        email1,
        email2,
        password,
        create_token):
    '''
    Get all the users in db
    '''
    client = Client()
    token = create_token(is_superuser=True)

    result1 = client.post(
        '/graphql?query=mutation{createUser(username:"' +
        username + "1" +
        '" , password: "' +
        password +
        '", email: "' +
        email1 +
        '", isSuperuser: false){user{id, username, isSuperuser}}}',
        HTTP_AUTHORIZATION=token)

    assert result1.status_code == 200

    result2 = client.post(
        '/graphql?query=mutation{createUser(username: "' +
        username + "2" +
        '", password: "' +
        password +
        '", email: "' +
        email2 +
        '", isSuperuser: false'
        '){user{id, username}}}', HTTP_AUTHORIZATION=token)
    assert result2.status_code == 200

    all_users = client.get(
        '/graphql?query=query{users{id, username}}', HTTP_AUTHORIZATION=token
    )

    second_user = all_users.json()['data']['users'][1]['username']
    assert second_user == username + "1"
    last_user = all_users.json()['data']['users'][2]['username']
    assert last_user == username + "2"
