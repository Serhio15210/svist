import React from 'react';
import {normalize} from "../../responsive/fontSize";
import Svg, {G, Path} from "react-native-svg";
import {Image, View} from "react-native";
import samokatWhite from "../../../assets/samokatWhite.png";
import AnimatedProgressWheel from "react-native-progress-wheel";
import Marker from "../../../assets/marker.svg"
import {useAuth} from "../../provider/AuthProvider";
const TrackingMarker = ({selectScooter,startRide,rideArea}) => {
  const areaColors = {
    'slow': '#FFD400',
    'danger': '#EF4E4E',
    'parking': '#3772FF',
    'none':"#FE7B01"
  }

  return (
    <View>
      <Marker width={normalize(82)} height={normalize(66)}/>

        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: normalize(50),
          height: normalize(50),
          position: 'absolute',
          left: normalize(16.7),
          top: normalize(2.5),

        }}>
          <View style={{
            backgroundColor: startRide ? areaColors[rideArea] : "#FE7B01",
            alignItems: 'center',
            justifyContent: 'center',
            width: normalize(40),
            height: normalize(40),
            borderRadius: 50,
            borderWidth: 1,
            borderColor: '#F7F7F7'
          }}>
            <Image source={samokatWhite} style={{
              width: normalize(23),
              height: normalize(18),
            }}/>
          </View>

          {selectScooter?.battery_current_level&&<View style={{position: 'absolute', transform: [{rotate: "250deg"}]}}>
            <AnimatedProgressWheel
              size={normalize(49)}
              width={5}
              color={selectScooter?.battery_current_level < 26 ? "red" : selectScooter?.battery_current_level < 56 && selectScooter?.battery_current_level > 25 ? "yellow" : '#3AC26A'}
              progress={parseInt(selectScooter?.battery_current_level)}
              backgroundColor={"white"}
            />
          </View>}
        </View>

    </View>

  );
};

export default TrackingMarker;
