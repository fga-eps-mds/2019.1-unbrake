import { VERIFYING_AUTH } from "./Types";

export const verifyingAuth = value => {
  return {
    type: VERIFYING_AUTH,
    payload: value
  };
};
export default { verifyingAuth };
