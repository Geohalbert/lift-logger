import { combineReducers } from "redux";
import user from "./user";
import workouts from "./workouts";

const rootReducer = combineReducers({
  user: user,
  workouts: workouts
});

export default rootReducer;
