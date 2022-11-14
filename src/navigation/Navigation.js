import * as React from 'react';
import {useState} from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import MainScreen from "../screens/MainScreen";
import {View} from "react-native";
import {normalize} from "../responsive/fontSize";
import ScannerScreen from "../screens/ScannerScreen";
import RideScreen from "../screens/RideScreen";
import CameraScreen from "../screens/CameraScreen";
import ResultScreen from "../screens/ResultScreen";
import AddNewCardScreen from "../screens/AddNewCardScreen";
import EndRideScreen from "../screens/EndRideScreen";
import DrawerContainer from "../components/DrawerContainer/DrawerContainer";

const Stack = createStackNavigator();
const Draw = createDrawerNavigator();

export const Drawer = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Home');
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });
  //
  //   return unsubscribe;
  // }, []);
  return (
    <Draw.Navigator  drawerContent={props => <>
      <View {...props}  style={{flex:1}} >

<DrawerContainer props={props}/>

    </View></>} screenOptions={{
      useNativeDriver: true,


    }} defaultStatus="closed" >

      <Draw.Screen name="MainRoot" component={Navigation}
                   options={{
                     headerShown: false,
                     useNativeDriver: true,
                     title: '',
                     headerStyle: {
                       backgroundColor: 'white',
                       elevation: 0,
                       width: normalize(97),
                       marginTop: 48,
                       height: 48,
                       paddingLeft: 30,
                       position: 'absolute',
                       zIndex: 100,
                       top: 0,
                       left: 0
                     }
                   }}/>

    </Draw.Navigator>
  );
}

export const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName={'MainScreen'} screenOptions={{
    }}>
      <Stack.Screen name="MainScreen" component={MainScreen} options={{headerShown: false}}/>
      <Stack.Screen name="ScannerScreen" component={ScannerScreen} options={{headerShown: false}}/>
      <Stack.Screen name="RideScreen" component={RideScreen} options={{headerShown: false}}/>
      <Stack.Screen name="EndRideScreen" component={EndRideScreen} options={{headerShown: false}}/>
      <Stack.Screen name="CameraScreen" component={CameraScreen} options={{headerShown: false}}/>
      <Stack.Screen name="ResultScreen" component={ResultScreen} options={{headerShown: false}}/>
      <Stack.Screen name="AddNewCardScreen" component={AddNewCardScreen} options={{headerShown: false}}/>

    </Stack.Navigator>
  );
};

export default Navigation;
