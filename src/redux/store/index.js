import { createStore, combineReducers } from "redux";

import authReducer from "../reducers/authReducer";
import exercisesReducer from "../reducers/ExercisesReducer";
import setsReducer from "../reducers/SetsReducer";
import workoutsReducer from "../reducers/WorkoutsReducer";

const store = createStore(
  combineReducers({
    auth: authReducer,
    exercises: exercisesReducer,
    sets: setsReducer,
    workouts: workoutsReducer
  })
);

export default store;
