import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField} from 'redux-form-material-ui'
import Button from '@material-ui/core/Button';

const validate = values => {
  const errors = {};
  const requiredFields = [
    'username',
    'password'
  ]
  requiredFields.forEach(field => {
    if(!values[field]) {
      errors[field] = 'Required'
    }
    else{
      
    }
  })
  return errors;
}

const renderField = ({
  input,
  label,
  type,
  meta: {touched, error, invalid}
}) => (
  <div>
    <TextField
      label={label}
      placehoder={label}
      error={ error && touched }
      type={type}
      variant='outlined'
      helperText={touched && error}
      {... input}
    />
  </div>
)

const Login = props => {
  const { handleSubmit, submitting } = props;

  console.log(props);
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name='username'
          type='text'
          component={renderField}
          label='Usuário'
          variant='outlined'
        />
      </div>
      <br/>
      <div>
        <Field
          name='password'
          type='password'
          component={renderField}
          label='Senha'
          variant='outlined'
        />
      </div>
      <br/>
      <div>
        <Button color='secondary' variant='contained' type='submit' disabled={submitting}>Entrar</Button>
        <Button color='secondary' variant='contained' disabled={submitting}>Cadastrar</Button>
      </div>
      <div>
        <a href='./'> Esqueci minha senha</a>
      </div>
    </form>
  );
}

export default reduxForm({
  form: 'login',
  validate
}) (Login)

