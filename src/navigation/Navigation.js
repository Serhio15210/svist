import * as React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {createDrawerNavigator, DrawerContent, DrawerContentScrollView} from "@react-navigation/drawer";
import MainScreen from "../screens/MainScreen";

import {useNavigation} from "@react-navigation/native";
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Logo from "../../assets/logo.svg"
import {normalize} from "../responsive/fontSize";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../provider/AuthProvider";
import {useEffect, useState} from "react";
import {getCurrentTrip, getDebts} from "../api/scooterApi";
import {useSvistContext} from "../provider/SvistProvider";
import ScannerScreen from "../screens/ScannerScreen";
import RideScreen from "../screens/RideScreen";
import CameraScreen from "../screens/CameraScreen";
import ResultScreen from "../screens/ResultScreen";
import AddNewCardScreen from "../screens/AddNewCardScreen";
import EndRideScreen from "../screens/EndRideScreen";
import {GT} from "../constants/fonts";
import DrawerContainer from "../components/DrawerContainer/DrawerContainer";
import DrawerMenuButton from "../components/DrawerMenuButton";
import MenuIcon from "../../assets/menuIcon.svg";
import DrawerMenu from "../../assets/drawerMenu.svg";
import {styles} from "../components/DrawerContainer/styles";
import DrawerLabel from "../../assets/drawerLabel.svg";

const Stack = createStackNavigator();
const Draw = createDrawerNavigator();

export const Drawer = ({navigation}) => {

  return (
    <Draw.Navigator  drawerContent={props => <>
      <View {...props}  style={{flex:1}} >

<DrawerContainer props={props}/>

    </View></>} screenOptions={{
      useNativeDriver: true,

    }} defaultStatus="closed">

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
    <Stack.Navigator initialRouteName={'MainScreen'}>
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
