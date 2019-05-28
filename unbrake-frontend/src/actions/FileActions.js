export const addFile = filename => {
  return {
    type: 'ADD_FILE',
    filename: filename
  };
};
export default { addFile };
