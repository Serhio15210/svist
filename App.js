import React, {useState} from 'react'
import { StatusBar } from 'expo-status-bar';
import {LogBox, StyleSheet, Text, View} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import ignoreWarnings from "ignore-warnings";
import AuthProvider from "./src/provider/AuthProvider";
import SvistProvider from "./src/provider/SvistProvider";
import NavigatorScreen from "./src/screens/NavigatorScreen";
import {bootstrap} from "./src/utils/bootstrap";
import AppLoading from "expo-app-loading";

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  ignoreWarnings('warn',['ViewPropTypes','[react-native-gesture-handler]'])


  LogBox.ignoreLogs([
    'ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from \'deprecated-react-native-prop-types\'.',
    'NativeBase: The contrast ratio of',
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ])
  if (isLoading) return <AppLoading startAsync={bootstrap} onFinish={() => setIsLoading(false)}
                                    onError={(err) => console.log(err)}/>
  return (
    <AuthProvider>
      <SvistProvider>
        <NavigatorScreen/>
      </SvistProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
