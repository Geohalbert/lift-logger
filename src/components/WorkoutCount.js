import React from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";

const WorkoutCount = ({ title, count }) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text style={{ fontSize: 20 }}>{count}</Text>
    <Text>{title}</Text>
  </View>
);

WorkoutCount.propTypes = {
  count: PropTypes.number,
  title: PropTypes.string
};

WorkoutCount.defaultProps = {
  title: "Title"
};

export default WorkoutCount;
