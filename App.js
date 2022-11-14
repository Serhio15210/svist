import React, {useEffect, useRef, useState} from 'react'

import {LogBox, StyleSheet} from 'react-native';
import ignoreWarnings from "ignore-warnings";
import AuthProvider from "./src/provider/AuthProvider";
import SvistProvider from "./src/provider/SvistProvider";
import NavigatorScreen from "./src/screens/NavigatorScreen";
import {bootstrap} from "./src/utils/bootstrap";
import AppLoading from "expo-app-loading";
import * as Notifications from "expo-notifications";

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  ignoreWarnings('warn',['ViewPropTypes','[react-native-gesture-handler]'])
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  // Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowAlert: true,
  //     shouldPlaySound: false,
  //     shouldSetBadge: false,
  //   }),
  // });
  // useEffect(async () => {
  //   const token = (await Notifications.getDevicePushTokenAsync()).data;
  //   console.log('tok',token)
  // },[])

  if (isLoading) return <AppLoading startAsync={bootstrap} onFinish={() => setIsLoading(false)}
                                    onError={(err) => console.log(err)}/>
  // messaging().setBackgroundMessageHandler(async remoteMessage=>{
  //   console.log('message',remoteMessage)
  //
  // })
  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  //
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });
  //
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });
  //
  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);
  // async function registerForPushNotificationsAsync() {
  //   let token;
  //
  //   if (Platform.OS === 'android') {
  //     await Notifications.setNotificationChannelAsync('default', {
  //       name: 'default',
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: '#FF231F7C',
  //     });
  //   }
  //
  //   if (Device.isDevice) {
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //     console.log(token);
  //     AsyncStorage.getItem('auth').then(res => {
  //       if (res) {
  //         safeFirebaseToken(token,res)
  //       }
  //       })
  //
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }
  //
  //   return token;
  // }
  return (
    <AuthProvider>
      <SvistProvider>
        {/*<StatusBar hidden />*/}
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
