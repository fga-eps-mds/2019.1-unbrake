import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Snackbar from "@material-ui/core/Snackbar";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import { withStyles } from "@material-ui/core/styles";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import classNames from "classnames";
import PropTypes from "prop-types";
import * as Actions from "../actions/AuthActions";

const styles1 = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit
  }
});

function MySnackbarContent(props) {
  const { classes, className, message, variant } = props;
  //   const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          {message}
        </span>
      }
      /*
       *action={[
       * <IconButton
       * key="close"
       * aria-label="Close"
       * color="inherit"
       * className={classes.close}
       * onClick={onClose}
       * >
       * <CloseIcon className={classes.icon} />
       * </IconButton>
       * ]}
       *{...other}
       */
    />
  );
}
const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, message: "", level: "" };
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { message, variante } = newProps.newNotification;
    return this.setState({ open: true, message, level: variante });
  }

  closeNotification() {
    this.setState({ open: false });
  }

  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const { open, level, message } = this.state;
    const { handleClose } = this;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <MySnackbarContentWrapper
          onClose={handleClose}
          variant={level}
          className={classes.margin}
          message={message}
        />
      </Snackbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    notification: state.notification
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

MySnackbarContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  className: PropTypes.objectOf(PropTypes.string).isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired
};

NotificationContainer.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles2)(NotificationContainer));
