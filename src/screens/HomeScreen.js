import React from "react";
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
import WorkoutCount from "../components/WorkoutCount";
import WorkoutScreen from "./WorkoutScreen";
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

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      isAddNewWorkoutVisible: false,
      workouts: [],
      workoutsIncomplete: [],
      workoutsComplete: [],
      textInputData: "",
      currentUser: {}
    };
    console.log("constructor");
    this.textInputRef = null;
  }

  componentDidMount = async () => {
    const user = this.props.currentUser;
    const currentUserData = await firebase
      .database()
      .ref("users")
      .child(user.uid)
      .once("value");

    const workouts = await firebase
      .database()
      .ref("workouts")
      .child(user.uid)
      .once("value");

    const workoutsArray = snapshotToArray(workouts);

    this.setState({
      currentUser: currentUserData.val()
    });

    this.props.loadWorkouts(workoutsArray.reverse());
    this.props.toggleIsLoadingWorkouts(false);
    console.log(this.props.workouts);
  };

  componentDidUpdate() {
    console.log("update");
  }

  componentWillUnmount() {
    console.log("unmount");
  }

  showAddNewWorkout = () => {
    this.setState({ isAddNewWorkoutVisible: true });
  };

  hideAddNewWorkout = () => {
    this.setState({ isAddNewWorkoutVisible: false });
  };

  addWorkout = async workout => {
    this.setState({ textInputData: "" });
    this.textInputRef.setNativeProps({ text: "" });

    try {
      const snapshot = await firebase
        .database()
        .ref("workouts")
        .child(this.state.currentUser.uid)
        .orderByChild("name")
        .equalTo(workout)
        .once("value");

      if (snapshot.exists()) {
        alert("unable to add as workout already exists");
      } else {
        const key = await firebase
          .database()
          .ref("workouts")
          .child(this.state.currentUser.uid)
          .push().key;

        const stamp = new Date().getTime();
        const workPay = {
          name: workout,
          complete: false,
          createdAt: stamp,
          updatedAt: stamp,
          exercises: []
        };
        const response = await firebase
          .database()
          .ref("workouts")
          .child(this.state.currentUser.uid)
          .child(key)
          .set(workPay);
        this.props.addWorkout({ ...workPay, key: key });
      }
    } catch (error) {
      console.log(error);
    }
  };

  markAsComplete = async (selectedWorkout, index) => {
    try {
      this.props.toggleIsLoadingWorkouts(true);

      await firebase
        .database()
        .ref("workouts")
        .child(this.state.currentUser.uid)
        .child(selectedWorkout.key)
        .update({ complete: true });

      let workouts = this.state.workouts.map(workout => {
        if (workout.name == selectedWorkout.name) {
          return { ...workout, complete: true };
        }
        return workout;
      });

      let workoutsIncomplete = this.state.workoutsIncomplete.filter(
        workout => workout.name !== selectedWorkout.name
      );

      this.props.markWorkoutAsComplete(selectedWorkout);
      this.props.toggleIsLoadingWorkouts(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingWorkouts(false);
    }
  };

  markAsIncomplete = async (selectedWorkout, index) => {
    try {
      this.props.toggleIsLoadingWorkouts(true);

      await firebase
        .database()
        .ref("workouts")
        .child(this.state.currentUser.uid)
        .child(selectedWorkout.key)
        .update({ complete: false });

      this.props.markWorkoutAsIncomplete(selectedWorkout);
      this.props.toggleIsLoadingWorkouts(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingWorkouts(false);
    }
  };

  deleteWorkout = async (selectedWorkout, index) => {
    try {
      this.props.toggleIsLoadingWorkouts(true);

      await firebase
        .database()
        .ref("workouts")
        .child(this.state.currentUser.uid)
        .child(selectedWorkout.key)
        .remove();

      this.props.deleteWorkout(selectedWorkout);
      this.props.toggleIsLoadingWorkouts(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingWorkouts(false);
    }
  };

  uploadImage = async (image, selectedWorkout) => {
    const ref = firebase
      .storage()
      .ref("workouts")
      .child(this.state.currentUser.uid)
      .child(selectedWorkout.key);

    try {
      //converting to blob
      const blob = await ImageHelpers.prepareBlob(image.uri);
      const snapshot = await ref.put(blob);

      let downloadUrl = await ref.getDownloadURL();

      await firebase
        .database()
        .ref("workouts")
        .child(this.state.currentUser.uid)
        .child(selectedWorkout.key)
        .update({ image: downloadUrl });

      blob.close();

      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  openImageLibrary = async selectedWorkout => {
    const result = await ImageHelpers.openImageLibrary();

    if (result) {
      this.props.toggleIsLoadingWorkouts(true);
      const downloadUrl = await this.uploadImage(result, selectedWorkout);
      this.props.updateWorkoutImage({ ...selectedWorkout, uri: downloadUrl });
      this.props.toggleIsLoadingWorkouts(false);
    }
  };

  openCamera = async selectedWorkout => {
    const result = await ImageHelpers.openCamera();

    if (result) {
      this.props.toggleIsLoadingWorkouts(true);
      const downloadUrl = await this.uploadImage(result, selectedWorkout);
      this.props.updateWorkoutImage({ ...selectedWorkout, uri: downloadUrl });
      this.props.toggleIsLoadingWorkouts(false);
    }
  };

  addWorkoutImage = selectedWorkout => {
    // Same interface as https://faceworkout.github.io/react-native/docs/actionsheetios.html
    const options = ["Select from Photos", "Camera", "Cancel"];
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex == 0) {
          this.openImageLibrary(selectedWorkout);
        } else if (buttonIndex == 1) {
          this.openCamera(selectedWorkout);
        }
      }
    );
  };

  viewWorkout = async selectedWorkout => {
    console.log(`selectedWorkout.key: ${selectedWorkout.key}`);
    console.log(`selectedWorkout: ${JSON.stringify(selectedWorkout)}`);
    this.props.navigation.navigate("Workout", {
      currentWorkout: selectedWorkout,
      workoutId: selectedWorkout.key
    });

    // await firebase
    // .database()
    // .ref("workouts")
    // .child(this.state.currentUser.uid)
    // .child(selectedWorkout.key)
    // .remove();
  };

  renderItem = (item, index) => {
    let swipeoutButtons = [
      {
        text: "Delete",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="ios-trash" size={24} color={colors.txtWhite} />
          </View>
        ),
        backgroundColor: colors.bgDelete,
        onPress: () => this.deleteWorkout(item, index)
      }
    ];

    if (!item.complete) {
      swipeoutButtons.unshift({
        text: "Mark Complete",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: colors.txtWhite }}>Mark as Complete</Text>
          </View>
        ),
        backgroundColor: colors.bgSuccessDark,
        onPress: () => this.markAsComplete(item, index)
      });
    } else {
      swipeoutButtons.unshift({
        text: "Mark Incomplete",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: colors.txtWhite }}>Mark Incomplete</Text>
          </View>
        ),
        backgroundColor: colors.bgIncomplete,
        onPress: () => this.markAsIncomplete(item, index)
      });
    }

    return (
      <Swipeout
        autoClose={true}
        style={{ marginHorizontal: 5, marginVertical: 5 }}
        backgroundColor={colors.bgMain}
        right={swipeoutButtons}
      >
        <ListItem
          navPress={() => this.viewWorkout(item)}
          editable
          onPress={() => this.addWorkoutImage(item)}
          editable={true}
          marginVertical={0}
          item={item}
        >
          {item.complete && (
            <Ionicons
              style={{ marginRight: 5 }}
              name="ios-checkmark"
              color={colors.logoColor}
              size={30}
            />
          )}
        </ListItem>
      </Swipeout>
    );
  };

  render() {
    console.log("render");
    return (
      <View style={styles.container}>
        <SafeAreaView />

        <View style={styles.container}>
          {this.props.workouts.isLoadingWorkouts && (
            <View
              style={{
                ...StyleSheet.absoluteFill,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                elevation: 1000
              }}
            >
              <ActivityIndicator size="large" color={colors.logoColor} />
            </View>
          )}
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter new workout name"
              placeholderTextColor={colors.txtPlaceholder}
              onChangeText={text => this.setState({ textInputData: text })}
              ref={component => {
                this.textInputRef = component;
              }}
            />
          </View>

          {/* {this.state.isAddNewWorkoutVisible && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Workout Name"
                placeholderTextColor="grey"
                onChangeText={text => this.setState({ textInputdata: text })}
              />
              <CustomAction
                style={styles.checkmarkButton}
                onPress={() => this.addWorkout(this.state.textInputdata)}
              >
                <Ionicons name="ios-checkmark" size={40} color="white" />
              </CustomAction>
              <CustomAction onPress={this.hideAddNewWorkout}>
                <Ionicons name="ios-close" size={40} color="white" />
              </CustomAction>
             
            </View>
          )} */}

          <FlatList
            data={this.props.workouts.workouts}
            renderItem={({ item }, index) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              !this.props.workouts.isLoadingWorkouts && (
                <ListEmptyComponent text="Not Reading Any Workouts." />
              )
            }
          />
          <Animatable.View
            animation={
              this.state.textInputData.length > 0
                ? "slideInRight"
                : "slideOutRight"
            }
          >
            <CustomAction
              position="right"
              style={styles.addNewWorkoutButton}
              onPress={() => this.addWorkout(this.state.textInputData)}
            >
              <Text style={styles.addNewWorkoutButtonText}>+</Text>
            </CustomAction>
          </Animatable.View>
        </View>

        {/* <View style={styles.footer}>
          <WorkoutCount count={this.state.workouts.length} title="Total Workouts" />
          <WorkoutCount count={this.state.workoutsIncomplete.length} title="Incomplete" />
          <WorkoutCount count={this.state.workoutsComplete.length} title="Complete" />
        </View> */}
        <SafeAreaView />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    workouts: state.workouts,
    currentUser: state.auth.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadWorkouts: workouts =>
      dispatch({ type: "LOAD_WORKOUTS_FROM_SERVER", payload: workouts }),
    addWorkout: workout => dispatch({ type: "ADD_WORKOUT", payload: workout }),
    markWorkoutAsComplete: workout =>
      dispatch({ type: "MARK_WORKOUT_AS_COMPLETE", payload: workout }),
    toggleIsLoadingWorkouts: bool =>
      dispatch({ type: "TOGGLE_IS_LOADING_WORKOUTS", payload: bool }),
    markWorkoutAsIncomplete: workout =>
      dispatch({ type: "MARK_WORKOUT_AS_INCOMPLETE", payload: workout }),
    deleteWorkout: workout =>
      dispatch({ type: "DELETE_WORKOUT", payload: workout }),
    updateWorkoutImage: workout =>
      dispatch({ type: "UPDATE_WORKOUT_IMAGE", payload: workout })
  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(HomeScreen);

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
  addNewWorkoutButton: {
    backgroundColor: colors.bgPrimary,
    borderRadius: 25
  },
  addNewWorkoutButtonText: {
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
