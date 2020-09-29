import firebase from "../../config/firebase";

// define types

export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const SET_USER = "SET_USER";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const REGISTER = "REGISTER";

// actions

export const updateEmail = email => {
  return {
    type: UPDATE_EMAIL,
    payload: email
  };
};

export const updatePassword = password => {
  return {
    type: UPDATE_PASSWORD,
    payload: password
  };
};
export const setUser = userObj => {
  return {
    type: SET_USER,
    payload: userObj
  };
};

export const logOut = () => {
  return {
    type: "LOGOUT"
  };
};
export const login = async (email, password) => {
  try {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    if (response) {
      setIsLoading(false);
      setUser(response.user);
    }
  } catch (e) {
    console.log(e);
  }
};

export const getUser = uid => {
  return async (dispatch, getState) => {
    try {
      const user = await db
        .collection("users")
        .doc(uid)
        .get();

      dispatch({ type: LOGIN, payload: user.data() });
    } catch (e) {
      console.log(e);
    }
  };
};

export const register = async userObj => {
  try {
    const { email, password } = userObj;
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    if (response) {
      setIsLoading(false);
      setUser(response.user);
    }
  } catch (e) {
    console.log(e);
  }
};
