import React from 'react';
import {normalize} from "../../responsive/fontSize";
import {Text, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import {styles} from "./statusHeaderStyle";
import LowBattery from "../../../assets/lowBattery.svg"
import {Path, Svg} from "react-native-svg";
import {useAuth} from "../../provider/AuthProvider";

const RideStatus = ({batteryLevel}) => {
  const {costSettings}=useAuth()
    return (
        <View style={{backgroundColor:'#02C775',...styles.header}}>
            <View style={styles.block}>
                {/*<Feather name={'pause'} style={{fontSize: normalize(24),color:'white'}}/>*/}
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M21.0001 19.11V4.89C21.0001 3.54 20.4301 3 18.9901 3H15.3601C13.9301 3 13.3501 3.54 13.3501 4.89V19.11C13.3501 20.46 13.9201 21 15.3601 21H18.9901C20.4301 21 21.0001 20.46 21.0001 19.11Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </Svg>

              <Text style={styles.text}>Active ride</Text>
            </View>
          {parseInt(batteryLevel)<=costSettings?.lowPower&&<View style={styles.triangleCorner} />}
          {parseInt(batteryLevel)<=costSettings?.lowPower&&<View style={{backgroundColor:'#EF4E4E',alignItems:'center',justifyContent:'center',position:'absolute',right:0,borderTopRightRadius:25,padding:normalize(16),paddingBottom:normalize(40)}}>
            <LowBattery/>
          </View>}
        </View>
    );
};

export default RideStatus;
