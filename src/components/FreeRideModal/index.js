import React from "react";
import {Modal, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {normalize} from "../../responsive/fontSize";
import {styles} from "./styles";
import FreeRide from "../../../assets/freeRide.svg";
import ModalButton from "../../../assets/modalButton.svg";
import {useSvistContext} from "../../provider/SvistProvider";
import {useAuth} from "../../provider/AuthProvider";
import CloseIcon from "../../../assets/closeIcon.svg";
import CloseButton from "../CloseButton";

const FreeRideModal = ({setIsOpen, isOpen}) => {
  const navigation = useNavigation()
  const {claimFreeRide, setClaimFreeRide}=useSvistContext()
  const {costSettings,user,i18n}=useAuth()
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
        <View style={{backgroundColor:'#FF9837',padding:normalize(24),paddingBottom:0,borderTopRightRadius:25,borderTopLeftRadius:25,paddingTop:normalize(7)}}>
          <FreeRide/>
        </View>
          <View style={styles.modalBlock}>

            <Text style={styles.title}>{i18n.t('freeRide')}</Text>
            <Text style={styles.text}>{costSettings?.free_minutes_first_ride} {i18n.t('freeMinutes')}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setClaimFreeRide(true)
                setIsOpen(false)
              }}>
              <ModalButton width={normalize(326)} height={normalize(56)}/>
              <Text style={styles.buttonText}>{i18n.t('claim')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default FreeRideModal;
