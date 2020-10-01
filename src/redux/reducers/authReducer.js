import firebase from "../../config/firebase";

const initialState = {
  isLoading: true,
  isSignedIn: false,
  currentUser: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        isSignedIn: true,
        currentUser: action.payload,
        isLoading: false
      };

    case "LOGOUT":
      return {
        ...state,
        isSignedIn: false,
        currentUser: null,
        isLoading: false
      };

    case "LOGIN":
      try {
        const response = firebase
          .auth()
          .signInWithEmailAndPassword(
            action.payload.email,
            action.payload.password
          );
        if (response) {
          return {
            ...state,
            isSignedIn: true,
            currentUser: response,
            isLoading: false
          };
        }
      } catch (e) {
        console.log(e);
        return { ...state };
      }

    case "REGISTER":
      try {
        const response = firebase
          .auth()
          .createUserWithEmailAndPassword(
            action.payload.email,
            action.payload.password
          );
        if (response) {
          return {
            ...state,
            isSignedIn: true,
            currentUser: response,
            isLoading: false
          };
        }
      } catch (e) {
        console.log(e);
        return { ...state };
      }

    default:
      return state;
  }
};

export default authReducer;
