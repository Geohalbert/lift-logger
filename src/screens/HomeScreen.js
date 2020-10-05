import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  AsyncStorage
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
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import ListEmptyComponent from "../components/ListEmptyComponent";
import Swipeout from "react-native-swipeout";
import * as ImageHelpers from "../helpers/ImageHelpers";
import { useNavigation } from "@react-navigation/native";

import InputField from "../components/InputField";
import {
  loadWorkouts,
  addWorkout,
  markWorkoutAsComplete,
  markWorkoutAsIncomplete,
  removeWorkout,
  updateWorkout
} from "../redux/actions/workouts";

export default function HomeScreen() {
  const workouts = useSelector(state => state.workouts.workouts);
  const workoutsIncomplete = useSelector(
    state => state.workouts.workoutsIncomplete
  );
  const workoutsComplete = useSelector(
    state => state.workouts.workoutsComplete
  );
  const currentUser = useSelector(state => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const uid = JSON.parse(JSON.stringify(currentUser.uid));
  const [isLoading, setIsLoading] = useState(true);

  const [isAddNewWorkoutVisible, setIsAddNewWorkoutVisible] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [isWorkoutNameInvalid, onChangeWorkoutNameError] = useState(false);

  const getToken = async () => {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
      console.log(data);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };
  fetchWorkouts = async () => {
    getToken;
    setIsLoading(true);
    if (uid) {
      const response = await firebase
        .database()
        .ref("users/" + uid)
        .child("workouts")
        .orderByChild("createdAt")
        .once("value");

      let workoutsArray = snapshotToArray(response);
      dispatch(loadWorkouts(workoutsArray.reverse()));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const newWorkout = workoutName => {
    const stamp = new Date().getTime();
    const workoutPayload = {
      uid: uid,
      name: workoutName,
      complete: false,
      createdAt: stamp,
      updatedAt: stamp
    };

    const key = firebase
      .database()
      .ref("workouts")
      .push().key;

    const updates = {};
    updates["/workouts/" + key] = workoutPayload;
    updates["/users/" + uid + "/workouts/" + key] = workoutPayload;
    firebase
      .database()
      .ref()
      .update(updates);
    dispatch(addWorkout(workoutPayload));
  };

  const hasDuplicates = array => {
    const today = new Date().toLocaleDateString("en-US");
    for (let i = 0; i < array.length; ++i) {
      let obj = array[i];
      let dateCreated = new Date(obj.createdAt).toLocaleDateString("en-US");
      if (dateCreated === today) {
        return true;
      }
    }
    return false;
  };

  const createWorkout = workoutName => {
    return firebase
      .database()
      .ref("users/" + uid)
      .child("workouts")
      .orderByChild("name")
      .equalTo(workoutName)
      .once("value", snapshot => {
        if (snapshot.exists()) {
          let workoutsArray = snapshotToArray(snapshot);
          const result = hasDuplicates(workoutsArray)
            ? alert(
                "A workout with the same name has already been created today."
              )
            : newWorkout(workoutName);
          return result;
        } else {
          newWorkout(workoutName);
        }
      });
  };

  const markAsComplete = selectedWorkout => {
    setIsLoading(true);

    const newStamp = new Date().getTime();
    const updates = {
      complete: true,
      updatedAt: newStamp
    };
    try {
      const updatedWorkout = Object.assign(selectedWorkout, updates);
      firebase
        .database()
        .ref("users/" + uid + "/workouts")
        .child(selectedWorkout.key)
        .update(updates);

      dispatch(markWorkoutAsComplete(updatedWorkout));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const markAsIncomplete = selectedWorkout => {
    setIsLoading(true);

    const newStamp = new Date().getTime();
    const updates = {
      complete: false,
      updatedAt: newStamp
    };
    try {
      const updatedWorkout = Object.assign(selectedWorkout, updates);
      firebase
        .database()
        .ref("users/" + uid + "/workouts")
        .child(selectedWorkout.key)
        .update(updates);

      dispatch(markWorkoutAsIncomplete(updatedWorkout));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteWorkout = selectedWorkout => {
    setIsLoading(true);
    try {
      firebase
        .database()
        .ref("users/" + uid + "/workouts")
        .child(selectedWorkout.key)
        .remove();

      dispatch(removeWorkout(selectedWorkout));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const uploadImage = async (image, selectedWorkout) => {
    const ref = firebase
      .storage()
      .ref("workouts")
      .child(selectedWorkout.key);

    try {
      //converting to blob
      const blob = await ImageHelpers.prepareBlob(image.uri);
      const snapshot = await ref.put(blob);

      let downloadUrl = await ref.getDownloadURL();

      await firebase
        .database()
        .ref("users/" + currentUser.uid + "/workouts")
        .child(selectedWorkout.key)
        .update({ image: downloadUrl });

      blob.close();

      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const openImageLibrary = async selectedWorkout => {
    const result = await ImageHelpers.openImageLibrary();

    if (result) {
      setIsLoading(true);
      const downloadUrl = await uploadImage(result, selectedWorkout);
      props.updateWorkoutImage({ ...selectedWorkout, uri: downloadUrl });
      setIsLoading(false);
    }
  };

  const openCamera = async selectedWorkout => {
    const result = await ImageHelpers.openCamera();

    if (result) {
      setIsLoading(true);
      const downloadUrl = await uploadImage(result, selectedWorkout);
      props.updateWorkoutImage({ ...selectedWorkout, uri: downloadUrl });
      setIsLoading(false);
    }
  };

  const addWorkoutImage = selectedWorkout => {
    // Same interface as https://faceworkout.github.io/react-native/docs/actionsheetios.html
    const options = ["Select from Photos", "Camera", "Cancel"];
    const cancelButtonIndex = 2;

    props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex == 0) {
          openImageLibrary(selectedWorkout);
        } else if (buttonIndex == 1) {
          openCamera(selectedWorkout);
        }
      }
    );
  };

  const onUpdateWorkoutName = text => {
    setNewWorkoutName(text);
    text.length > 0
      ? setIsAddNewWorkoutVisible(true)
      : setIsAddNewWorkoutVisible(false);
    if (isWorkoutNameInvalid) {
      onChangeWorkoutNameError(false);
    }
  };

  const viewWorkout = selectedWorkout => {
    navigation.navigate("Workout", {
      currentWorkout: selectedWorkout,
      workoutId: selectedWorkout.key
    });
  };

  const renderItem = ({ item }) => {
    const key = JSON.stringify(item.key);
    console.log(`key: ${key}`);
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
        onPress: () => deleteWorkout(item)
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
        onPress: () => markAsComplete(item)
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
        onPress: () => markAsIncomplete(item)
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
          navPress={() => viewWorkout(item)}
          editable
          onPress={() => addWorkoutImage(item)}
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

  console.log("render");
  return (
    <View style={styles.container}>
      <SafeAreaView />

      <View style={styles.container}>
        {isLoading && (
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
          <InputField
            isBanner
            onChangeText={text => onUpdateWorkoutName(text)}
            error={isWorkoutNameInvalid}
            keyboardType="default"
            errorMessage={"Please enter a valid name."}
            value={newWorkoutName}
            placeholder={"Name your next workout"}
            placeholderTextColor={colors.bgTextInputDark}
          />
        </View>
        <FlatList
          data={workouts}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          ListEmptyComponent={
            !isLoading && (
              <ListEmptyComponent text="Not Reading Any Workouts." />
            )
          }
        />
        <Animatable.View
          animation={isAddNewWorkoutVisible ? "slideInRight" : "slideOutRight"}
        >
          <CustomAction
            position="right"
            style={styles.addNewWorkoutButton}
            onPress={() => createWorkout(newWorkoutName)}
          >
            <Text style={styles.addNewWorkoutButtonText}>+</Text>
          </CustomAction>
        </Animatable.View>
      </View>
      <SafeAreaView />
    </View>
  );
}

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
