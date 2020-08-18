import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { connect } from "react-redux";
import colors from "../../assets/colors";
import PropTypes from "prop-types";
const WorkoutsCountContainer = ({ color, type, ...props }) => (
  <View style={styles.container}>
    <Text style={{ color: color }}>
      {props.workouts[type] !== undefined ? props.workouts[type].length : 0}
    </Text>
  </View>
);

const mapStateToProps = state => {
  return {
    workouts: state.workouts
  };
};

WorkoutsCountContainer.defaultProps = {
  color: colors.txtPlaceholder
};

WorkoutsCountContainer.propTypes = {
  color: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(WorkoutsCountContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
