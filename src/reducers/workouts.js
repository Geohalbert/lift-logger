const initialState = {
  workouts: [],
  workoutsInProgress: [],
  workoutsComplete: [],
  isLoadingWorkouts: true
};

const workouts = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_WORKOUTS_FROM_SERVER":
      return {
        ...state,
        workouts: action.payload,
        workoutsInProgress: action.payload.filter(workout => !workout.complete),
        workoutsComplete: action.payload.filter(workout => workout.complete)
      };
    case "ADD_WORKOUT":
      return {
        ...state,
        workouts: [action.payload, ...state.workouts],
        workoutsInProgress: [action.payload, ...state.workoutsInProgress]
      };
    case "MARK_WORKOUT_AS_COMPLETE":
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.name == action.payload.name) {
            return { ...workout, complete: true };
          }
          return workout;
        }),
        workoutsComplete: [...state.workoutsComplete, action.payload],
        workoutsInProgress: state.workoutsInProgress.filter(
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
            return { ...workout, complete: false };
          }
          return workout;
        }),
        workoutsComplete: state.workoutsComplete.filter(
          workout => workout.name !== action.payload.name
        ),
        workoutsInProgress: [...state.workoutsInProgress, action.payload]
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
        workoutsInProgress: state.workoutsInProgress.filter(
          workout => workout.name !== action.payload.name
        )
      };

    default:
      return state;
  }
};

export default workouts;
