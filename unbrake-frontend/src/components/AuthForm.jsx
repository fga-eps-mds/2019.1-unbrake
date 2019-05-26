import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

const renderSubmit = (label, classes, submitting) => {
  return (
    <Grid container item xs={12} alignItems="center" justify="center">
      <Grid item xs={3} className={classes.grid}>
        <Button
          color="secondary"
          fullWidth
          variant="contained"
          type="submit"
          disabled={submitting}
        >
          {label}
        </Button>
      </Grid>
    </Grid>
  );
};

const propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};
const padding = 10;

const authStyles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * padding,
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "600px"
  },
  field: {
    paddingTop: theme.spacing.unit * padding,
    paddingBottom: theme.spacing.unit * padding
  },
  grid: {
    padding: "5px"
  }
});

export { renderSubmit, propTypes, authStyles };
