import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import ModalHeader from "../../../assets/modalHeader.svg";
import ModalButton from "../../../assets/modalButton.svg";
import HowToParkLogo from "../../../assets/howToParkLogo.svg";
import {styles} from "./styles";
const HowToParkModal = ({setIsOpen, isOpen}) => {
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
                   style={{position: 'absolute', top: 30, right: 20, fontSize: normalize(24), color: 'white'}}
                   onPress={() => setIsOpen(false)}/>
        <View style={styles.modalBlock}>
          <View style={styles.logoBlock}>
            <ModalHeader width={normalize(58)} height={normalize(48)}/>
            <HowToParkLogo style={{position: 'absolute'}}/>
          </View>

          <Text style={styles.title}>How to park</Text>
          <Text style={styles.text} adjustsFontSizeToFit={true}>We're committed to keeping the city lean and tidy. We
            ask you to do the same and verify it by taking a photo of your parking. Don't block pathways, entrances, or
            bike lanes. Try to park near bike racks or designated parking areas painted on the street. Frequent
            violation of our parking guidelines we result in an extra charge or even deactivation of your
            account.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsOpen(false)}>
            <ModalButton width={normalize(326)} height={normalize(56)}/>
            <Text style={styles.buttonText}>I understand</Text>


          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default HowToParkModal;
