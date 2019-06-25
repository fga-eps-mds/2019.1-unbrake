const percentageTransformer = 100;
const zero = 0;
const one = 1;
const ten = 10;
const minSeconds = 60;
const numberCaracters = -2;

const timeTES = (states, handleChange) => {
  const { waitingStartTime, configuration } = states;

  if (waitingStartTime === zero) {
    handleChange("waitingStartTime", Date.now());
    return;
  }

  const centiseconds = Math.floor((Date.now() - waitingStartTime) / ten);
  const UWT = configuration.UWT * percentageTransformer;

  if (centiseconds < UWT) {
    handleChange("TES", (one - centiseconds / UWT) * percentageTransformer);
  } else {
    handleChange("TES", zero);
    handleChange("waiting", false);
  }
};

export const calculeTES = (states, handleChange) => {
  const { dutyCycle, waiting, waitingStartTime, state } = states;

  if (state.TEI !== zero) handleChange("TEI", zero);

  if (state.TEC !== zero) handleChange("TEC", zero);

  if (!waiting) {
    if (waitingStartTime !== zero) handleChange("waitingStartTime", zero);

    handleChange("TES", dutyCycle);

    if (dutyCycle >= percentageTransformer - one) {
      handleChange("waiting", true);
    }
  } else {
    timeTES(states, handleChange);
  }
};

const setTEI = (states, handleChange) => {
  const { dutyCycle, waitingStartTime, configuration } = states;

  if (waitingStartTime !== zero) handleChange("waitingStartTime", zero);

  const convertionDuty = percentageTransformer - dutyCycle;
  const minVelocity = percentageTransformer - configuration.LSL;
  const valueProgress = (convertionDuty / minVelocity) * percentageTransformer;

  handleChange("TEI", valueProgress);

  if (valueProgress >= percentageTransformer - one) {
    handleChange("waiting", true);
  }
};

const timeTEI = (states, handleChange) => {
  const { waitingStartTime, configuration } = states;

  if (waitingStartTime === zero) {
    handleChange("waitingStartTime", Date.now());
    return;
  }

  const centiseconds = Math.floor((Date.now() - waitingStartTime) / ten);
  const LSL = configuration.LSL * percentageTransformer;

  if (centiseconds < LSL) {
    handleChange("TES", (one - centiseconds / LSL) * percentageTransformer);
  } else {
    handleChange("TES", zero);
    handleChange("waiting", false);
  }
};

export const calculeTEI = (states, handleChange) => {
  const { waiting, state } = states;

  if (state.TES !== zero) handleChange("TES", zero);

  if (state.TEC !== zero) handleChange("TEC", zero);

  if (!waiting) {
    setTEI(states, handleChange);
  } else {
    timeTEI(states, handleChange);
  }
};

const timeTEC = (states, handleChange) => {
  const { waitingStartTime, configuration } = states;

  const time = Date.now() - waitingStartTime;
  const centiseconds = Math.floor(time / ten);

  const TBS = configuration.TBS * percentageTransformer;

  if (centiseconds < TBS) {
    handleChange("TEC", (one - centiseconds / TBS) * percentageTransformer);
  } else {
    handleChange("TEC", zero);
    handleChange("waiting", false);
  }
};

export const calculeTEC = (states, handleChange) => {
  const { waitingStartTime, state } = states;

  if (state.TES !== zero) handleChange("TES", zero);

  if (state.TEI !== zero) handleChange("TEI", zero);

  if (waitingStartTime === zero) {
    handleChange("waitingStartTime", Date.now());
    handleChange("TEC", percentageTransformer);
    return;
  }

  timeTEC(states, handleChange);
};

const calculeDuration = (msg, handleChange) => {
  const seconds = `0${Math.floor(msg.asString() % minSeconds)}`.slice(
    numberCaracters
  );
  const minutes = `0${Math.floor(
    (msg.asString() / minSeconds) % minSeconds
  )}`.slice(numberCaracters);
  const hours = `0${Math.floor(
    ((msg.asString() / (minSeconds * minSeconds)) % minSeconds) % minSeconds
  )}`.slice(numberCaracters);
  handleChange("DTE", `${hours} : ${minutes} : ${seconds}`);
};

const setIsAvailable = (msg, handleChange) => {
  if (msg.asString() === true) {
    this.setState({ experimentDuration: msg.asString() });
    if (msg.asString() === true) {
      handleChange("TES", zero);
      handleChange("TEI", zero);
      handleChange("TEC", zero);
    }
  }
};

export const resolveMsg = (msg, handleChange) => {
  if (msg.channel === "unbrake/galpao/currentSnub/") {
    handleChange("SA", msg.asString());
  } else if (msg.channel === "unbrake/galpao/snubState/") {
    handleChange("snubState", msg.asString());
  } else if (msg.channel === "unbrake/galpao/dutyCycle/") {
    handleChange("dutyCycle", msg.asString());
  } else if (msg.channel === "unbrake/galpao/experimentDuration/") {
    calculeDuration(msg, handleChange);
  } else if (msg.channel === "unbrake/galpao/isAvailable/") {
    setIsAvailable(msg, handleChange);
  }
};
