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
import { Ionicons } from "@expo/vector-icons";
import CustomAction from "../components/CustomAction";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/storage";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import ListItem from "../components/ListItem";
import * as Animatable from "react-native-animatable";
import ListEmptyComponent from "../components/ListEmptyComponent";
import Swipeout from "react-native-swipeout";

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
  const [newSetName, setNewSetName] = useState("");
  const [isSetNameInvalid, onChangeSetNameError] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  const getToken = async () => {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const fetchSets = async () => {
    getToken;
    setIsLoading(true);
    if (exerciseId) {
      console.log(`fetchSets has exerciseId`);
      const response = await firebase
        .database()
        .ref("exercises/" + exerciseId)
        .child("sets")
        .orderByChild("createdAt")
        .once("value");

      let setsArray = snapshotToArray(response);
      dispatch(loadSets(setsArray.reverse()));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const newSet = setName => {
    const stamp = new Date().getTime();
    const setPayload = {
      exerciseId: exerciseId,
      name: setName,
      complete: false,
      createdAt: stamp,
      updatedAt: stamp
    };

    // const key = firebase
    //   .database()
    //   .ref("/exercises/" + exerciseId + "/sets/")
    //   .push().key;

    // const updates = {};
    // updates["/exercises/" + exerciseId + "/sets/" + key] = setPayload;
    firebase
      .database()
      .ref("/exercises/" + exerciseId + "/sets/")
      .push(setPayload);
    setNewSetName("");
    dispatch(addSet(setPayload));
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

  const createSet = setName => {
    return firebase
      .database()
      .ref("exercises/" + exerciseId)
      .child("sets")
      .orderByChild("name")
      .equalTo(setName)
      .once("value", snapshot => {
        if (snapshot.exists()) {
          let setsArray = snapshotToArray(snapshot);
          const result = hasDuplicates(setsArray)
            ? alert("A set with the same name has already been created today.")
            : newSet(setName);
          return result;
        } else {
          newSet(setName);
        }
      });
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
        .ref("exercises/" + exerciseId + "/sets")
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
        .ref("exercises/" + exerciseId + "/sets")
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
        .ref("exercises/" + exerciseId + "/sets")
        .child(selectedSet.key)
        .remove();

      dispatch(removeSet(selectedSet));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const addSetImage = selectedSet => {
    navigation.navigate("Camera", {
      uid: uid,
      selectedSet: selectedSet,
      setIsFocused: setIsFocused,
      uri: selectedSet.image || null
    });
    setIsFocused(false);
  };

  const onUpdateSetName = text => {
    setNewSetName(text);
    text.length > 0
      ? setIsAddNewSetVisible(true)
      : setIsAddNewSetVisible(false);
    if (isSetNameInvalid) {
      onChangeSetNameError(false);
    }
  };

  const viewSet = selectedSet => {
    navigation.navigate("Set", {
      currentSet: selectedSet,
      setId: selectedSet.key
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
        onPress: () => deleteSet(item)
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
      <View key={"set-" + item.key}>
        <Swipeout
          autoClose={true}
          style={{ marginHorizontal: 5, marginVertical: 5 }}
          backgroundColor={colors.bgMain}
          right={swipeoutButtons}
        >
          <ListItem
            navPress={() => viewSet(item)}
            editable
            onPress={() => addSetImage(item)}
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
      </View>
    );
  };

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
            onChangeText={text => onUpdateSetName(text)}
            error={isSetNameInvalid}
            keyboardType="default"
            errorMessage={"Please enter a valid name."}
            value={newSetName}
            placeholder={"Name your next set"}
            placeholderTextColor={colors.bgTextInputDark}
          />
        </View>
        <FlatList
          data={sets}
          renderItem={renderItem}
          keyExtractor={item => item.key}
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
            onPress={() => createSet(newSetName)}
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
