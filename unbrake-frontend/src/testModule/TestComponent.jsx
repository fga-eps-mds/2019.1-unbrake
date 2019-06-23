import React from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";
// import Button from "@material-ui/core/Button"
import AquisitionsAndCommand from "./AquisitionsAndCommand";
import TestData from "./TestData";
import TabMenuComponent from "./TabMenuComponent";

const percentageTransformer = 100;

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

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const url = `${API_URL_GRAPHQL}/mqtt-reading-key`;
    const method = "GET";
    Request(url, method).then(json => {
      this.setState(prevState => ({
        test: {
          aquisition: {
            ...prevState.test.aquisition
          },
          data: {
            ...prevState.test.data
          },
          mqttKey: json.key
        }
      }));
    });
  }

  handleClick() {
    const newAquisition = {
      aquisition: {
        Tc1: Math.trunc(Math.random() * percentageTransformer), // Temperatura 1(ºC)
        Tc2: Math.trunc(Math.random() * percentageTransformer), // Temperatura 2(ºC)
        Fkgf1: Math.trunc(Math.random() * percentageTransformer), // Força 1 (kfg)
        Fkgf2: Math.trunc(Math.random() * percentageTransformer), // Força 2 (kfg)
        Rrpm: Math.trunc(Math.random() * percentageTransformer), // Rotação (RPM)
        Vkmg: Math.trunc(Math.random() * percentageTransformer), // Velocidade (km/h)
        DPm: Math.trunc(Math.random() * percentageTransformer), // Distância percorrida (m)
        Vc: Math.trunc(Math.random() * percentageTransformer), // Velocidade (comando)
        Pc: Math.trunc(Math.random() * percentageTransformer), // Pressão (comando)
        Out1: false,
        In1: true,
        In2: false,
        In3: true
      },
      data: {
        TES: Math.trunc(Math.random() * percentageTransformer), // TES
        TEI: Math.trunc(Math.random() * percentageTransformer), // TEI
        TEC: Math.trunc(Math.random() * percentageTransformer), // TEC
        SA: Math.trunc(Math.random() * percentageTransformer), // Snub atual
        TS: Math.trunc(Math.random() * percentageTransformer), // Total de Snubs
        DTE: Math.random() * percentageTransformer
      }
    };
    this.setState(prevState => ({
      test: { ...prevState.test, ...newAquisition }
    }));
  }

  render() {
    const { test } = this.state;
    const { aquisition, data } = test;
    return (
      <Grid
        container
        xs={12}
        item
        // justify="center"
        style={{ marginTop: "80px" }}
      >
        <Grid container item justify="center" xs={6}>
          <AquisitionsAndCommand newAquisition={aquisition} />
        </Grid>
        <Grid container item justify="center" xs={6}>
          {test.mqttKey !== "" && (
            <TestData newData={data} mqttKey={test.mqttKey} />
          )}
        </Grid>
        <Grid container item xs={3}>
          {/* <Button
            onClick={this.handleClick}
            color="secondary"
            variant="contained"
          >
            Update
          </Button> */}
        </Grid>
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
