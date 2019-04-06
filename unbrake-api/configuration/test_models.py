import pytest
from django.test import Client
from .models import Cycles, Velocity, Wait, Shutdown, AuxiliaryOutput

# First argument are the parameters names
# Second is a tuple of params
# First argument of param is the first parameter name and so on
# id is like the name for the test case
# Is possible to test only one test case with: pytest [file] -k [id]
@pytest.mark.django_db
@pytest.mark.parametrize(
    "cyclesNumber,cyclesTime", (
        pytest.param(10, 20, id='cycle_teste_1'),
    )
)

def test_cycle (cyclesNumber, cyclesTime):

    test_Cycle = Cycles(
        CyclesNumber = cyclesNumber,
        CyclesTime = cyclesTime,
    ).save()

    client = Client()
    result = client.get('/graphql?query={Cycles{CyclesNumber, CyclesTime}}')
    print(result.content)
    assert result.status_code == 200
    assert result.content == Cycles.objects.last()
    