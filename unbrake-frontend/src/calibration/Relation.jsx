import React from "react";
import PropTypes from "prop-types";
import { reduxForm, initialize } from "redux-form";
import { connect } from "react-redux";
import { withStyles, Grid } from "@material-ui/core";
import styles from "../components/Styles";
import { field } from "../components/ComponentsForm";
import completeTire from "../img/completeTire.png";
import sideTire from "../img/sideTire.png";
import tire from "../img/tire.png";
import VBelt from "../img/Vbelt.png";

const double = 2;
const percentage = 100;
const inch = 15.4;
const decimalPlace = 2;
const validNumber = 0;

export const labelRelation = name => {
  let nameLabel = "";
  switch (name) {
    case "LST":
      nameLabel = "Largura da seção transversal";
      break;
    case "RAL":
      nameLabel = "Relação altura/largura";
      break;
    case "DIA":
      nameLabel = "Diametro do aro";
      break;
    case "RSM":
      nameLabel = "Rotação sincrona do motor (rpm)";
      break;
    case "DPO":
      nameLabel = "Diametro da polia motora (mm)";
      break;
    case "DPM":
      nameLabel = "Diametro da polia movida (mm)";
      break;
    case "RDT":
      nameLabel = "Relação de transmissão (rpm)";
      break;
    case "RDP":
      nameLabel = "Raio do pneu (mm)";
      break;
    default:
      break;
  }
  return nameLabel;
};

const renderField = (states, classes, handleChange) => {
  const type = states;
  type.label = labelRelation(states.name);
  return <React.Fragment>{field(type, classes, handleChange)}</React.Fragment>;
};

const rowField = (states, classes, handleChange) => {
  const fields = states.map(value => {
    return (
      <Grid
        key={`component ${value.name}`}
        alignItems="center"
        justify="center"
        container
        item
        xs={6}
      >
        {renderField(value, classes, handleChange)}
      </Grid>
    );
  });
  return fields;
};

const tireFields = (states, classes, handleChange) => {
  const fields = states.map(value => {
    return (
      <Grid
        alignItems="center"
        justify="center"
        container
        item
        xs={12}
        key={`fields ${value.name}`}
      >
        {rowField(value, classes, handleChange)}
      </Grid>
    );
  });
  return fields;
};

const tireDictionary = relation => {
  const dictionary = [
    [
      { name: "LST", value: relation.LST, disable: false },
      { name: "RAL", value: relation.RAL, disable: false }
    ],
    [
      { name: "DIA", value: relation.DIA, disable: false },
      { name: "RDP", value: relation.RDP, disable: true }
    ]
  ];
  return dictionary;
};

const vbeltDictionary = relation => {
  const dictionary = [
    [
      { name: "DPO", value: relation.DPO, disable: false },
      { name: "RSM", value: relation.RSM, disable: false }
    ],
    [
      { name: "DPM", value: relation.DPM, disable: false },
      { name: "RDT", value: relation.RDT, disable: true }
    ]
  ];
  return dictionary;
};

const images = () => {
  return (
    <Grid style={{ display: "flex", flexDirection: "column" }}>
      <h3 styles={{ height: "22px" }}>Configurações da roda</h3>

      <Grid justify="center" style={{ display: "flex", flexDirection: "row" }}>
        <img src={completeTire} alt="CompleteTire" height="250" />
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <img src={sideTire} alt="sideTire" height="100" />
          <img src={tire} alt="tire" height="75" />
        </Grid>
      </Grid>
      <Grid style={{ marginTop: "50px" }}>
        <h3 styles={{ height: "22px" }}>Configurações das polias</h3>

        <img src={VBelt} alt="VBelt" height="200" />
      </Grid>
    </Grid>
  );
};

const generatorVariables = values => {
  const newVariables = {};
  const valueRDT = (values.RSM * values.DPO) / values.DPM;
  if (valueRDT > validNumber) newVariables.RDT = valueRDT.toFixed(decimalPlace);

  const valueRDP =
    ((values.LST * values.RAL) / percentage) * double + values.DIA * inch;
  if (valueRDP > validNumber) newVariables.RDP = valueRDP.toFixed(decimalPlace);
  return newVariables;
};

class Relation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relation: {
        LST: "", // Largura da seção transversal
        RAL: "", // Relação altura/largura
        DIA: "", // Diametro do aro
        RDP: "", // Raio do pneu
        RSM: "", // Rotação sincrona do motor
        DPO: "", // Diametro da polia motora
        DPM: "", // Diametro da polia movida
        RDT: "" // Relação de transmissao
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { dispatch } = this.props;
    const { values } = nextProps.calibration;

    if (values !== undefined) {
      const newVariables = generatorVariables(values);
      dispatch(initialize("calibration", { ...values, ...newVariables }));

      return true;
    }
    return false;
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const relation = { [event.target.name]: value };
    this.setState(prevState => ({
      relation: { ...prevState.relation, ...relation }
    }));
  }

  render() {
    const { relation } = this.state;
    const { classes } = this.props;
    const statesTire = tireDictionary(relation);
    const statesVbelt = vbeltDictionary(relation);
    return (
      <Grid
        container
        xs={12}
        item
        justify="center"
        style={{ marginTop: "10px" }}
      >
        <Grid alignItems="center" justify="center" container xs={10}>
          <Grid item xs />
          <Grid container item justify="center" xs={6}>
            {images()}
          </Grid>
          <Grid container item alignItems="flex-start" justify="center" xs={6}>
            <form className={classes.container}>
              <Grid container item alignItems="center" justify="center" xs={12}>
                <h2 styles={{ height: "22px" }}>Pneu</h2>
                {tireFields(statesTire, classes, this.handleChange)}
              </Grid>

              <Grid
                container
                item
                alignItems="center"
                justify="center"
                xs={12}
                style={{ marginTop: "100px" }}
              >
                <h2 styles={{ height: "22px" }}>Velocidade máxima</h2>
                {tireFields(statesVbelt, classes, this.handleChange)}
              </Grid>
            </form>
          </Grid>
          <Grid item xs />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    calibration: state.form.calibration
  };
}

Relation.defaultProps = {
  calibration: { values: {} }
};

Relation.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
  calibration: PropTypes.objectOf(PropTypes.string)
};

const RelationForm = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(Relation);

export default connect(mapStateToProps)(withStyles(styles)(RelationForm));
