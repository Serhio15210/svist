import React from 'react';
import Marker from "../../assets/marker.svg";
import {normalize} from "../responsive/fontSize";
import {Image, View,Text} from "react-native";
import samokatWhite from "../../assets/samokatWhite.png";
import samokat from "../../assets/samokat.png";
import AnimatedProgressWheel from "react-native-progress-wheel";

const OutlineMarker = ({selectMarker,item,selected}) => {
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
          backgroundColor: "white",
          alignItems: 'center',
          justifyContent: 'center',
          width: normalize(38),
          height: normalize(38),
          borderRadius: 50,
          borderWidth: 1,
          borderColor: '#F7F7F7'
        }}>
          <Image source={samokat} style={{
            width: normalize(23),
            height: normalize(18),
          }}/>
          {/*<Text>{item?.battery_power}</Text>*/}
        </View>

        <View style={{position: 'absolute', transform: [{rotate: "268deg"}]}}>
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

export default React.memo(OutlineMarker);
