'''
Test of create user and token verify
'''

import pytest
from django.test import Client


@pytest.mark.django_db
@pytest.mark.parametrize(
    "username, email, password", (
        pytest.param("usermane", "email", "password", id='create_user_test_1'),
    )
)
def test_create_user(username, email, password):
    '''
    Test the create of a user
    '''
    client = Client()
    result = client.post(
        '/graphql?query=mutation{createUser(username: "' +
        username +
        '", password: "' +
        password +
        '", email: "' +
        email +
        '", isSuperuser: false'
        '){user{id, username}}}')
    assert result.status_code == 200
    user = result.json()['data']['createUser']['user']
    assert user['username'] == username


@pytest.mark.django_db
@pytest.mark.parametrize(
    "username, password", (
        pytest.param("username", "password", id='create_user_test_1'),
    )
)
def test_get_user(username, password):
    '''
    Test the create of a user
    '''
    client = Client()
    result = client.post(
        '/graphql?query=mutation{createUser(username: "' +
        username +
        '", password: "' +
        password +
        '", isSuperuser: false'
        '){user{id, username}}}')
    assert result.status_code == 200

    user = client.get(
        '/graphql?query=query{user(username: "'
        + username + '"){id, username}}')
    assert user.status_code == 200
    assert user.json()['data']['user']['username'] == username


@pytest.mark.django_db
@pytest.mark.parametrize(
    "username, password", (
        pytest.param("usermane", "password", id='test_token_auth_1'),
    )
)
def test_token_auth(username, password, email):
    '''
    Create a user, get the token and verify it
    '''
    client = Client()
    result = client.post(
        '/graphql?query=mutation{createUser(username: "' +
        username +
        '", password: "' +
        password +
        '", email: "' +
        email +
        '", isSuperuser: false'
        '){user{id, username}}}')

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
    "username1, username2, password, email1, email2",
    (pytest.param(
        "usermane1",
        "username2",
        "password",
        "email1",
        "email2",
        id='all_users_test_1'),
     ))
def test_get_all_users(username1, username2, email1, email2, password):
    '''
    Get all the users in db
    '''
    client = Client()

    result1 = client.post(
        '/graphql?query=mutation{createUser(username:"' +
        username1 +
        '" , password: "' +
        password +
        '", email: "' +
        email1 +
        '", isSuperuser: false){user{id, username, isSuperuser}}}')

    assert result1.status_code == 200

    result2 = client.post(
        '/graphql?query=mutation{createUser(username: "' +
        username2 +
        '", password: "' +
        password +
        '", email: "' +
        email2 +
        '", isSuperuser: false'
        '){user{id, username}}}')
    assert result2.status_code == 200

    all_users = client.get(
        '/graphql?query=query{users{id, username}}'
    )

    first_user = all_users.json()['data']['users'][0]['username']
    assert first_user == username1
    last_user = all_users.json()['data']['users'][1]['username']
    assert last_user == username2
