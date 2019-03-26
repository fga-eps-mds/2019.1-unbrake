import React from 'react';
import { connect } from 'react-redux';

class Result extends React.Component{
	constructor(props){
		super(props)
	}


render(){
	return (
		<p style={{color: 'red', fontSize: '40px'}}> {this.props.sum}  </p>
	)
}
}

const mapStateToProps = state => {
  return state.sum
}

//export default Result;
export default connect(
  mapStateToProps,
)(Result)

//export default Result;
