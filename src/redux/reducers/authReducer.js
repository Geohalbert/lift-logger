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

    case "SIGN_OUT":
      return {
        ...state,
        isSignedIn: false,
        currentUser: null,
        isLoading: false
      };

    default:
      return state;
  }
};

export default authReducer;
