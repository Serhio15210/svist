import React from "react";
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import scan from "../../../assets/scan.png"
import ModalHeader from "../../../assets/modalHeader.svg"
import ModalButton from "../../../assets/modalButton.svg"
import {styles} from "./styles";
const ScanErrorModal = ({setIsOpen, isOpen}) => {
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
          <View style={styles.logoBlock}>
            <ModalHeader width={normalize(58)} height={normalize(48)}/>
            <Image source={scan} style={{width: normalize(24), height: normalize(24), position: 'absolute'}}/>
          </View>
          <Text style={styles.title}>Scan error. Please try again.</Text>
          <TouchableOpacity style={styles.button}
                            onPress={() => setIsOpen(false)}>
            <ModalButton width={normalize(326)} height={normalize(56)}/>
            <Text style={styles.buttonText}>Continue</Text>


          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default ScanErrorModal;
