import React from 'react';
import {Drawer, Navigation} from "../navigation/Navigation";
import {NavigationContainer} from "@react-navigation/native";
import {useAuth} from "../provider/AuthProvider";
import AuthNavigation from "../navigation/AuthNavigation";
import {Image, View} from "react-native";
import {normalize} from "../responsive/fontSize";

const NavigatorScreen = () => {
  const {isAuth,authToken,appToken}=useAuth()
  if(appToken === '') return <View style={{flex:1,backgroundColor: '#FE7B01',alignItems:'center',justifyContent:'center'}}>
    <Image source={require('../../assets/loadingAnimation.gif')} style={{height:normalize(150),width:normalize(250)}}/>
  </View>
  return (
    <NavigationContainer >
      {isAuth ? <Drawer /> : <AuthNavigation />}
    </NavigationContainer>
  );
};

export default NavigatorScreen;
