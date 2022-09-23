import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import ModalHeader from "../../../assets/modalHeader.svg";
import Feather from "react-native-vector-icons/Feather";
import ModalButton from "../../../assets/modalButton.svg";
import {styles} from "./styles";
const FirstPauseModal = ({setIsOpen, isOpen}) => {
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
            <Feather name={'pause'} style={{fontSize: normalize(24), color: 'white', position: 'absolute'}}/>
          </View>
          <Text style={styles.title}>Pozastavit jazdu?</Text>
          <Text style={styles.text}>Pozastavenie jazdy dočasne zamkne vozidlo takže budeš mocť pokračovať v jazde
            neskor. Sadzba za pauzu je aplikovaná po dobu uzamknutia.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsOpen(false)}>
            <ModalButton width={normalize(326)} height={normalize(56)}/>
            <Text style={styles.buttonText}>Dočasne uzamknúť</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default FirstPauseModal;
