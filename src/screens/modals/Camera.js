import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { useDispatch } from "react-redux";

import * as firebase from "firebase/app";
import "firebase/storage";

import { useNavigation } from "@react-navigation/native";

export default function Camera({ route }) {
  const { selectedWorkout, uid, setIsFocused, uri } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const [image, setImage] = useState();
  const [didSubmitError, setSubmitError] = useState(false);

  const uploadImage = async image => {
    const ref = firebase
      .storage()
      .ref("workouts")
      .child(selectedWorkout.key);

    try {
      //converting to blob
      const blob = await prepareBlob(image.uri);
      const snapshot = await ref.put(blob);

      let downloadUrl = await ref.getDownloadURL();

      await firebase
        .database()
        .ref("users/" + uid + "/workouts")
        .child(selectedWorkout.key)
        .update({ image: downloadUrl });

      blob.close();

      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const prepareBlob = async imageUri => {
    const blob = await new Promise((resolve, reject) => {
      //new request
      const xml = new XMLHttpRequest();

      //success resolved it
      xml.onload = function() {
        resolve(xml.response);
      };

      //error threw new error
      xml.onerror = function(e) {
        console.log(e);
        reject(new TypeError("Image Upload failed"));
      };

      //set the response type to get the blob
      xml.responseType = "blob";
      xml.open("GET", imageUri, true);
      //send the request
      xml.send();
    });

    return blob;
  };

  const openImageLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permission to select an image");
      return false;
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true
      });

      return !result.cancelled ? result : false;
    }
  };

  const openCamera = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
      Permissions.CAMERA
    );

    if (status !== "granted") {
      alert(
        "Sorry, we need camera roll & camera permission to select an image"
      );
      return false;
    } else {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.1,
        base64: true,
        allowsEditing: Platform.OS == "ios" ? false : true,
        aspect: [4, 3]
      });

      return !result.cancelled ? result : false;
    }
  };

  const launchCameraRoll = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.1
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const result = await openCamera();

    if (result) {
      //   setIsLoading(true);
      const downloadUrl = await uploadImage(result);
      dispatch(updateWorkoutImage({ uri: downloadUrl }));
      //   setIsLoading(false);
    }
  };

  const choosePhoto = async () => {
    const result = await openImageLibrary();

    if (result) {
      const downloadUrl = await uploadImage(result);
      dispatch(updateWorkoutImage({ uri: downloadUrl }));
    }
  };
  return (
    <TouchableWithoutFeedback accessible={false}>
      <SafeAreaView style={styles.container}>
        {isFetching && (
          <ActivityIndicator style={styles.fetching} size="large" />
        )}
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          onPress={() => {
            setIsFocused(false);
            navigation.goBack();
          }}
          style={styles.closeButton}
        >
          <Image
            style={styles.icon}
            source={require("../../assets/close-modal.png")}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Add A Photo</Text>
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Choose From Camera Roll" onPress={choosePhoto} />
        <Image style={styles.image} source={{ uri: uri }} />
        <Text style={styles.errorMessage}>
          {didSubmitError &&
            "Photo could not be saved at this time, please try again later."}
        </Text>
        <Button title="Submit" onPress={() => uploadImage(image)} />
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    right: 20,
    top: 50
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingTop: 15
  },
  errorMessage: {
    color: "red",
    paddingHorizontal: 20,
    textAlign: "center"
  },
  fetching: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1
  },
  header: {
    fontSize: 20
  },
  icon: {
    height: 20,
    resizeMode: "contain",
    width: 20
  },
  image: {
    borderRadius: 4,
    height: 200,
    marginVertical: 10,
    width: 200
  }
});
