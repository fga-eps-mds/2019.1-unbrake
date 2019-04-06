'''
Tests for models of configuration app
'''

import pytest


# First argument are the parameters names
# Second is a tuple of params
# First argument of param is the first parameter name and so on
# id is like the name for the test case
# Is possible to test only one test case with: pytest [file] -k [id]
@pytest.mark.parametrize(
    "param1,param2,summ", (
        pytest.param(8, 4, 12, id='sample_bigger_1'),
        pytest.param(30, 2, 32, id='sample_bigger_2'),
        pytest.param(2, 1, 3, id='sample_bigger_3'),
        pytest.param(1, 1, 2, id='sample_equal')
    )
)
def test_sample(param1, param2, summ):
    '''
    This is a sample file for guiding development team on writting the
    first tests and for setting scripts.  Once the team understands it and
    environment is ready, it must be deleted.
    '''

    assert param1 + param2 == summ
    assert param1 >= param2
    assert param2 >= 0
    with pytest.raises(TypeError,
                       match=r".*unsupported operand type\(s\).* and 'str'"):
        _ = param1 - str(param2)
