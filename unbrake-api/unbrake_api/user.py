'''
    Arquivo de funções para autenticação de usuários e requisições
'''
from django.contrib.auth.models import User
from django.contrib.auth import logout


def forgot_password(user, new_password):
    '''
        Função para setar uma nova senha para o usuario
    '''
    user.set_password(new_password)
    user.save()


def build_user(username, password):
    '''
        Função para criar e salvar um usuário
        com nome de usuario e senha
    '''
    current_user = User.objects.create_user(username, password)
    current_user.save()


def logout_view(request):
    '''
        Função para logout
    '''
    logout(request)
    # redirect
