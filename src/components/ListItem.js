import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../assets/colors";
import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function ListItem(props) {
  const {
    children,
    editable,
    index,
    item,
    marginVertical,
    navPress,
    onPress,
    ...rest
  } = props;

  const ImageContainer = () => {
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          disabled={!editable}
          style={{ flex: 1 }}
          onPress={() => onPress(item)}
        >
          {item.image ? (
            <NetworkImage
              source={{ uri: item.image }}
              style={styles.image}
              indicator={() => (
                <AnimatedCircularProgress
                  size={70}
                  width={5}
                  fill={100}
                  tintColor={colors.logoColor}
                  backgroundColor={colors.bgMain}
                />
              )}
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: colors.logoColor,
                unfilledColor: "rgba(200,200,200,0.2)"
              }}
              imageStyle={{ borderRadius: 35 }}
            />
          ) : (
            <Image
              source={require("../assets/camera.png")}
              style={styles.image}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderDefault = () => {
    return (
      <View
        style={[styles.listItemContainer, { marginVertical }]}
        key={"item" + item.key}
      >
        <ImageContainer />
        <View style={styles.workoutData}>
          <TouchableOpacity onPress={() => navPress(item)}>
            <Text style={styles.listItemTitle}>{item.name}</Text>
          </TouchableOpacity>
          <View style={styles.workoutTimes}>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString("en-US")}
            </Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleTimeString("en-US")}
            </Text>
          </View>
        </View>
        {children}
      </View>
    );
  };

  const renderSet = () => {
    return (
      <View
        style={[styles.listItemContainer, { marginVertical }]}
        key={"set" + item.key}
      >
        <View style={styles.setData}>
          <Text style={styles.set}>Set {index + 1}</Text>
          <Text style={styles.set}>Reps: {item.reps}</Text>
          <Text style={styles.set}>Weight: {item.weight}</Text>
        </View>
        {children}
      </View>
    );
  };

  return typeof index !== "undefined" ? renderSet() : renderDefault();
}

ListItem.defaultProps = {
  marginVertical: 5,
  editable: false
};

const styles = StyleSheet.create({
  date: {
    color: colors.txtWhite,
    fontSize: 14,
    fontWeight: "100"
  },
  image: {
    borderRadius: 35,
    flex: 1,
    height: null,
    resizeMode: "contain",
    width: null
  },
  imageContainer: {
    height: 70,
    marginLeft: 10,
    width: 70
  },
  listItemContainer: {
    alignItems: "center",
    backgroundColor: colors.listItemBg,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 100
  },
  listItemTitle: {
    color: colors.txtWhite,
    fontSize: 22
  },
  set: {
    color: colors.txtWhite,
    fontSize: 22,
    paddingHorizontal: 10
  },
  setData: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  workoutData: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 10
  },
  workoutTimes: {
    alignItems: "flex-end",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingRight: 10
  }
});
