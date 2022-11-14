import React from 'react';
import {normalize} from "../responsive/fontSize";
import Svg, {G, Path} from "react-native-svg";
import {Image, View} from "react-native";
import samokatWhite from "../../assets/samokatWhite.png";
import ScooterWhite from "../../assets/scooterWhite.svg";
import AnimatedProgressWheel from "react-native-progress-wheel";
import Marker from "../../assets/marker.svg"
const ScooterMarker = ({selectMarker,item,selected}) => {
  return (
    <View>
      <Marker width={normalize(55)}
              height={normalize(65)}/>
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(50),
        height: normalize(50),
        position: 'absolute',
        left: normalize(3),
        top: normalize(1.3)
      }}>
        <View style={{
          backgroundColor: "#FE7B01",
          alignItems: 'center',
          justifyContent: 'center',
          width: normalize(38),
          height: normalize(38),
          borderRadius: 50,
          borderWidth: 1,
          borderColor: '#DEDEDE'
        }}>
          <ScooterWhite width={normalize(23)} height={normalize(18)} />
        </View>
        <View style={{
          position: 'absolute',
          top:normalize(3),

          zIndex:1000,
          right:normalize(24),
          width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderStyle: "solid",
          borderRightWidth: normalize(5),
          borderTopWidth: normalize(7.5),
          borderRightColor: "transparent",
          borderTopColor: item?.battery_power < 25||parseInt(item?.battery_current_level)<25 ? "red" : (item?.battery_power < 50 && item?.battery_power >= 25||parseInt(item?.battery_current_level)<50&&parseInt(item?.battery_current_level)>=25) ? "yellow" : '#3AC26A'}}/>
        <View style={{position: 'absolute', transform: [{rotate: "268deg"}] }}>

          <AnimatedProgressWheel
            size={normalize(48)}
            width={5}
            color={item?.battery_power < 25||parseInt(item?.battery_current_level)<25 ? "red" : (item?.battery_power < 50 && item?.battery_power >= 25||parseInt(item?.battery_current_level)<50&&parseInt(item?.battery_current_level)>=25) ? "yellow" : '#3AC26A'}
            progress={item?.battery_power||parseInt(item?.battery_current_level)||item?.battery_level}
            backgroundColor={"white"}

          />
        </View>
      </View>

    </View>

  );
};

export default  React.memo(ScooterMarker) ;
