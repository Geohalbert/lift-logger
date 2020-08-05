import {
  LOGIN,
  REGISTER,
  UPDATE_EMAIL,
  UPDATE_PASSWORD
} from "../actions/user";

const user = (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case REGISTER:
      return action.payload;
    case UPDATE_EMAIL:
      return { ...state, email: action.payload };
    case UPDATE_PASSWORD:
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

export default user;