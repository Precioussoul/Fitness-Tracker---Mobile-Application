import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { white } from "../utils/colors";
import MetricCard from "./MetricCard";
import { removeEntry } from "../utils/api";
import { timeToString, getDailyReminderValue } from "../utils/helpers";
import { addEntry } from "../actions";
import TextButton from "./TextButton";

class EntryDetail extends Component {
  //   navigationOptions
  static navigationOptions = ({ navigation }) => {
    const { entryId } = navigation.state.params;

    const year = entryId.slice(0, 4);
    const month = entryId.slice(5, 7);
    const day = entryId.slice(8);

    return {
      title: `${month}/${day}/${year}`,
    };
  };

  //  ends here

  reset = () => {
    const { remove, goBack, entryId } = this.props;

    remove(), goBack(), removeEntry(entryId);
  };

  //  shouldComponentUpdate

  shouldComponentUpdate(nextProps) {
    return nextProps.metrics !== null && !nextProps.metrics.today;
  }

  // ends here

  render() {
    const { metrics } = this.props;
    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
        <TextButton onPress={this.reset} style={{ margin: 20 }}>
          RESET
        </TextButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  },
});

function mapStateToProps(entries, { navigation }) {
  const { entryId } = navigation.state.params;

  return {
    entryId,
    metrics: entries[entryId],
  };
}

function mapDispatchToProps(dispatch, { navigation }) {
  const { entryId } = navigation.state.params;

  return {
    remove: () =>
      dispatch(
        addEntry({
          [entryId]:
            timeToString() === entryId ? getDailyReminderValue() : null,
        })
      ),
    goBack: () => navigation.goBack(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);
