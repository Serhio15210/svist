import React from 'react';
import {Modal, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import ModalHeader from "../../../assets/modalHeader.svg";
import {normalize} from "../../responsive/fontSize";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ModalButton from "../../../assets/modalButton.svg";
import {styles} from "./styles"
const ErrorModal = ({setIsOpen, isOpen,errorText}) => {
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

          <Text style={styles.title}>Error</Text>
           <Text style={styles.text}>{errorText||''}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsOpen(false)
            }}>
            <ModalButton width={'100%'} height={normalize(56)}/>
            <Text style={styles.buttonText}>Close</Text>

          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;
