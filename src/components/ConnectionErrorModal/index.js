import React from "react";
import {useNavigation} from "@react-navigation/native";
import {Modal, StyleSheet, Text, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import {styles} from "./styles";
import ErrorConnectionBlock from "../../../assets/errorConnectionBlock.svg"
const ConnectionErrorModal = ({setIsOpen, isOpen}) => {
  const navigation=useNavigation()
  return (
    // <Modal
    //   transparent={true}
    //   visible={isOpen}
    //   onRequestClose={() => {
    //     setIsOpen(!isOpen);
    //   }} >
    //
    //   <View style={styles.modalBlock}>
    //     <AntDesign name={'closesquareo'} style={{position:'absolute',top:30,right:20,fontSize: normalize(24),color:'white'}} onPress={()=>setIsOpen(false)}/>
    //       <Text style={styles.title}>Connection lost. Try again.</Text>
    //   </View>
    //
    // </Modal>
    <View style={{alignItems:'center',justifyContent:'center',position:'absolute',zIndex:100,top:normalize(40),right:normalize(24)}}>
      <ErrorConnectionBlock width={normalize(282)} height={normalize(55)}/>
      <Text style={styles.title}>Connection lost. Try again.</Text>
    </View>
  );
};


export default ConnectionErrorModal;
