const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  grid: {
    padding: "5px"
  },
  gridButton: {
    paddingLeft: theme.spacing.unit + theme.spacing.unit
  },
  title: {
    padding: "5px"
  },
  fileInput: {
    display: "flex",
    flexWrap: "wrap",
    paddingTop: "2em",
    position: "relative"
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
  file_name: {
    maxWidth: 2
  }
});

export default styles;
