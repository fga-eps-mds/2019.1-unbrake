import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import { SubmissionError } from 'redux-form'
import { TextField} from 'redux-form-material-ui'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 10,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '600px'
  },
  field: {
    paddingTop: theme.spacing.unit * 10,
    paddingBottom: theme.spacing.unit * 10,
  },
  grid: {
    padding: '5px',
  }
});


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
      fullWidth
      helperText={touched && error}
      {... input}
    />
  </div>
)


class Login extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { handleSubmit, submitting, classes} = this.props;
    
    console.log(this.props);
    return (
      <Grid
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
        container spacing={24}
        >
        <Paper className = { classes.paper }>
        <h2 styles={{color:'black'}}>Bem vindo!</h2>
          <form onSubmit={handleSubmit(()=> {console.log('alert')})}>
            <Grid className = { classes.grid }>
              <Field
                name='username'
                type='text'
                component={renderField}
                label='Usuário'
                variant='outlined'
                fullWidth
                className = { classes.field }
                />
            </Grid>
            <Grid item xs={12} sm={12} className = { classes.grid } >         
              <Field
                name='password'
                type='password'
                component={renderField}
                label='Senha'
                variant='outlined'
                className = { classes.field }
                />
            </Grid>
            <Grid
              container item xs={24}
              alignItems="center"
              justify="center"
              >
            <Grid item xs={3} className={ classes.grid }>
              <Button
                color='secondary'
                fullWidth
                variant='contained'
                type='submit'
                disabled={submitting}
                >
                Entrar
              </Button>
            </Grid>
            <Grid item xs={3} className={ classes.grid }>
              <Button
                color='secondary'
                variant='contained'
                disabled={submitting}
                fullWidth
                >
                Cadastrar
              </Button>
            </Grid>
            </Grid>
          <div>
            <a href='./'> Esqueci minha senha</a>
          </div>
        </form>
        </Paper>
      </Grid>
  )};
}



Login = reduxForm({
  form: 'login',
  validate
}) (Login)

export default withStyles(styles)(Login)
