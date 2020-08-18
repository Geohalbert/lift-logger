import { createStore, combineReducers } from "redux";

import workoutsReducer from "../reducers/WorkoutsReducer";
import authReducer from "../reducers/authReducer";
const store = createStore(
  combineReducers({
    workouts: workoutsReducer,
    auth: authReducer
  })
);

export default store;
