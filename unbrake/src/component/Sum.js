import React from 'react';
import Result from './Result';
import { connect } from 'react-redux';
import {add} from '../actions'


class Sum extends React.Component {
  constructor(props){
    super(props);
    this.state = {number1: '', number2: '', sum: ''}; //state: Estado interno. Um Json.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(event) {
    if(event.target.name === "number1"){
      this.setState({number1: event.target.value});
    }
    else{
      this.setState({number2: event.target.value});
    }
  }

  handleSubmit(event){
    this.props.dispatch(add(this.state.number1, this.state.number2)) // Mandar uma ação para algum lugar
    let sum = +this.state.number1 + +this.state.number2
    this.setState({sum: sum});
    event.preventDefault();

  }
  //connect: conecta meu componente ao reducer
  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="number1" value={this.state.number1} onChange={this.handleChange} />
        <input type="text" name="number2" value={this.state.number2} onChange={this.handleChange} />
        <button type="submit">Sum</button>
      </form>
      <Result/>
      </div>)

  }
}

export default connect()(Sum); 

//export default Sum
