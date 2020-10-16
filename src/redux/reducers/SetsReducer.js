const initialState = {
  sets: [],
  setsIncomplete: [],
  setsComplete: [],
  isLoadingSets: false,
  image: null
};

const setsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_SETS_FROM_SERVER":
      return {
        ...state,
        sets: action.payload,
        setsIncomplete: action.payload.filter(set => !set.complete),
        setsComplete: action.payload.filter(set => set.complete)
      };
    case "ADD_SET":
      return {
        ...state,
        sets: [action.payload, ...state.sets],
        setsIncomplete: [action.payload, ...state.setsIncomplete]
      };
    case "UPDATE_SET":
      let updatedSet = action.payload;

      //clone the current state
      let clone = state.sets;
      let index = clone.findIndex(obj => obj.key === updatedSet.key);

      //if the set is in the array, update the set
      if (index !== -1) clone[index] = action.payload;
      return {
        ...state,
        sets: clone
      };
    case "MARK_SET_AS_COMPLETE":
      return {
        ...state,
        sets: state.sets.map(set => {
          if (set.key == action.payload.key) {
            return {
              ...set,
              complete: true,
              updatedAt: new Date().getTime()
            };
          }
          return set;
        }),
        setsComplete: [...state.setsComplete, action.payload],
        setsIncomplete: state.setsIncomplete.filter(
          set => set.key !== action.payload.key
        )
      };
    case "TOGGLE_IS_LOADING_SETS":
      return {
        ...state,
        isLoadingSets: action.payload
      };
    case "MARK_SET_AS_INCOMPLETE":
      return {
        ...state,
        sets: state.sets.map(set => {
          if (set.key == action.payload.key) {
            return {
              ...set,
              complete: false,
              updatedAt: new Date().getTime()
            };
          }
          return set;
        }),
        setsComplete: state.setsComplete.filter(
          set => set.key !== action.payload.key
        ),
        setsIncomplete: [...state.setsIncomplete, action.payload]
      };
    case "DELETE_SET":
      let allSets = JSON.parse(JSON.stringify(state.sets));

      //check if set exists
      let ind = allSets.findIndex(obj => obj.key === action.payload.key);

      //if the set is in the array, remove the qset
      if (ind !== -1) allSets.splice(ind, 1);

      return {
        ...state,
        sets: allSets,
        setsComplete: state.setsComplete.filter(
          set => set.key !== action.payload.key
        ),
        setsIncomplete: state.setsIncomplete.filter(
          set => set.key !== action.payload.key
        )
      };
    case "UPDATE_SET_IMAGE":
      return {
        ...state,
        sets: state.sets.map(set => {
          if (set.name == action.payload.name) {
            return {
              ...set,
              image: action.payload.uri,
              updatedAt: new Date().getTime()
            };
          }
          return set;
        }),
        setsIncomplete: state.setsIncomplete.map(set => {
          if (set.name == action.payload.name) {
            return {
              ...set,
              image: action.payload.uri,
              updatedAt: new Date().getTime()
            };
          }
          return set;
        }),
        setsComplete: state.setsComplete.map(set => {
          if (set.name == action.payload.name) {
            return {
              ...set,
              image: action.payload.uri,
              updatedAt: new Date().getTime()
            };
          }
          return set;
        })
      };
    default:
      return state;
  }
};

export default setsReducer;
