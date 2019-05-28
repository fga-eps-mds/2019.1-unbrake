export const addFile = filename => {
  return {
    type: "ADD_FILE",
    filename
  };
};
export default { addFile };
