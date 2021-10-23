import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import {
  getDailyReminderValue,
  getMetricMetaInfo,
  timeToString,
} from "../utils/helpers";
import UdaciSlider from "./UdaciSlider";
import UdaciStepper from "./UdaciStepper";
import DateHeader from "./DateHeader";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "./TextButton";
import { SubmitEntry, removeEntry } from "../utils/api";
import { addEntry } from "../actions";
import { connect } from "react-redux";
import { purple, white } from "../utils/colors";
import { NavigationActions } from "react-navigation";
import { clearLocalNotification, setLocalNotification } from "../utils/helpers";

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.androidSubmitbtn
      }
    >
      <Text style={{ color: "white" }}>SUBMIT</Text>
    </TouchableOpacity>
  );
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 10,
    swim: 0,
    sleep: 10,
    eat: 0,
  };

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((state) => {
      const count = state[metric] + step;

      return {
        ...state,
        [metric]: count > max ? max : count,
      };
    });
  };
  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);

    this.setState((state) => {
      const count = state[metric] - step;

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      };
    });
  };

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value,
    }));
  };

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    this.props.dispatch(
      addEntry({
        [key]: entry,
      })
    );

    // update Redux
    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }));

    // Navigate to home
    this.toHome();

    // Save to 'db'
    SubmitEntry({ key, entry });
    clearLocalNotification().then(setLocalNotification);
    // Clear local notification
  };

  reset = () => {
    const key = timeToString();

    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );

    // Update redux

    // Route to Home
    this.toHome();

    removeEntry(key);
  };

  toHome = () => {
    this.props.navigation.dispatch(
      NavigationActions.back({
        key: "AddEntry",
      })
    );
  };

  render() {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-happy-outline" : "md-happy"}
            size={100}
          />
          <Text>you already logged your information for today</Text>
          <TextButton style={{ padding: 10 }} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === "slider" ? (
                <UdaciSlider
                  value={value}
                  onChange={(value) => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <UdaciStepper
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    height: 45,
    padding: 10,
    borderRadius: 7,
    paddingLeft: 40,
    paddingRight: 40,
  },
  androidSubmitbtn: {
    backgroundColor: purple,
    height: 45,
    padding: 10,
    borderRadius: 2,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
  },
});

function mapStateToProps(state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === "undefined",
  };
}

export default connect(mapStateToProps)(AddEntry);
