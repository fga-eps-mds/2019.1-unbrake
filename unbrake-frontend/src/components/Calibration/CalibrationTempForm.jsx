import React from "react";
import "../../App.css";
import { reduxForm } from "redux-form";
import CalibrationFields from "./CalibrationTempFields";
import CalibrationCheck from "./CalibrationTempCheck";

const MyForm = () => (
  //retorno do render, fazer virar classe e colocar construtor
  <form>
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-evenly"
      }}
    >
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-evenly",
          flex: 2
        }}
      >
        <CalibrationFields calibration={field_1} field="1" />

        <CalibrationFields field="2" />
      </div>
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-evenly",
          marginLeft: "3%",
          flex: 1
        }}
      >
        <CalibrationCheck graphicType="temperatura" checkID="1" />
        <CalibrationCheck graphicType="temperatura" checkID="2" />
      </div>
    </div>
  </form>
);

// Decorate with redux-form
const formExportation = reduxForm({
  form: "myForm"
})(MyForm);

/** shouldComponentUpdate(nextProps) {
    const { configuration } = this.props;
    if (configuration !== nextProps.configuration) {
      const rightConfig = Object.assign({}, nextProps.configuration);
      rightConfig.CONFIG_ENSAIO.TMO =
        nextProps.configuration.CONFIG_ENSAIO.TMO !== "FALSE";
      rightConfig.CONFIG_ENSAIO.TAO =
        nextProps.configuration.CONFIG_ENSAIO.TAO !== "FALSE";

      const { dispatch } = this.props;
      dispatch(initialize("configuration", rightConfig.CONFIG_ENSAIO));
      this.setState({ configuration: rightConfig.CONFIG_ENSAIO });
      return true;
    }
    return false;
  }*/
  //Colocar construtor aqui
export default formExportation;
