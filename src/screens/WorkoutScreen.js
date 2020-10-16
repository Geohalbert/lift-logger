import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
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

import InputField from "../components/InputField";
import {
  addExercise,
  loadExercises,
  markExerciseAsComplete,
  markExerciseAsIncomplete,
  removeExercise
} from "../redux/actions/exercises";

export default function WorkoutScreen({ route }) {
  const { currentWorkout, workoutId } = route.params;
  const exercises = useSelector(state => state.exercises.exercises);
  const exercisesIncomplete = useSelector(
    state => state.exercises.exercisesIncomplete
  );
  const exercisesComplete = useSelector(
    state => state.exercises.exercisesComplete
  );
  const currentUser = useSelector(state => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const uid = JSON.parse(JSON.stringify(currentUser.uid));
  const [isLoading, setIsLoading] = useState(true);

  const [isAddNewExerciseVisible, setIsAddNewExerciseVisible] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [isExerciseNameInvalid, onChangeExerciseNameError] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  const getToken = async () => {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const fetchExercises = async () => {
    getToken;
    setIsLoading(true);
    if (workoutId) {
      console.log(`fetchExercises has workoutId`);
      const response = await firebase
        .database()
        .ref("workouts/" + workoutId)
        .child("exercises")
        .orderByChild("createdAt")
        .once("value");

      let exercisesArray = snapshotToArray(response);
      dispatch(loadExercises(exercisesArray.reverse()));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const newExercise = exerciseName => {
    const stamp = new Date().getTime();
    const exercisePayload = {
      workoutId: workoutId,
      name: exerciseName,
      complete: false,
      createdAt: stamp,
      updatedAt: stamp
    };

    const key = firebase
      .database()
      .ref("exercises")
      .push().key;

    const updates = {};
    updates["/exercises/" + key] = exercisePayload;
    updates["/workouts/" + workoutId + "/exercises/" + key] = exercisePayload;
    firebase
      .database()
      .ref()
      .update(updates);
    setNewExerciseName("");
    dispatch(addExercise(exercisePayload));
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

  const createExercise = exerciseName => {
    return firebase
      .database()
      .ref("workouts/" + workoutId)
      .child("exercises")
      .orderByChild("name")
      .equalTo(exerciseName)
      .once("value", snapshot => {
        if (snapshot.exists()) {
          let exercisesArray = snapshotToArray(snapshot);
          const result = hasDuplicates(exercisesArray)
            ? alert(
                "A exercise with the same name has already been created today."
              )
            : newExercise(exerciseName);
          return result;
        } else {
          newExercise(exerciseName);
        }
      });
  };

  const markAsComplete = selectedExercise => {
    setIsLoading(true);

    const newStamp = new Date().getTime();
    const updates = {
      complete: true,
      updatedAt: newStamp
    };
    try {
      const updatedExercise = Object.assign(selectedExercise, updates);
      firebase
        .database()
        .ref("workouts/" + workoutId + "/exercises")
        .child(selectedExercise.key)
        .update(updates);

      dispatch(markExerciseAsComplete(updatedExercise));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const markAsIncomplete = selectedExercise => {
    setIsLoading(true);

    const newStamp = new Date().getTime();
    const updates = {
      complete: false,
      updatedAt: newStamp
    };
    try {
      const updatedExercise = Object.assign(selectedExercise, updates);
      firebase
        .database()
        .ref("workouts/" + workoutId + "/exercises")
        .child(selectedExercise.key)
        .update(updates);

      dispatch(markExerciseAsIncomplete(updatedExercise));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteExercise = selectedExercise => {
    setIsLoading(true);
    try {
      firebase
        .database()
        .ref("workouts/" + workoutId + "/exercises")
        .child(selectedExercise.key)
        .remove();

      dispatch(removeExercise(selectedExercise));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const addExerciseImage = selectedExercise => {
    navigation.navigate("Camera", {
      uid: uid,
      selectedExercise: selectedExercise,
      setIsFocused: setIsFocused,
      uri: selectedExercise.image || null
    });
    setIsFocused(false);
  };

  const onUpdateExerciseName = text => {
    setNewExerciseName(text);
    text.length > 0
      ? setIsAddNewExerciseVisible(true)
      : setIsAddNewExerciseVisible(false);
    if (isExerciseNameInvalid) {
      onChangeExerciseNameError(false);
    }
  };

  const viewExercise = selectedExercise => {
    navigation.navigate("Exercise", {
      name: selectedExercise.name,
      currentExercise: selectedExercise,
      exerciseId: selectedExercise.key
    });
  };

  const RenderExercise = ({ item }) => {
    return (
      <RenderItem
        item={item}
        deleteFunction={deleteExercise}
        markItemFunction={markAsComplete}
        unmarkItemFunction={markAsIncomplete}
        navFunction={viewExercise}
        addImage={addExerciseImage}
        type={"exercise"}
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
            onChangeText={text => onUpdateExerciseName(text)}
            error={isExerciseNameInvalid}
            keyboardType="default"
            errorMessage={"Please enter a valid name."}
            value={newExerciseName}
            placeholder={"Name your next exercise"}
            placeholderTextColor={colors.bgTextInputDark}
          />
        </View>
        <FlatList
          data={exercises}
          renderItem={RenderExercise}
          keyExtractor={item => item.key}
          ListEmptyComponent={
            !isLoading && (
              <ListEmptyComponent text="Not Reading Any Exercises." />
            )
          }
        />
        <Animatable.View
          animation={isAddNewExerciseVisible ? "slideInRight" : "slideOutRight"}
        >
          <CustomAction
            position="right"
            style={styles.addNewExerciseButton}
            onPress={() => createExercise(newExerciseName)}
          >
            <Text style={styles.addNewExerciseButtonText}>+</Text>
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
