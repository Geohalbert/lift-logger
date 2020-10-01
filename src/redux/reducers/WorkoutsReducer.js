const initialState = {
  workouts: [],
  workoutsIncomplete: [],
  workoutsComplete: [],
  isLoadingWorkouts: false,
  image: null
};

const workoutsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_WORKOUTS_FROM_SERVER":
      return {
        ...state,
        workouts: action.payload,
        workoutsIncomplete: action.payload.filter(workout => !workout.complete),
        workoutsComplete: action.payload.filter(workout => workout.complete)
      };
    case "ADD_WORKOUT":
      return {
        ...state,
        workouts: [action.payload, ...state.workouts],
        workoutsIncomplete: [action.payload, ...state.workoutsIncomplete]
      };
    case "MARK_WORKOUT_AS_COMPLETE":
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.name == action.payload.name) {
            return {
              ...workout,
              complete: true,
              updatedAt: new Date().getTime()
            };
          }
          return workout;
        }),
        workoutsComplete: [...state.workoutsComplete, action.payload],
        workoutsIncomplete: state.workoutsIncomplete.filter(
          workout => workout.name !== action.payload.name
        )
      };
    case "TOGGLE_IS_LOADING_WORKOUTS":
      return {
        ...state,
        isLoadingWorkouts: action.payload
      };
    case "MARK_WORKOUT_AS_INCOMPLETE":
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.name == action.payload.name) {
            return {
              ...workout,
              complete: false,
              updatedAt: new Date().getTime()
            };
          }
          return workout;
        }),
        workoutsComplete: state.workoutsComplete.filter(
          workout => workout.name !== action.payload.name
        ),
        workoutsIncomplete: [...state.workoutsIncomplete, action.payload]
      };
    case "DELETE_WORKOUT":
      return {
        ...state,
        workouts: state.workouts.filter(
          workout => workout.name !== action.payload.name
        ),
        workoutsComplete: state.workoutsComplete.filter(
          workout => workout.name !== action.payload.name
        ),
        workoutsIncomplete: state.workoutsIncomplete.filter(
          workout => workout.name !== action.payload.name
        )
      };
    case "UPDATE_WORKOUT_IMAGE":
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.name == action.payload.name) {
            return {
              ...workout,
              image: action.payload.uri,
              updatedAt: new Date().getTime()
            };
          }
          return workout;
        }),
        workoutsIncomplete: state.workoutsIncomplete.map(workout => {
          if (workout.name == action.payload.name) {
            return {
              ...workout,
              image: action.payload.uri,
              updatedAt: new Date().getTime()
            };
          }
          return workout;
        }),
        workoutsComplete: state.workoutsComplete.map(workout => {
          if (workout.name == action.payload.name) {
            return {
              ...workout,
              image: action.payload.uri,
              updatedAt: new Date().getTime()
            };
          }
          return workout;
        })
      };
    default:
      return state;
  }
};

export default workoutsReducer;
