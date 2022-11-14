import React from "react";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import ModalHeader from "../../../assets/modalHeader.svg";
import ModalButton from "../../../assets/modalButton.svg";
import {styles} from "./styles";
import * as Location from "expo-location";
import CloseIcon from "../../../assets/closeIcon.svg"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../../provider/AuthProvider";
import CloseButton from "../CloseButton";
const LocationErrorModal = ({setIsOpen, isOpen, getLocation}) => {
  const {i18n}=useAuth()
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(!isOpen);
      }}>
      <View style={styles.container}>
        <CloseButton onPress={() => setIsOpen(false)}/>
        <View style={styles.modalBlock}>
          <View style={styles.logoBlock}>
            <ModalHeader width={normalize(58)} height={normalize(48)}/>
            <MaterialIcons name={'gps-off'} style={{fontSize: normalize(24), color: 'white', position: 'absolute'}}/>
          </View>

          <Text style={styles.title}>{i18n.t('turnOnLocation')}</Text>
          <Text style={styles.text}>{i18n.t('withoutLocation')}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={ () => {
              Location.requestForegroundPermissionsAsync().then(status=>{
                setIsOpen(false)
                getLocation()
              })

            }}>
            <ModalButton width={'100%'} height={normalize(56)}/>
            <Text style={styles.buttonText}>{i18n.t('iUnderstand')}</Text>

          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default LocationErrorModal;
