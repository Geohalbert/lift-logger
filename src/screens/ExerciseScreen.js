import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import CustomAction from "../components/CustomAction";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import RenderItem from "../components/RenderItem";
import "firebase/storage";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import * as Animatable from "react-native-animatable";
import ListEmptyComponent from "../components/ListEmptyComponent";

import InputField from "../components/InputField";
import {
  addSet,
  loadSets,
  markSetAsComplete,
  markSetAsIncomplete,
  removeSet
} from "../redux/actions/sets";

export default function SetScreen({ route }) {
  const { currentWorkout, exerciseId } = route.params;
  const sets = useSelector(state => state.sets.sets);
  const setsIncomplete = useSelector(state => state.sets.setsIncomplete);
  const setsComplete = useSelector(state => state.sets.setsComplete);
  const currentUser = useSelector(state => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const uid = JSON.parse(JSON.stringify(currentUser.uid));
  const [isLoading, setIsLoading] = useState(true);

  const [isAddNewSetVisible, setIsAddNewSetVisible] = useState(false);
  const [newSetReps, setNewSetReps] = useState("");
  const [newSetWeight, setNewSetWeight] = useState("");
  const [isSetRepsInvalid, onChangeSetRepsError] = useState(false);
  const [isSetWeightInvalid, onChangeSetWeightError] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  const fetchSets = async () => {
    setIsLoading(true);
    if (exerciseId) {
      const response = await firebase
        .database()
        .ref("exercises/" + exerciseId)
        .child("sets")
        .orderByChild("createdAt")
        .once("value");

      let setsArray = snapshotToArray(response);
      dispatch(loadSets(setsArray));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const newSet = async () => {
    const stamp = new Date().getTime();
    const setPayload = {
      exerciseId: exerciseId,
      reps: newSetReps,
      weight: newSetWeight,
      complete: false,
      createdAt: stamp,
      updatedAt: stamp
    };

    const key = firebase
      .database()
      .ref("/exercises/" + exerciseId + "/sets/")
      .push().key;

    await firebase
      .database()
      .ref("/exercises/" + exerciseId + "/sets/" + key)
      .set(setPayload);
    setNewSetReps("");
    setNewSetWeight("");
    setIsAddNewSetVisible(false);
    dispatch(addSet(setPayload));
  };

  const markAsComplete = selectedSet => {
    setIsLoading(true);

    const newStamp = new Date().getTime();
    const updates = {
      complete: true,
      updatedAt: newStamp
    };
    try {
      const updatedSet = Object.assign(selectedSet, updates);
      firebase
        .database()
        .ref("exercises/" + exerciseId + "/sets/")
        .child(selectedSet.key)
        .update(updates);

      dispatch(markSetAsComplete(updatedSet));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const markAsIncomplete = selectedSet => {
    setIsLoading(true);

    const newStamp = new Date().getTime();
    const updates = {
      complete: false,
      updatedAt: newStamp
    };
    try {
      const updatedSet = Object.assign(selectedSet, updates);
      firebase
        .database()
        .ref("exercises/" + exerciseId + "/sets/")
        .child(selectedSet.key)
        .update(updates);

      dispatch(markSetAsIncomplete(updatedSet));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteSet = selectedSet => {
    setIsLoading(true);
    try {
      firebase
        .database()
        .ref("exercises/" + exerciseId + "/sets/")
        .child(selectedSet.key)
        .remove();

      dispatch(removeSet(selectedSet));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onUpdateSetReps = text => {
    setNewSetReps(text);
    text.length > 0 && newSetWeight.length > 0
      ? setIsAddNewSetVisible(true)
      : setIsAddNewSetVisible(false);
    if (isSetRepsInvalid) {
      onChangeSetRepsError(false);
    }
  };
  const onUpdateSetWeight = text => {
    setNewSetWeight(text);
    text.length > 0 && newSetReps.length > 0
      ? setIsAddNewSetVisible(true)
      : setIsAddNewSetVisible(false);
    if (isSetWeightInvalid) {
      onChangeSetWeightError(false);
    }
  };

  const viewSet = selectedSet => {
    navigation.navigate("Set", {
      currentSet: selectedSet,
      setId: selectedSet.key
    });
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
          <Text style={styles.newSet}>Set {sets.length + 1}: </Text>
          <InputField
            onChangeText={text => onUpdateSetReps(text)}
            error={isSetRepsInvalid}
            keyboardType="numeric"
            errorMessage={"Please enter a valid integer."}
            value={newSetReps}
            placeholder={"Reps"}
            placeholderTextColor={colors.bgTextInputDark}
          />
          <InputField
            onChangeText={text => onUpdateSetWeight(text)}
            error={isSetWeightInvalid}
            keyboardType="numeric"
            errorMessage={"Please enter a valid integer."}
            value={newSetWeight}
            placeholder={"Weight"}
            placeholderTextColor={colors.bgTextInputDark}
          />
        </View>
        <FlatList
          data={sets}
          renderItem={({ item, index }) => (
            <RenderItem
              item={item}
              index={index}
              deleteFunction={deleteSet}
              markItemFunction={markAsComplete}
              unmarkItemFunction={markAsIncomplete}
              navFunction={viewSet}
              addImage={null}
              type={"set"}
            />
          )}
          keyExtractor={(item, index) => item.key}
          ListEmptyComponent={
            !isLoading && <ListEmptyComponent text="Not Reading Any Sets." />
          }
        />
        <Animatable.View
          animation={isAddNewSetVisible ? "slideInRight" : "slideOutRight"}
        >
          <CustomAction
            position="right"
            style={styles.addNewSetButton}
            onPress={() => newSet()}
          >
            <Text style={styles.addNewSetButtonText}>+</Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  newSet: {
    color: colors.txtWhite
  },
  addNewSetButton: {
    backgroundColor: colors.bgPrimary,
    borderRadius: 25
  },
  addNewSetButtonText: {
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
