import React from 'react';
import {useNavigation} from "@react-navigation/native";
import {Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../responsive/fontSize";
import Svg, {Mask, Path} from "react-native-svg";
import {GT} from "../constants/fonts";
import ReserveButton from "../../assets/reserveButton.svg";

const DangerZoneInfoModal = ({setIsOpen, isOpen}) => {
  const navigation = useNavigation()
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(!isOpen);
      }}>
      <Pressable style={styles.container} onPress={() => setIsOpen(false)}>

        <View style={{backgroundColor: '#EF4E4E', width: '100%'}}>
          <View style={styles.infoHeader}>
            <AntDesign name={'infocirlceo'} style={{fontSize: normalize(24), color: 'white'}}/>
            <Text style={{color: 'white', marginLeft: normalize(18), fontSize: normalize(16)}} numberOfLines={1} adjustsFontSizeToFit={true}>Jazda v zakázanej zóne</Text>
          </View>
          <View style={styles.modalBlock}>
            <Text style={styles.title}>Zakázaná zóna!</Text>
            <Text style={styles.text} numberOfLines={3} adjustsFontSizeToFit={true}>Ukončenie jazdy v tejto zóne je
              zakázané</Text>

            <TouchableOpacity style={styles.button} onPress={() => {
              setIsOpen(false)
              navigation.reset({
                index: 0,
                routes: [{name: 'EndRideScreen'}],
              })
            }}>
              <ReserveButton width={'100%'} height={normalize(56)}/>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container:{
    flex: 1, alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  modalBlock: {
    backgroundColor: 'white',

    padding: normalize(24),
    width: '100%',
    paddingBottom: normalize(80)

  },
  title: {
    fontSize: normalize(24),
    color: '#1F1E1D',
    marginBottom: 16,
    fontFamily: GT
  },
  text: {
    fontSize: normalize(16),
    color: '#1F1E1D',
    fontFamily: GT
  },
  infoHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(24),
    paddingTop: normalize(18),
    paddingBottom: normalize(18)
  },
  button:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    marginTop: normalize(40)
  },
  buttonText:{
    fontSize: normalize(24),
    color: '#FE7B01',
    fontFamily: GT,
    position: 'absolute'
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(40),
    alignSelf: 'center'
  },
  codeInputBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(8)
  }
})

export default DangerZoneInfoModal;
