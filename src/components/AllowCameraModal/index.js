import React from "react";
import {Linking, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import ModalHeader from "../../../assets/modalHeader.svg";
import ModalButton from "../../../assets/modalButton.svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {styles} from "./styles";
import {Camera} from "expo-camera";

const AllowCameraModal = ({setIsOpen, isOpen, checkPermission}) => {
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
            <MaterialCommunityIcons name={'camera-outline'}
                                    style={{fontSize: normalize(24), position: 'absolute', color: 'white'}}/>
          </View>

          <Text style={styles.title}>Turn on your camera, please</Text>

          <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', width: '100%'}} onPress={() => {


            // checkPermission()
            // Linking.openSettings().then(res=>{
            //   setIsOpen(false)
            // });
            Camera.requestCameraPermissionsAsync().then(res=>{
              // console.log(res)
              // if (res.granted){
              //   setIsOpen(false)
              // }
              setIsOpen(false)
            })


          }}>
            <ModalButton width={normalize(326)} height={normalize(56)}/>
            <Text style={styles.buttonText}>Allow</Text>

          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default AllowCameraModal;
