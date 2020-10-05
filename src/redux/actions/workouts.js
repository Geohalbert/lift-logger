// define types

export const UPDATE_NAME = "UPDATE_NAME";
export const UPDATE_COMPLETE = "UPDATE_COMPLETE";
export const ADD_WORKOUT = "ADD_WORKOUT";
export const GET_WORKOUT = "GET_WORKOUT";
export const LOAD_WORKOUTS_FROM_SERVER = "LOAD_WORKOUTS_FROM_SERVER";
export const DELETE_WORKOUT = "DELETE_WORKOUT";
export const UPDATE_WORKOUT = "UPDATE_WORKOUT";
export const MARK_WORKOUT_AS_COMPLETE = "MARK_WORKOUT_AS_COMPLETE";
export const MARK_WORKOUT_AS_INCOMPLETE = "MARK_WORKOUT_AS_INCOMPLETE";

export const updateName = name => {
  return {
    type: UPDATE_NAME,
    payload: name
  };
};

export const updateComplete = complete => {
  return {
    type: UPDATE_COMPLETE,
    payload: complete
  };
};

export const getWorkout = workoutId => {
  return { type: GET_WORKOUT, payload: workoutId };
};

export const loadWorkouts = workouts => {
  return {
    type: LOAD_WORKOUTS_FROM_SERVER,
    payload: workouts
  };
};

export const addWorkout = workout => {
  return {
    type: ADD_WORKOUT,
    payload: workout
  };
};

export const removeWorkout = workout => {
  return {
    type: DELETE_WORKOUT,
    payload: workout
  };
};

export const updateWorkout = workout => {
  return {
    type: UPDATE_WORKOUT,
    payload: workout
  };
};

export const markWorkoutAsComplete = workoutId => {
  return {
    type: MARK_WORKOUT_AS_COMPLETE,
    payload: workoutId
  };
};

export const markWorkoutAsInomplete = workoutId => {
  return {
    type: MARK_WORKOUT_AS_INCOMPLETE,
    payload: workoutId
  };
};
