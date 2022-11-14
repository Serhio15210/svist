import React from 'react';
import {normalize} from "../../responsive/fontSize";
import {Text, View} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import {styles} from "./statusHeaderStyle"
import LowBattery from "../../../assets/lowBattery.svg";
import {useAuth} from "../../provider/AuthProvider";
const DangerRideStatus = ({batteryLevel}) => {
  const {costSettings,i18n}=useAuth()
    return (
        <View  style={{...styles.header,backgroundColor: '#EF4E4E'}}>
            <View style={styles.block}>
                <AntDesign name={'infocirlceo'} style={{fontSize: normalize(24),color:'white'}}/>
                <Text style={styles.text}>{i18n.t('dangerDriving')}</Text>
            </View>
          {parseInt(batteryLevel)<=costSettings?.lowPower&&<View style={styles.triangleCorner} />}
          {parseInt(batteryLevel)<=costSettings?.lowPower&&<View style={{backgroundColor:'#EF4E4E',alignItems:'center',justifyContent:'center',position:'absolute',right:0,borderTopRightRadius:25,padding:normalize(16),paddingBottom:normalize(40)}}>
            <LowBattery/>
          </View>}
        </View>
    );
};

export default DangerRideStatus;
