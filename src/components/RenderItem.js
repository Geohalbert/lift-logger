import React from "react";
import { Text, View } from "react-native";
import Swipeout from "react-native-swipeout";
import ListItem from "./ListItem";
import { Ionicons } from "@expo/vector-icons";

import colors from "../assets/colors";

export default function RenderItem(props) {
  const {
    addImage,
    deleteFunction,
    index,
    item,
    markItemFunction,
    navFunction,
    type,
    unmarkItemFunction,
    ...rest
  } = props;

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
      onPress: () => deleteFunction(item)
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
      onPress: () => markItemFunction(item)
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
      onPress: () => unmarkItemFunction(item)
    });
  }

  return (
    <View key={type + "-" + item.key}>
      <Swipeout
        autoClose={true}
        style={{ marginHorizontal: 5, marginVertical: 5 }}
        backgroundColor={colors.bgMain}
        right={swipeoutButtons}
      >
        <ListItem
          navPress={() => navFunction(item)}
          editable
          onPress={() => addImage(item)}
          editable={true}
          marginVertical={0}
          item={item}
          index={index}
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
}
