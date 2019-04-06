import React from "react";
import "../App.css";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changeGraphic1, changeGraphic2 } from "../actions/ConfigActions";

const FIRST_CHECK_ID = "FirstCheck";
const mapDispatchToProps = () => ({
  changeGraphic1,
  changeGraphic2
});

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
    const { checkID, graphic1, graphic2 } = this.props;
    if (checkID === FIRST_CHECK_ID)
      return (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={graphic1}
                onChange={(event, value) => changeGraphic1(value)}
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
              onChange={(event, value) => changeGraphic2(value)}
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
  graphic2: PropTypes.bool
};
CalibrationTempCheck.defaultProps = {
  checkID: "",
  graphic1: false,
  graphic2: false
};

const mapStateToProps = state => ({
  graphic1: state.configReducer.graphic1,
  graphic2: state.configReducer.graphic2
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalibrationTempCheck);
