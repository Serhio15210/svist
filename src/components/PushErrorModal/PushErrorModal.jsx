import React from 'react';
import {Modal, Text, TouchableOpacity, View} from "react-native";
import {styles} from "./styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import ModalHeader from "../../../assets/modalHeader.svg";
import {normalize} from "../../responsive/fontSize";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ModalButton from "../../../assets/modalButton.svg";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSvistContext} from "../../provider/SvistProvider";
import moment from "moment";

const PushErrorModal = ({setIsOpen, isOpen,pushError,setPushError,endRide}) => {
  const navigation=useNavigation()
  const {setSelectScooter,selectScooter}=useSvistContext()
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(!isOpen);
      }}>
      <View style={styles.container}>
        <AntDesign name={'closesquareo'}
                   style={{position: 'absolute', top: 30, right: 20, fontSize: 24, color: 'white'}}
                   onPress={() => setIsOpen(false)}/>
        <View style={styles.modalBlock}>
          {/*<View style={styles.logoBlock}>*/}
          {/*  <ModalHeader width={normalize(58)} height={normalize(48)}/>*/}
          {/*  <MaterialIcons name={'gps-off'} style={{fontSize: normalize(24), color: 'white', position: 'absolute'}}/>*/}
          {/*</View>*/}
          <Text style={styles.title}>{pushError.title}</Text>
          <Text style={styles.text}>{pushError.text}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (endRide){
                setPushError({text:'',title:''})
                setIsOpen(false)
                setSelectScooter({...selectScooter,endTime:`${moment(new Date()).format('DD.MM.YYYY')},${new Date().getHours()}:${new Date().getMinutes()}`})
                AsyncStorage.removeItem('reservation')
                navigation.reset({
                  index: 0,
                  routes: [{name: 'EndRideScreen'}],
                })
              }
              setPushError({text:'',title:''})
              setIsOpen(false)
            }}>
            <ModalButton width={'100%'} height={normalize(56)}/>
            <Text style={styles.buttonText}>Continue</Text>

          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default PushErrorModal;
