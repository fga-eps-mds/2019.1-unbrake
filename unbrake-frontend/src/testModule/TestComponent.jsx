import React from "react";
import { Grid } from "@material-ui/core";
import AquisitionsAndCommand from "./AquisitionsAndCommand";
import TestData from "./TestData";

const Test = () => {
  return (
    <Grid
      container
      xs={12}
      item
      // justify="center"
      style={{ marginTop: "80px" }}
    >
      <Grid container item justify="center" xs={6}>
        <AquisitionsAndCommand />
      </Grid>
      <Grid container item justify="center" xs={6}>
        <TestData />
      </Grid>
    </Grid>
  );
};

export default Test;
