const validNumber = 0;
const decimalPlace = 4;
const maximumVoltage = 5000;
const megaByte = 1023;

const frequencySubtractionFactor = 826;
const frequencyDivisionFactor = 15;
const minutes = 60;

const tireDivisionFactor = 100000;
const tireDivision = 2;
const tireMultiplication = 0.0254;

const completeTurn = tireDivision * Math.PI;
const conversionSpeedFactor = 3.6;
const hoursToMiliseconds = 3600000;
const serialReadRate = 0.01;
const decimalToPercentage = 100;

export const base10 = 10;

export const linearEquation = (x, a, b) => {
  return parseFloat(a) * parseFloat(x) + parseFloat(b);
};

export const convertDigitalToAnalog = digitalSignal => {
  const analogSignal = (parseFloat(digitalSignal) * maximumVoltage) / megaByte;
  return analogSignal.toFixed(decimalPlace);
};

export const frequencyEquation = analogSignal => {
  const frequency =
    (parseFloat(analogSignal) - frequencySubtractionFactor) /
    frequencyDivisionFactor;
  return frequency.toFixed(decimalPlace);
};

export const rotationsPerMinuteEquation = frequency => {
  const rotationsPerMinute = parseFloat(frequency * minutes);
  return rotationsPerMinute.toFixed(decimalPlace);
};

export const rotationToSpeed = (rotationsPerMinute, tireRadius, unity) => {
  const speedMetersSecond =
    (parseFloat(rotationsPerMinute) * parseFloat(tireRadius)) / minutes;
  if (unity === "km/h") {
    return (speedMetersSecond * conversionSpeedFactor).toFixed(decimalPlace);
  }
  return speedMetersSecond.toFixed(decimalPlace);
};

export const travelledDistanceEquation = speedKmh => {
  const travelledDistance =
    (parseFloat(speedKmh) * serialReadRate) / hoursToMiliseconds;
  return travelledDistance.toFixed(decimalPlace);
};

export const tireRadiusEquation = (
  crossSectionalWidth,
  widthHeightRatio,
  arcDiameter
) => {
  const LST = parseFloat(crossSectionalWidth);
  const RAL = parseFloat(widthHeightRatio);
  const DIA = parseFloat(arcDiameter);

  if (LST > validNumber && RAL > validNumber && DIA > validNumber) {
    const tireRadius =
      (LST * RAL) / tireDivisionFactor +
      (tireMultiplication * DIA) / tireDivision;
    return tireRadius.toFixed(decimalPlace);
  }
  return undefined;
};

export const gearRatioEquation = (
  synchronousMotorRotation,
  diameterPowerPulley,
  diameterMovedPulley
) => {
  const RSM = parseFloat(synchronousMotorRotation);
  const DPO = parseFloat(diameterPowerPulley);
  const DPM = parseFloat(diameterMovedPulley);

  if (RSM > validNumber && DPO > validNumber && DPM > validNumber) {
    const gearRatio = (RSM * DPO) / DPM;
    return gearRatio.toFixed(decimalPlace);
  }
  return undefined;
};

export const topSpeedEquation = (tireRadius, gearRatio) => {
  const RDP = parseFloat(tireRadius);
  const RDT = parseFloat(gearRatio);

  const topSpeed = (RDP * conversionSpeedFactor * completeTurn * RDT) / minutes;
  return topSpeed.toFixed(decimalPlace);
};

export const dutyCycleEquation = (currentSpeed, maximumSpeed) => {
  if (maximumSpeed > validNumber && currentSpeed > validNumber) {
    const dutyCycle =
      (parseFloat(currentSpeed) / parseFloat(maximumSpeed)) *
      decimalToPercentage;
    return dutyCycle.toFixed(decimalPlace);
  }
  return validNumber;
};
