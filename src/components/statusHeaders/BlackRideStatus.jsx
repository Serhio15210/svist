import React from 'react';
import {styles} from "./statusHeaderStyle";
import {Text, View} from "react-native";
import ParkingZoneIcon from "../../../assets/parkingZoneIcon.svg";
import {normalize} from "../../responsive/fontSize";
import LowBattery from "../../../assets/lowBattery.svg";
import {useAuth} from "../../provider/AuthProvider";
import {BLACK_ZONE} from "../../../assets/polygonColors";

const BlackRideStatus = ({batteryLevel}) => {
  const {costSettings,i18n}=useAuth()
  return (
    <View style={{backgroundColor:BLACK_ZONE,...styles.header}}>
      <View style={styles.block}>
        {/*<MaterialCommunityIcons name={'map-marker-check'} style={{fontSize: normalize(24),color:'white'}}/>*/}
        <ParkingZoneIcon/>

        <Text style={styles.text}>{i18n.t('noRide')}</Text>
      </View>
      {parseInt(batteryLevel)<=costSettings?.lowPower&&<View style={styles.triangleCorner} />}
      {parseInt(batteryLevel)<=costSettings?.lowPower&&<View style={{backgroundColor:'#EF4E4E',alignItems:'center',justifyContent:'center',position:'absolute',right:0,borderTopRightRadius:25,padding:normalize(16),paddingBottom:normalize(40)}}>
        <LowBattery/>
      </View>}
    </View>
  );
};

export default BlackRideStatus;
