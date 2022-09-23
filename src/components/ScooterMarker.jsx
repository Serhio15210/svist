import React from 'react';
import {normalize} from "../responsive/fontSize";
import Svg, {G, Path} from "react-native-svg";
import {Image, View} from "react-native";
import samokatWhite from "../../assets/samokatWhite.png";
import samokat from "../../assets/samokat.png";
import AnimatedProgressWheel from "react-native-progress-wheel";
import Marker from "../../assets/marker.svg"
const ScooterMarker = ({selectMarker,item}) => {
  return (
    <View>
       <Marker width={selectMarker?.scooter_id === item?.scooter_id ? normalize(82) : normalize(55)}
               height={selectMarker?.scooter_id === item?.scooter_id ? normalize(66) : normalize(65)}/>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: normalize(50),
          height: normalize(50),
          position: 'absolute',
          left: selectMarker?.scooter_id === item?.scooter_id ? normalize(16.5) : normalize(4),
          top: selectMarker?.scooter_id === item?.scooter_id ? normalize(2.5) : normalize(1.5)
        }}>
          <View style={{
            backgroundColor: selectMarker?.scooter_id === item?.scooter_id ? "#FE7B01" : "white",
            alignItems: 'center',
            justifyContent: 'center',
            width: selectMarker?.scooter_id === item?.scooter_id ? normalize(42) : normalize(38),
            height: selectMarker?.scooter_id === item?.scooter_id ? normalize(42) : normalize(38),
            borderRadius: 50,
            borderWidth: 1,
            borderColor: '#F7F7F7'
          }}>
            <Image source={selectMarker?.scooter_id === item?.scooter_id ? samokatWhite : samokat} style={{
              width: normalize(23),
              height: normalize(18),
            }}/>
          </View>

          <View style={{position: 'absolute', transform: [{rotate: "250deg"}]}}>
            <AnimatedProgressWheel
              size={selectMarker?.scooter_id === item?.scooter_id ? normalize(49) : normalize(48)}
              width={5}
              color={item?.battery_power < 25 ? "red" : item?.battery_power < 50 && item?.battery_power > 25 ? "yellow" : '#3AC26A'}
              progress={item?.battery_power}
              backgroundColor={"white"}
            />
          </View>
        </View>

    </View>

  );
};

export default ScooterMarker;
