// import messaging from '@react-native-firebase/messaging';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {safeFirebaseToken} from "../api/authApi";
import axios from "axios";
import {BASE_URL} from "../api/apiKeys";
import {Alert} from "react-native";

// export async function requestUserPermission(token) {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//
//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//     getFCMToken(token)
//   }
// }

// const getFCMToken=(authToken)=> {
//
//   AsyncStorage.getItem('fcmtoken').then( token => {
//
//     if (!token) {
//       messaging().getToken().then(fcmtoken=>{
//         AsyncStorage.setItem('fcmtoken',fcmtoken)
//         safeFirebaseToken(fcmtoken,authToken).then(res=>{
//           console.log(res)
//         })
//       })
//     }else
//       safeFirebaseToken(token,authToken).then(res=> {
//         console.log(res)
//       })
//
//   })
// }

// const NotificationListener=()=>{
// messaging().onNotificationOpenedApp(remoteMessage=>{
//   console.log('notification app', remoteMessage.notification)
// })
//   messaging().getInitialNotification().then(remoteMessage=>{
//     if (remoteMessage){
//       console.log('notification app open',remoteMessage.notification)
//     }
//   })
// }