// define types

export const UPDATE_EXERCISE_NAME = "UPDATE_EXERCISE_NAME";
export const ADD_EXERCISE = "ADD_EXERCISE";
export const GET_EXERCISE = "GET_EXERCISE";
export const LOAD_EXERCISES_FROM_SERVER = "LOAD_EXERCISES_FROM_SERVER";
export const DELETE_EXERCISE = "DELETE_EXERCISE";
export const UPDATE_EXERCISE = "UPDATE_EXERCISE";
export const UPDATE_EXERCISE_IMAGE = "UPDATE_EXERCISE_IMAGE";
export const MARK_EXERCISE_AS_COMPLETE = "MARK_EXERCISE_AS_COMPLETE";
export const MARK_EXERCISE_AS_INCOMPLETE = "MARK_EXERCISE_AS_INCOMPLETE";

export const updateExerciseName = name => {
  return {
    type: UPDATE_EXERCISE_NAME,
    payload: name
  };
};

export const getExercise = exerciseId => {
  return { type: GET_EXERCISE, payload: exerciseId };
};

export const loadExercises = exercises => {
  return {
    type: LOAD_EXERCISES_FROM_SERVER,
    payload: exercises
  };
};

export const addExercise = exercise => {
  return {
    type: ADD_EXERCISE,
    payload: exercise
  };
};

export const removeExercise = exercise => {
  return {
    type: DELETE_EXERCISE,
    payload: exercise
  };
};

export const updateExercise = exercise => {
  return {
    type: UPDATE_EXERCISE,
    payload: exercise
  };
};

export const updateExerciseImage = exercise => {
  return {
    type: UPDATE_EXERCISE,
    payload: exercise
  };
};

export const markExerciseAsComplete = exerciseId => {
  return {
    type: MARK_EXERCISE_AS_COMPLETE,
    payload: exerciseId
  };
};

export const markExerciseAsIncomplete = exerciseId => {
  return {
    type: MARK_EXERCISE_AS_INCOMPLETE,
    payload: exerciseId
  };
};
