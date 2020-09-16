import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../assets/colors";
import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const ListItem = ({ item, children, marginVertical, editable, onPress }) => (
  <View style={[styles.listItemContainer, { marginVertical }]}>
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
          <Image source={require("../assets/icon.png")} style={styles.image} />
        )}
      </TouchableOpacity>
    </View>
    <View style={styles.workoutData}>
      <Text style={styles.listItemTitle}>{item.name}</Text>
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

ListItem.defaultProps = {
  marginVertical: 5,
  editable: false
};

export default ListItem;

const styles = StyleSheet.create({
  listItemContainer: {
    minHeight: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.listItemBg,
    alignItems: "center"
  },
  date: {
    fontWeight: "100",
    fontSize: 14,
    color: colors.txtWhite
  },
  workoutTimes: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 10
  },
  imageContainer: {
    height: 70,
    width: 70,
    marginLeft: 10
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    borderRadius: 35
  },
  workoutData: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 10
  },
  listItemTitle: {
    fontSize: 22,
    color: colors.txtWhite
  }
});
