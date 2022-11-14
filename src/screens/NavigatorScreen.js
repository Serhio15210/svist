import React, {useEffect, useState} from 'react';
import {Drawer, Navigation} from "../navigation/Navigation";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import {useAuth} from "../provider/AuthProvider";
import AuthNavigation from "../navigation/AuthNavigation";
import {Image, View} from "react-native";
import {normalize} from "../responsive/fontSize";
// import messaging from "@react-native-firebase/messaging";

const NavigatorScreen = () => {
  const {isAuth,authToken,appToken}=useAuth()

  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Home');

  if(appToken === '') return <View style={{flex:1,backgroundColor: '#FE7B01',alignItems:'center',justifyContent:'center'}}>
    <Image source={require('../../assets/loadingAnimation.gif')} style={{height:normalize(150),width:normalize(250)}}/>
  </View>

  return (
    <NavigationContainer linking={{
      prefixes: ['example://'],
      config: {
        screens: {
          Notifications: 'notifications',
        },
      },
    }}>
      {isAuth ? <Drawer /> : <AuthNavigation />}
    </NavigationContainer>
  );
};

export default NavigatorScreen;
