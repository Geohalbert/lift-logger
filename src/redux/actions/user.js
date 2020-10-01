// types
export const SET_USER = "SET_USER";
export const LOGOUT = "LOGOUT";

// actions
export const setUser = userObj => {
  return {
    type: SET_USER,
    payload: userObj
  };
};

export const logOut = () => {
  return {
    type: LOGOUT
  };
};
