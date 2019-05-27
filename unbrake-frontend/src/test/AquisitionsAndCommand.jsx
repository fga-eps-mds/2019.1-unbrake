import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { withStyles, Grid } from "@material-ui/core";
import styles from "../components/Styles";
import RealTimeChart from "../components/RealTimeChart";
import { field } from "../components/ComponentsForm";

const label = name => {
  let nameLabel = "";
  switch (name) {
    case "Tc1":
      nameLabel = "Temperatura 1 (ºC)";
      break;
    case "Tc2":
      nameLabel = "Temperatura 2(ºC)";
      break;
    case "Fkgf1":
      nameLabel = "Força 1 (kfg)";
      break;
    case "Fkgf2":
      nameLabel = "Força 2 (kfg)";
      break;
    case "Rrpm":
      nameLabel = "Rotação (RPM)";
      break;
    case "Vkmg":
      nameLabel = "Velocidade (km/h)";
      break;
    case "DPm":
      nameLabel = "Distância percorrida (m)";
      break;
    case "Vc":
      nameLabel = "Velocidade (comando)";
      break;
    case "Pc":
      nameLabel = "Pressão (comando)";
      break;
    default:
      nameLabel = "";
      break;
  }
  return nameLabel;
};

const renderField = (states, classes, handleChange) => {
  const type = states;
  type.label = label(states.name);
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

const allFields = (states, classes, handleChange) => {
  const fields = states.map(value => {
    return (
      <Grid
        alignItems="center"
        justify="center"
        container
        item
        xs={12}
        key={`fields ${value[1].name}`}
      >
        {rowField(value, classes, handleChange)}
      </Grid>
    );
  });
  return fields;
};

/*
 * const allCheckbox = (selectsControl, classes, handleChange) => {
 *   const checks = selectsControl.map(value => {
 *     const type = value;
 *     type.label = label(value.name);
 *     return (
 *       <Grid
 *         key={`checkbox ${value.name}`}
 *         alignItems="center"
 *         justify="center"
 *         container
 *         item
 *         xs={12}
 *         className={classes.checboxSize}
 *       >
 *         {checkbox(type, handleChange)}
 *       </Grid>
 *     );
 *   });
 *   return checks;
 * };
 */

const renderDictionary = aquisition => {
  const directionary = [
    [
      { name: "Tc1", value: aquisition.Tc1, disable: true },
      { name: "Tc2", value: aquisition.Tc2, disable: true }
    ],
    [
      { name: "Fkgf1", value: aquisition.Fkgf1, disable: true },
      { name: "Fkgf2", value: aquisition.Fkgf2, disable: true }
    ],
    [
      { name: "Rrpm", value: aquisition.Rrpm, disable: true },
      { name: "Vkmg", value: aquisition.Vkmg, disable: true }
    ],
    [
      { name: "DPm", value: aquisition.DPm, disable: true },
      { name: "Vc", value: aquisition.Vc, disable: true }
    ],
    [
      { name: "Pc", value: aquisition.Pc, disable: true },
      [
        { name: "Out1", value: aquisition.Out1, disable: true },
        { name: "In1", value: aquisition.In1, disable: true },
        { name: "In2", value: aquisition.In2, disable: true },
        { name: "In3", value: aquisition.In3, disable: true }
      ]
    ]
  ];
  return directionary;
};

class Force extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const force = { [event.target.name]: value };
    this.setState(prevState => ({
      force: { ...prevState.force, ...force }
    }));
  }

  render() {
    const { aquisition } = this.state;
    const { classes } = this.props;
    const states = renderDictionary(aquisition);
    /*
     * const {
     *   Tc1,
     *   Tc2,
     *   Fkgf1,
     *   Fkgf2,
     *   Rrpm,
     *   Vkmg,
     *   DPm,
     *   Vc,
     *   Pc,
     *   Out1,
     *   In1,
     *   In2,
     *   In3
     * } = aquisitions;
     * const states = [
     *   [
     *     { name: "Tc1", value: Tc1, disable: true },
     *     { name: "Tc2", value: Tc2, disable: true }
     *   ],
     *   [
     *     { name: "Fkgf1", value: Fkgf1, disable: true },
     *     { name: "Fkgf2", value: Fkgf2, disable: true }
     *   ],
     *   [
     *     { name: "Rrpm", value: Rrpm, disable: true },
     *     { name: "Vkmg", value: Vkmg, disable: true }
     *   ],
     *   [
     *     { name: "DPm", value: DPm, disable: true },
     *     { name: "Vc", value: Vc, disable: true }
     *   ],
     *   [
     *     { name: "Pc", value: Pc, disable: true },
     *     [
     *       { name: "Out1", value: Out1, disable: true },
     *       { name: "In1", value: In1, disable: true },
     *       { name: "In2", value: In2, disable: true },
     *       { name: "In3", value: In3, disable: true }
     *     ]
     *   ]
     * ];
     */
    return (
      <Grid
        container
        xs={12}
        item
        justify="center"
        style={{ marginTop: "70px" }}
      >
        <Grid alignItems="center" justify="center" container>
          <form className={classes.container}>
            <Grid item xs />
            <Grid container item justify="center" xs={6}>
              {allFields(states, classes, this.handleChange)}
            </Grid>
            <Grid
              container
              item
              alignItems="flex-start"
              justify="center"
              xs={3}
            >
              <Grid container item alignItems="center" justify="center" xs={12}>
                {/* {allCheckbox(selectsControl, classes, this.handleChange)} */}
              </Grid>
            </Grid>
            <Grid item xs />
          </form>
        </Grid>

        <Grid
          item
          container
          xs={9}
          justify="center"
          className={classes.gridGraphic}
        >
          <RealTimeChart />
        </Grid>
      </Grid>
    );
  }
}

Force.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

const ForceForm = reduxForm({
  form: "calibration"
})(Force);

export default withStyles(styles)(ForceForm);
