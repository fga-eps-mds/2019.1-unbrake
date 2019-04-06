import React from "react";
import "../App.css";
import { Checkbox, FormControlLabel } from "@material-ui/core";

class CalibrationFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedF: true
    };

    this.handleChange = name => event => {
      this.setState({ [name]: event.target.checked });
    };
  }

  render() {
    const { checkedF } = this.state;
    return (
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={{ checkedF }}
              onChange={this.handleChange("checkedF")}
              value="checkedF"
              indeterminate
            />
          }
          label="Plotar Temperatura 1"
        />
      </div>
    );
  }
}

export default CalibrationFields;
