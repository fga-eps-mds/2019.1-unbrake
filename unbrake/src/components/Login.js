import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField} from 'redux-form-material-ui'
import Button from '@material-ui/core/Button';

const Login = props => {
  const { pristine, submitting } = props;

  return (
    <form >
      <div>
        <Field
          name='username'
          type='text'
          component={TextField}
          label='Usuário'
          variant='outlined'
        />
      </div>
      <br/>
      <div>
        <Field
          name='password'
          type='password'
          component={TextField}
          label='Senha'
          variant='outlined'
        />
      </div>
      <br/>
      <div>
        <Button color='secondary' variant='contained' type='submit' disabled={submitting}>Entrar</Button>
        <a href='./'> Esqueci minha senha</a>
      </div>
    </form>
  );
}

export default reduxForm({
  form: 'login'
}) (Login)

