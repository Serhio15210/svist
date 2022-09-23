import React from 'react';
import {normalize} from "../../responsive/fontSize";
import {StyleSheet, Text, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {styles} from "./statusHeaderStyle"
const ConnectionErrorStatus = () => {
  return (
    <View style={{...styles.header,backgroundColor: '#EF4E4E'}}>
      <View style={styles.block}>
        <AntDesign name={'wifi'} style={{fontSize: normalize(24), color: 'white'}}/>
        <Text style={styles.text}>Connection error</Text>
      </View>
    </View>
  );
};

export default ConnectionErrorStatus;
