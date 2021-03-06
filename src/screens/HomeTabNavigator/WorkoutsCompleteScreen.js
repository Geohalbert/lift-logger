import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from "react-native";
import colors from "../../assets/colors";
import ListItem from "../../components/ListItem";
import { connect } from "react-redux";
import ListEmptyComponent from "../../components/ListEmptyComponent";
class WorkoutsCompleteScreen extends Component {
  renderItem = item => {
    return <ListItem item={item} />;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.workouts.isLoadingWorkouts && (
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
        <FlatList
          data={this.props.workouts.workoutsComplete}
          renderItem={({ item }, index) => this.renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            !this.props.workouts.isLoadingWorkouts && (
              <ListEmptyComponent text="No Workouts Read" />
            )
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    workouts: state.workouts
  };
};

export default connect(mapStateToProps)(WorkoutsCompleteScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain
  }
});
