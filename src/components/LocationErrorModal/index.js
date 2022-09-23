import React from "react";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import ModalHeader from "../../../assets/modalHeader.svg";
import ModalButton from "../../../assets/modalButton.svg";
import {styles} from "./styles";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LocationErrorModal = ({setIsOpen, isOpen, getLocation}) => {
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
            <MaterialIcons name={'gps-off'} style={{fontSize: normalize(24), color: 'white', position: 'absolute'}}/>
          </View>

          <Text style={styles.title}>Turn on your location</Text>
          <Text style={styles.text}>Without active geolocation functional applications will not be complete</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={ () => {
              Location.requestForegroundPermissionsAsync().then(status=>{
                console.log('lof',status)
                setIsOpen(false)
                getLocation()
              })

            }}>
            <ModalButton width={'100%'} height={normalize(56)}/>
            <Text style={styles.buttonText}>Rozumiem</Text>

          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default LocationErrorModal;
