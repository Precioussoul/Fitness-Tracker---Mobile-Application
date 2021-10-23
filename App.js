import React from "react";
import { View, StatusBar } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducers";
import TabNavigation from "./components/TabNavigation";
import Constants from "expo-constants";
import { purple, white } from "./utils/colors";
import EntryDetail from "./components/EntryDetail";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { setLocalNotification } from "./utils/helpers";

function UdaciStatusbar({ bgColor, StatusBarStyle }) {
  return (
    <View
      style={{ backgroundColor: bgColor, height: Constants.statusBarHeight }}
    >
      <StatusBar
        translucent
        backgroundColor={bgColor}
        barStyle={StatusBarStyle}
      />
    </View>
  );
}

const Stack = createStackNavigator({
  Home: {
    screen: TabNavigation,
    navigationOptions: {
      header: null,
    },
  },
  EntryDetail: {
    screen: EntryDetail,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple,
      },
    },
  },
});

const MainNavigation = createAppContainer(createSwitchNavigator({ Stack }));

// redux store
const store = createStore(reducer);
class App extends React.Component {
  componentDidMount() {
    setLocalNotification();
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <UdaciStatusbar bgColor={purple} barStyle="light-content" />
          <MainNavigation />
        </View>
      </Provider>
    );
  }
}

export default App;
