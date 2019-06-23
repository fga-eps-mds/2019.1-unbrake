import React from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import AquisitionsAndCommand from "./AquisitionsAndCommand";
import TestData from "./TestData";
import TabMenuComponent from "./TabMenuComponent";

class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      test: {
        aquisition: {
          Tc1: "", // Temperatura 1(ºC)
          Tc2: "", // Temperatura 2(ºC)
          Fkgf1: "", // Força 1 (kfg)
          Fkgf2: "", // Força 2 (kfg)
          Rrpm: "", // Rotação (RPM)
          Vkmg: "", // Velocidade (km/h)
          DPm: "", // Distância percorrida (m)
          Vc: "", // Velocidade (comando)
          Pc: "", // Pressão (comando)
          Out1: false,
          In1: false,
          In2: false,
          In3: false
        },
        data: {
          TES: "1", // TES
          TEI: "", // TEI
          TEC: "", // TEC
          SA: "", // Snub atual
          TS: "", // Total de Snubs
          DTE: "" // Duração total do ensaio
        },
        mqttKey: ""
      }
    };
  }

  render() {
    const { test } = this.state;
    const { aquisition, data } = test;
    return (
      <Grid container xs={12} item style={{ marginTop: "80px" }}>
        <Grid container item justify="center" xs={6}>
          <AquisitionsAndCommand newAquisition={aquisition} />
        </Grid>
        <Grid container item justify="center" xs={6}>
          <TestData newData={data} />
        </Grid>
        <Grid container item xs={3} />
        <Grid item container xs={12} justify="center">
          <TabMenuComponent />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    configId: state.testReducer.configId,
    calibId: state.testReducer.calibId
  };
};

export default connect(
  mapStateToProps,
  null
)(Test);
