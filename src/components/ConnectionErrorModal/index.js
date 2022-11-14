import React from "react";
import {useNavigation} from "@react-navigation/native";
import {Text, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {styles} from "./styles";
import ErrorConnectionBlock from "../../../assets/errorConnectionBlock.svg"
import {useAuth} from "../../provider/AuthProvider";

const ConnectionErrorModal = ({setIsOpen, isOpen}) => {
  const navigation=useNavigation()
  const {i18n}=useAuth()
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
      <Text style={styles.title}>{i18n.t('connectionError')}</Text>
    </View>
  );
};


export default ConnectionErrorModal;
