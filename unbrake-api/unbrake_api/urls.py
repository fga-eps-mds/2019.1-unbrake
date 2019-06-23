"""unbrake URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from .views import get_mqtt_reading_key


urlpatterns = [
    url(r'^graphql/mqtt-reading-key', get_mqtt_reading_key),
    url(r'^graphql', csrf_exempt(GraphQLView.as_view(graphiql=True))),
]
