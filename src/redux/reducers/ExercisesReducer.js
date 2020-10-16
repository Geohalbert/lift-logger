const initialState = {
  exercises: [],
  exercisesIncomplete: [],
  exercisesComplete: [],
  isLoadingExercises: false,
  image: null
};

const exercisesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_EXERCISES_FROM_SERVER":
      return {
        ...state,
        exercises: action.payload,
        exercisesIncomplete: action.payload.filter(
          exercise => !exercise.complete
        ),
        exercisesComplete: action.payload.filter(exercise => exercise.complete)
      };
    case "ADD_EXERCISE":
      return {
        ...state,
        exercises: [action.payload, ...state.exercises],
        exercisesIncomplete: [action.payload, ...state.exercisesIncomplete]
      };
    case "UPDATE_EXERCISE":
      let updatedExercise = action.payload;

      //clone the current state
      let clone = state.exercises;
      let index = clone.findIndex(obj => obj.key === updatedExercise.key);

      //if the exercise is in the array, update the exercise
      if (index !== -1) clone[index] = action.payload;
      return {
        ...state,
        exercises: clone
      };
    case "MARK_EXERCISE_AS_COMPLETE":
      return {
        ...state,
        exercises: state.exercises.map(exercise => {
          if (exercise.key == action.payload.key) {
            return {
              ...exercise,
              complete: true,
              updatedAt: new Date().getTime()
            };
          }
          return exercise;
        }),
        exercisesComplete: [...state.exercisesComplete, action.payload],
        exercisesIncomplete: state.exercisesIncomplete.filter(
          exercise => exercise.key !== action.payload.key
        )
      };
    case "TOGGLE_IS_LOADING_EXERCISES":
      return {
        ...state,
        isLoadingExercises: action.payload
      };
    case "MARK_EXERCISE_AS_INCOMPLETE":
      return {
        ...state,
        exercises: state.exercises.map(exercise => {
          if (exercise.key == action.payload.key) {
            return {
              ...exercise,
              complete: false,
              updatedAt: new Date().getTime()
            };
          }
          return exercise;
        }),
        exercisesComplete: state.exercisesComplete.filter(
          exercise => exercise.key !== action.payload.key
        ),
        exercisesIncomplete: [...state.exercisesIncomplete, action.payload]
      };
    case "DELETE_EXERCISE":
      let allExercises = JSON.parse(JSON.stringify(state.exercises));

      //check if exercise exists
      let ind = allExercises.findIndex(obj => obj.key === action.payload.key);

      //if the exercise is in the array, remove the qexercise
      if (ind !== -1) allExercises.splice(ind, 1);

      return {
        ...state,
        exercises: allExercises,
        exercisesComplete: state.exercisesComplete.filter(
          exercise => exercise.key !== action.payload.key
        ),
        exercisesIncomplete: state.exercisesIncomplete.filter(
          exercise => exercise.key !== action.payload.key
        )
      };
    case "UPDATE_EXERCISE_IMAGE":
      return {
        ...state,
        exercises: state.exercises.map(exercise => {
          if (exercise.name == action.payload.name) {
            return {
              ...exercise,
              image: action.payload.uri,
              updatedAt: new Date().getTime()
            };
          }
          return exercise;
        }),
        exercisesIncomplete: state.exercisesIncomplete.map(exercise => {
          if (exercise.name == action.payload.name) {
            return {
              ...exercise,
              image: action.payload.uri,
              updatedAt: new Date().getTime()
            };
          }
          return exercise;
        }),
        exercisesComplete: state.exercisesComplete.map(exercise => {
          if (exercise.name == action.payload.name) {
            return {
              ...exercise,
              image: action.payload.uri,
              updatedAt: new Date().getTime()
            };
          }
          return exercise;
        })
      };
    default:
      return state;
  }
};

export default exercisesReducer;
