// define types

export const UPDATE_SET_NAME = "UPDATE_SET_NAME";
export const ADD_SET = "ADD_SET";
export const GET_SET = "GET_SET";
export const LOAD_SETS_FROM_SERVER = "LOAD_SETS_FROM_SERVER";
export const DELETE_SET = "DELETE_SET";
export const UPDATE_SET = "UPDATE_SET";
export const UPDATE_SET_IMAGE = "UPDATE_SET_IMAGE";
export const MARK_SET_AS_COMPLETE = "MARK_SET_AS_COMPLETE";
export const MARK_SET_AS_INCOMPLETE = "MARK_SET_AS_INCOMPLETE";

export const updateSetName = name => {
  return {
    type: UPDATE_SET_NAME,
    payload: name
  };
};

export const getSet = setId => {
  return { type: GET_SET, payload: setId };
};

export const loadSets = sets => {
  return {
    type: LOAD_SETS_FROM_SERVER,
    payload: sets
  };
};

export const addSet = set => {
  return {
    type: ADD_SET,
    payload: set
  };
};

export const removeSet = set => {
  return {
    type: DELETE_SET,
    payload: set
  };
};

export const updateSet = set => {
  return {
    type: UPDATE_SET,
    payload: set
  };
};

export const updateSetImage = set => {
  return {
    type: UPDATE_SET,
    payload: set
  };
};

export const markSetAsComplete = setId => {
  return {
    type: MARK_SET_AS_COMPLETE,
    payload: setId
  };
};

export const markSetAsIncomplete = setId => {
  return {
    type: MARK_SET_AS_INCOMPLETE,
    payload: setId
  };
};
