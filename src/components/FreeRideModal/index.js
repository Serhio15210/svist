import React from "react";
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import freeRide from "../../../assets/freeRide.png";
import {useNavigation} from "@react-navigation/native";
import {normalize} from "../../responsive/fontSize";
import {styles} from "./styles";
import FreeRide from "../../../assets/freeRide.svg";
import ModalHeader from "../../../assets/modalHeader.svg";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ModalButton from "../../../assets/modalButton.svg";
import {useSvistContext} from "../../provider/SvistProvider";
import {useAuth} from "../../provider/AuthProvider";
const FreeRideModal = ({setIsOpen, isOpen}) => {
  const navigation = useNavigation()
  const {claimFreeRide, setClaimFreeRide}=useSvistContext()
  const {costSettings,user}=useAuth()
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
        <View style={{width: '100%'}}>
        <View style={{backgroundColor:'#FF9837',padding:normalize(24),paddingBottom:0,borderTopRightRadius:25,borderTopLeftRadius:25,paddingTop:normalize(7)}}>
          <FreeRide/>
        </View>
          <View style={styles.modalBlock}>

            <Text style={styles.title}>Free ride on us!</Text>
            <Text style={styles.text}>Claim your {costSettings?.free_minutes_first_ride} free minutes</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setClaimFreeRide(true)
                setIsOpen(false)
              }}>
              <ModalButton width={normalize(326)} height={normalize(56)}/>
              <Text style={styles.buttonText}>Claim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default FreeRideModal;
