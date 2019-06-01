const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  grid: {
    padding: "5px"
  },
  gridButton: {
    padding: "15px"
  },
  title: {
    padding: "5px"
  },
  input: {
    display: "none"
  },
  rootUploadFile: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400
  },
  input_file_name: {
    marginLeft: 8,
    flex: 1
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200
  },
  form: {
    padding: "30px"
  },
  configuration: {
    marginTop: "80px"
  }
});

export default styles;
