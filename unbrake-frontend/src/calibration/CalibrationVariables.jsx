export const variablesTemperatureOne = [
  { front: "CHT1", back: "acquisitionChanel" },
  { front: "FCT1", back: "conversionFactor" },
  { front: "OFT1", back: "temperatureOffset" }
];

export const variablesTemperatureTwo = [
  { front: "CHT2", back: "acquisitionChanel" },
  { front: "FCT2", back: "conversionFactor" },
  { front: "OFT2", back: "temperatureOffset" }
];

export const variablesForceOne = [
  { front: "CHF1", back: "acquisitionChanel" },
  { front: "FCF1", back: "conversionFactor" },
  { front: "OFF1", back: "forceOffset" }
];

export const variablesForceTwo = [
  { front: "CHF2", back: "acquisitionChanel" },
  { front: "FCF2", back: "conversionFactor" },
  { front: "OFF2", back: "forceOffset" }
];

export const variablesSpeed = [
  { front: "CHR1", back: "acquisitionChanel" },
  { front: "RAP", back: "tireRadius" }
];

export const variablesVibration = [
  { front: "CHVB", back: "acquisitionChanel" },
  { front: "FCVB", back: "conversionFactor" },
  { front: "OFVB", back: "vibrationOffset" }
];

export const variablesCommand = [
  { front: "CHVC", back: "commandChanelSpeed" },
  { front: "CUVC", back: "actualSpeed" },
  { front: "MAVC", back: "maxSpeed" },
  { front: "CHPC", back: "chanelCommandPression" },
  { front: "CUPC", back: "actualPression" },
  { front: "MAPC", back: "maxPression" }
];

export const variablesRelations = [
  { front: "LST", back: "transversalSelectionWidth" },
  { front: "RAL", back: "heigthWidthRelation" },
  { front: "DIA", back: "rimDiameter" },
  { front: "RSM", back: "syncMotorRodation" },
  { front: "DPO", back: "sheaveMotorDiameter" },
  { front: "DPM", back: "sheaveMoveDiameter" }
];

export const allVariablesCalib = [
  variablesTemperatureOne,
  variablesTemperatureTwo,
  variablesForceOne,
  variablesForceTwo,
  variablesSpeed,
  variablesVibration,
  variablesCommand,
  variablesRelations
];

export const createAllCalibrations = [
  {
    mutation: "createTemperature",
    response: "temperature",
    variablesResponse: "id",
    name: "firstTemperature"
  },
  {
    mutation: "createTemperature",
    response: "temperature",
    variablesResponse: "id",
    name: "secondTemperature"
  },
  {
    mutation: "createForce",
    response: "force",
    variablesResponse: "id",
    name: "firstForce"
  },
  {
    mutation: "createForce",
    response: "force",
    variablesResponse: "id",
    name: "secondForce"
  },
  {
    mutation: "createSpeed",
    response: "speed",
    variablesResponse: "id",
    name: "speed"
  },
  {
    mutation: "createVibration",
    response: "vibration",
    variablesResponse: "id",
    name: "vibration"
  },
  {
    mutation: "createCommand",
    response: "command",
    variablesResponse: "id",
    name: "command"
  },
  {
    mutation: "createRelations",
    response: "relations",
    variablesResponse: "id",
    name: "relations"
  }
];

export const variablesCalib = [
  { front: "name", back: "name" },
  { front: "firstTemperature", back: "idFirstTemperature" },
  { front: "secondTemperature", back: "idSecondTemperature" },
  { front: "firstForce", back: "idFirstForce" },
  { front: "secondForce", back: "idSecondForce" },
  { front: "speed", back: "idSpeed" },
  { front: "vibration", back: "idVibration" },
  { front: "command", back: "idCommand" },
  { front: "relations", back: "idRelations" }
];

export const createCalibration = {
  mutation: "createCalibration",
  response: "calibration",
  variablesResponse: "id"
};
