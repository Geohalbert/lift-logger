import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import workoutsReducer from "./workoutsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  workouts: workoutsReducer
});

export default rootReducer;
