import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import CustomAction from "../components/CustomAction";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/storage";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import * as Animatable from "react-native-animatable";
import ListEmptyComponent from "../components/ListEmptyComponent";
import RenderItem from "../components/RenderItem";

import { useNavigation } from "@react-navigation/native";

import InputField from "../components/InputField";
import {
  addWorkout,
  loadWorkouts,
  markWorkoutAsComplete,
  markWorkoutAsIncomplete,
  removeWorkout
} from "../redux/actions/workouts";

export default function HomeScreen({ props }) {
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
  const [isFocused, setIsFocused] = useState(true);

  const getToken = async () => {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
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
    setNewWorkoutName("");
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

  const addWorkoutImage = selectedWorkout => {
    navigation.navigate("Camera", {
      uid: uid,
      selectedWorkout: selectedWorkout,
      setIsFocused: setIsFocused,
      uri: selectedWorkout.image || null
    });
    setIsFocused(false);
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
      name: selectedWorkout.name,
      currentWorkout: selectedWorkout,
      workoutId: selectedWorkout.key
    });
  };

  const RenderWorkout = ({ item }) => {
    return (
      <RenderItem
        item={item}
        deleteFunction={deleteWorkout}
        markItemFunction={markAsComplete}
        unmarkItemFunction={markAsIncomplete}
        navFunction={viewWorkout}
        addImage={addWorkoutImage}
        type={"workout"}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />

      <View style={styles.container}>
        <ActivityIndicator
          animating={isLoading}
          size="large"
          color={colors.logoColor}
          style={styles.activityIndicator}
        />
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
          renderItem={RenderWorkout}
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
  activityIndicator: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1000
  },
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
