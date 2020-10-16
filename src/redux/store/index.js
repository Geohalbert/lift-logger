import { createStore, combineReducers } from "redux";

import authReducer from "../reducers/authReducer";
import exercisesReducer from "../reducers/ExercisesReducer";
import workoutsReducer from "../reducers/WorkoutsReducer";

const store = createStore(
  combineReducers({
    auth: authReducer,
    exercises: exercisesReducer,
    workouts: workoutsReducer
  })
);

export default store;
