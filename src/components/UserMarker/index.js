import React from "react";
import Svg, { G, Path } from "react-native-svg";
import { Image, View } from "react-native";
import geolocationMarker from "../../../assets/geolocationMarker.png";
import {normalize} from "../../responsive/fontSize";
import UserMarkerr from "../../../assets/userMarker.svg"
const UserMarker = () => {
  return (
    <UserMarkerr width={normalize(50)} height={normalize(51)}/>
      // <View style={{alignItems:'center',justifyContent:'center'}}>
      //   <UserMarkerr width={normalize(50)} height={normalize(51)}/>
      //   <View  style={{position:'absolute',backgroundColor:'#FFE8D3',borderRadius:100,width:normalize(35),height:normalize(35),left:normalize(8.5),top:normalize(9)}}>
      //     <Image source={geolocationMarker} style={{width:normalize(22),height:normalize(28),position:'absolute',bottom:0,alignSelf:'center'}}/>
      //   </View>
      // </View>

  );
};

export default UserMarker;
