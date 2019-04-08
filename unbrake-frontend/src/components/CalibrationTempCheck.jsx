import React from "react";
import "../App.css";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { connect } from "react-redux";
import PropTypes, { func } from "prop-types";
import { changeGraphic1, changeGraphic2 } from "../actions/ConfigActions";

const FIRST_CHECK_ID = "FirstCheck";

class CalibrationTempCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedF: false
    };

    this.handleChange = name => event => {
      this.setState({ [name]: event.target.checked });
    };
  }

  renderCheck() {
    const {
      checkID,
      graphic1,
      graphic2,
      enableGraphic1,
      enableGraphic2
    } = this.props;
    if (checkID === FIRST_CHECK_ID)
      return (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={graphic1}
                onChange={(event, value) => enableGraphic1(value)}
                indeterminate
              />
            }
            label="Plotar Temperatura 1"
          />
        </div>
      );

    return (
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={graphic2}
              onChange={(event, value) => enableGraphic2(value)}
              indeterminate
            />
          }
          label="Plotar Temperatura 2"
        />
      </div>
    );
  }

  render() {
    const { checkedF } = this.state;
    return <div>{this.renderCheck(checkedF)}</div>;
  }
}

CalibrationTempCheck.propTypes = {
  checkID: PropTypes.string,
  graphic1: PropTypes.bool,
  graphic2: PropTypes.bool,
  enableGraphic1: func,
  enableGraphic2: func
};
CalibrationTempCheck.defaultProps = {
  checkID: "",
  graphic1: false,
  graphic2: false,
  enableGraphic1: () => {},
  enableGraphic2: () => {}
};

const mapStateToProps = state => ({
  graphic1: state.configReducer.graphic1,
  graphic2: state.configReducer.graphic2
});

const mapDispatchToProps = dispatch => ({
  enableGraphic1: value => dispatch(changeGraphic1(value)),
  enableGraphic2: value => dispatch(changeGraphic2(value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalibrationTempCheck);
