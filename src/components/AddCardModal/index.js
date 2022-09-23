import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {styles} from "./styles"
import {normalize} from "../../responsive/fontSize";
import ReserveButton from "../../../assets/reserveButton.svg";
import AddCard from "../../../assets/addCard.svg";
import Svg, {Mask, Path} from "react-native-svg";
import {useNavigation} from "@react-navigation/native";

const AddCardModal = ({setIsOpen, isOpen,setIsAdded}) => {
  const navigation=useNavigation()
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
          <AddCard style={{marginBottom: normalize(24)}}/>


          <Text style={styles.title}>Before your ride</Text>
          <Text style={styles.text}>Enter your card details to start the ride.</Text>
          <TouchableOpacity style={styles.button} onPress={() => {
            setIsAdded(true)
            setIsOpen(false)
            navigation.navigate('AddNewCardScreen')
          }}>
             <ReserveButton/>
            <Text style={styles.buttonText}>Add a card</Text>


          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default AddCardModal;
