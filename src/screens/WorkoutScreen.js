import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
// import ExerciseCount from "../components/ExerciseCount";
import { Ionicons } from "@expo/vector-icons";
import CustomAction from "../components/CustomAction";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/storage";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import ListItem from "../components/ListItem";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import ListEmptyComponent from "../components/ListEmptyComponent";
import Swipeout from "react-native-swipeout";
import * as ImageHelpers from "../helpers/ImageHelpers";

export default function WorkoutScreen({ navigation }) {
  const [isFetching, setIsFetching] = useState(false);
  const [isAddNewExerciseVisible, setIsAddNewExerciseVisible] = useState(false);
  const [exercises, setExercises] = useState([]);
  // const [, set] = useState();
  // const [, set] = useState();
  navigation.getParam("workoutId");
  // constructor() {
  //   super();
  //   this.state = {
  //     isAddNewExerciseVisible: false,
  //     exercises: [],
  //     textInputData: "",
  //     currentWorkout: {}
  //   };
  //   console.log("constructor");
  //   this.textInputRef = null;
  // }

  // componentDidMount = async () => {
  //   const user = this.props.currentUser;
  //   const currentUserData = await firebase
  //     .database()
  //     .ref("users")
  //     .child(user.uid)
  //     .once("value");

  //   const workout = this.props.currentWorkout;
  //   const currentWorkoutData = await firebase
  //     .database()
  //     .ref("exercises")
  //     .child(workout.key)
  //     .once("value");

  //   const exercises = await firebase
  //     .database()
  //     .ref("exercises")
  //     .child(workout.key)
  //     .once("value");

  //   const exercisesArray = snapshotToArray(exercises);

  //   this.setState({
  //     currentUser: currentUserData.val(),
  //     currentWorkout: currentWorkoutData.val()
  //   });

  //   this.props.loadExercises(exercisesArray.reverse());
  //   this.props.toggleIsLoadingExercises(false);
  //   console.log(this.props.exercises);
  // };

  // componentDidUpdate() {
  //   console.log("update");
  // }

  // componentWillUnmount() {
  //   console.log("unmount");
  // }

  // showAddNewExercise = () => {
  //   this.setState({ isAddNewExerciseVisible: true });
  // };

  // hideAddNewExercise = () => {
  //   this.setState({ isAddNewExerciseVisible: false });
  // };

  // addExercise = async exercise => {
  //   this.setState({ textInputData: "" });
  //   this.textInputRef.setNativeProps({ text: "" });

  //   try {
  //     const snapshot = await firebase
  //       .database()
  //       .ref("exercises")
  //       .child(this.state.currentWorkout.id)
  //       .orderByChild("name")
  //       .equalTo(exercise)
  //       .once("value");

  //     if (snapshot.exists()) {
  //       alert("unable to add as exercise already exists");
  //     } else {
  //       const key = await firebase
  //         .database()
  //         .ref("exercises")
  //         .child(this.state.currentUser.uid)
  //         .push().key;

  //       const stamp = new Date().getTime();
  //       const exercisePayload = {
  //         name: exercise,
  //         createdAt: stamp,
  //         updatedAt: stamp,
  //         sets: []
  //       };
  //       const response = await firebase
  //         .database()
  //         .ref("exercises")
  //         .child(this.state.currentUser.uid)
  //         .child(key)
  //         .set(exercisePayload);
  //       this.props.addExercise({ ...exercisePayload, key: key });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // deleteExercise = async (selectedExercise, index) => {
  //   try {
  //     this.props.toggleIsLoadingExercises(true);

  //     await firebase
  //       .database()
  //       .ref("exercises")
  //       .child(this.state.currentUser.uid)
  //       .child(selectedExercise.key)
  //       .remove();

  //     this.props.deleteExercise(selectedExercise);
  //     this.props.toggleIsLoadingExercises(false);
  //   } catch (error) {
  //     console.log(error);
  //     this.props.toggleIsLoadingExercises(false);
  //   }
  // };

  // uploadImage = async (image, selectedExercise) => {
  //   const ref = firebase
  //     .storage()
  //     .ref("exercises")
  //     .child(this.state.currentUser.uid)
  //     .child(selectedExercise.key);

  //   try {
  //     //converting to blob
  //     const blob = await ImageHelpers.prepareBlob(image.uri);
  //     const snapshot = await ref.put(blob);

  //     let downloadUrl = await ref.getDownloadURL();

  //     await firebase
  //       .database()
  //       .ref("exercises")
  //       .child(this.state.currentUser.uid)
  //       .child(selectedExercise.key)
  //       .update({ image: downloadUrl });

  //     blob.close();

  //     return downloadUrl;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // openImageLibrary = async selectedExercise => {
  //   const result = await ImageHelpers.openImageLibrary();

  //   if (result) {
  //     this.props.toggleIsLoadingExercises(true);
  //     const downloadUrl = await this.uploadImage(result, selectedExercise);
  //     this.props.updateExerciseImage({ ...selectedExercise, uri: downloadUrl });
  //     this.props.toggleIsLoadingExercises(false);
  //   }
  // };

  // openCamera = async selectedExercise => {
  //   const result = await ImageHelpers.openCamera();

  //   if (result) {
  //     this.props.toggleIsLoadingExercises(true);
  //     const downloadUrl = await this.uploadImage(result, selectedExercise);
  //     this.props.updateExerciseImage({ ...selectedExercise, uri: downloadUrl });
  //     this.props.toggleIsLoadingExercises(false);
  //   }
  // };

  // addExerciseImage = selectedExercise => {
  //   // Same interface as https://faceworkout.github.io/react-native/docs/actionsheetios.html
  //   const options = ["Select from Photos", "Camera", "Cancel"];
  //   const cancelButtonIndex = 2;

  //   this.props.showActionSheetWithOptions(
  //     {
  //       options,
  //       cancelButtonIndex
  //     },
  //     buttonIndex => {
  //       // Do something here depending on the button index selected
  //       if (buttonIndex == 0) {
  //         this.openImageLibrary(selectedExercise);
  //       } else if (buttonIndex == 1) {
  //         this.openCamera(selectedExercise);
  //       }
  //     }
  //   );
  // };

  // renderItem = (item, index) => {
  //   let swipeoutButtons = [
  //     {
  //       text: "Delete",
  //       component: (
  //         <View
  //           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  //         >
  //           <Ionicons name="ios-trash" size={24} color={colors.txtWhite} />
  //         </View>
  //       ),
  //       backgroundColor: colors.bgDelete,
  //       onPress: () => this.deleteExercise(item, index)
  //     }
  //   ];

  //   return (
  //     <Swipeout
  //       autoClose={true}
  //       style={{ marginHorizontal: 5, marginVertical: 5 }}
  //       backgroundColor={colors.bgMain}
  //       right={swipeoutButtons}
  //     >
  //       <ListItem
  //         editable
  //         onPress={() => this.addExerciseImage(item)}
  //         editable={true}
  //         marginVertical={0}
  //         item={item}
  //       />
  //     </Swipeout>
  //   );
  // };

  console.log("render Exercises");
  return (
    <View style={styles.container}>
      <SafeAreaView />

      <Text>Exercises</Text>
      <SafeAreaView />
    </View>
  );
}

// const mapStateToProps = state => {
//   return {
//     exercises: state.exercises,
//     currentUser: state.auth.currentUser
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     loadExercises: exercises =>
//       dispatch({ type: "LOAD_EXERCISES_FROM_SERVER", payload: exercises }),
//     addExercise: exercise =>
//       dispatch({ type: "ADD_EXERCISE", payload: exercise }),
//     toggleIsLoadingExercises: bool =>
//       dispatch({ type: "TOGGLE_IS_LOADING_EXERCISES", payload: bool }),
//     deleteExercise: exercise =>
//       dispatch({ type: "DELETE_EXERCISE", payload: exercise }),
//     updateExerciseImage: exercise =>
//       dispatch({ type: "UPDATE_EXERCISE_IMAGE", payload: exercise })
//   };
// };

// const wrapper = compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   connectActionSheet
// );

// export default wrapper(WorkoutScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain
  },
  header: {
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderColor,
    alignItems: "center",
    justifyContent: "center"
  },
  headerTitle: {
    fontSize: 24
  },
  textInputContainer: {
    height: 50,
    flexDirection: "row",
    margin: 5
  },
  textInput: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: colors.listItemBg,
    borderBottomWidth: 5,
    fontSize: 22,
    fontWeight: "200",
    color: colors.txtWhite
  },
  checkmarkButton: {
    backgroundColor: colors.bgSuccess
  },
  listEmptyComponent: {
    marginTop: 50,
    alignItems: "center"
  },
  listEmptyComponentText: {
    fontWeight: "bold"
  },
  markAsCompleteButton: {
    width: 100,
    backgroundColor: colors.bgSuccess
  },
  markAsCompleteButtonText: {
    fontWeight: "bold",
    color: "white"
  },
  addNewExerciseButton: {
    backgroundColor: colors.bgPrimary,
    borderRadius: 25
  },
  addNewExerciseButtonText: {
    color: "white",
    fontSize: 30
  },
  footer: {
    height: 70,
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: colors.borderColor
  }
});
5.4;
