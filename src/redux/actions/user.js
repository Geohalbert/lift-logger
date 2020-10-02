// types
export const SET_USER = "SET_USER";
export const SIGN_OUT = "SIGN_OUT";

// actions
export const setUser = userObj => {
  return {
    type: SET_USER,
    payload: userObj
  };
};

export const logOut = () => {
  return {
    type: SIGN_OUT
  };
};
