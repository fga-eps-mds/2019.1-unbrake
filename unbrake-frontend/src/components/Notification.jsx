import React from "react";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import { withStyles } from "@material-ui/core/styles";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import classNames from "classnames";
import PropTypes from "prop-types";
import { toggleMessage } from "../actions/NotificationActions";

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
    this.handleClose = this.handleClose.bind(this);
  }

  /*
   *componentWillReceiveProps(newProps) {
   *  const { message, variante } = newProps.newNotification;
   *  return this.setState({ open: true, message, level: variante });
   *}
   */

  closeNotification() {
    const { hideMessage } = this.props;
    hideMessage({ condition: false });
  }

  handleClose(event, reason) {
    const { hideMessage } = this.props;
    if (reason === "clickaway") {
      return;
    }
    hideMessage({ condition: false });
  }

  render() {
    const { classes, variante, message, condition } = this.props;
    const { handleClose } = this;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={condition}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <MySnackbarContentWrapper
          onClose={handleClose}
          variant={variante}
          className={classes.margin}
          message={message}
        />
      </Snackbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.notificationReducer.message,
    condition: state.notificationReducer.condition,
    variante: state.notificationReducer.variante
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideMessage: payload => dispatch(toggleMessage(payload))
  };
}

MySnackbarContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
};

NotificationContainer.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  message: PropTypes.string.isRequired,
  variante: PropTypes.string.isRequired,
  hideMessage: PropTypes.func.isRequired,
  condition: PropTypes.bool
};

NotificationContainer.defaultProps = {
  condition: false
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles2)(NotificationContainer));
