import React from 'react';
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import ModalHeader from "../../../assets/modalHeader.svg";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ModalButton from "../../../assets/modalButton.svg";
import parkingZone from "../../../assets/parkingZone.png"
import {styles} from "./styles";
import CloseIcon from "../../../assets/closeIcon.svg";
import {useAuth} from "../../provider/AuthProvider";
import CloseButton from "../CloseButton";
const ParkingZoneInfoModal = ({setIsOpen, isOpen }) => {
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
        <View style={{width: '100%'}}>
          <Image source={parkingZone}
                 style={{width: '100%', height: normalize(280), borderTopRightRadius: 25, borderTopLeftRadius: 25}}/>
          <View style={styles.modalBlock}>
            <View style={styles.logoBlock}>
              <ModalHeader width={normalize(58)} height={normalize(48)}/>
              <MaterialIcons name={'local-parking'}
                             style={{fontSize: normalize(24), color: 'white', position: 'absolute'}}/>
            </View>
            <Text style={styles.title}>{i18n.t('thisIsParkingZone')}</Text>
            <Text style={styles.text}>{i18n.t('parkingAreaLook')}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {

                setIsOpen(false)
              }}>
              <ModalButton width={normalize(326)} height={normalize(56)}/>
              <Text style={styles.buttonText}>{i18n.t('continue')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ParkingZoneInfoModal;
