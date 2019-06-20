import React from "react";
import PropTypes from "prop-types";
import { reduxForm, change } from "redux-form";
import { connect } from "react-redux";
import { withStyles, Grid } from "@material-ui/core";
import styles from "../components/Styles";
import { field } from "../components/ComponentsForm";
import completeTire from "../img/completeTire.png";
import sideTire from "../img/sideTire.png";
import tire from "../img/tire.png";
import VBelt from "../img/Vbelt.png";
import { tireRadiusEquation, gearRatioEquation } from "../utils/Equations";

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
      nameLabel = "Raio do pneu (m)";
      break;
    default:
      break;
  }
  return nameLabel;
};

const greaterThanZero = value =>
  value && parseInt(value, 10) <= validNumber
    ? "Deve ser maior que 0"
    : undefined;

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
      {
        name: "LST",
        value: relation.LST,
        disable: false,
        validate: [greaterThanZero]
      },
      {
        name: "RAL",
        value: relation.RAL,
        disable: false,
        validate: [greaterThanZero]
      }
    ],
    [
      {
        name: "DIA",
        value: relation.DIA,
        disable: false,
        validate: [greaterThanZero]
      },
      {
        name: "RDP",
        value: relation.RDP,
        disable: true,
        validate: [greaterThanZero]
      }
    ]
  ];
  return dictionary;
};

const vbeltDictionary = relation => {
  const dictionary = [
    [
      {
        name: "DPO",
        value: relation.DPO,
        disable: false,
        validate: [greaterThanZero]
      },
      {
        name: "RSM",
        value: relation.RSM,
        disable: false,
        validate: [greaterThanZero]
      }
    ],
    [
      {
        name: "DPM",
        value: relation.DPM,
        disable: false,
        validate: [greaterThanZero]
      },
      {
        name: "RDT",
        value: relation.RDT,
        disable: true,
        validate: [greaterThanZero]
      }
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
    const gearRatio = gearRatioEquation(values.RSM, values.DPO, values.DPM);
    const tireRadius = tireRadiusEquation(values.LST, values.RAL, values.DIA);

    if (gearRatio || tireRadius) {
      dispatch(change("calibration", "RDT", gearRatio));
      dispatch(change("calibration", "RDP", tireRadius));

      return true;
    }

    return false;
  }

  handleChange(event) {
    const { target } = event;
    const { value } = target;
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
