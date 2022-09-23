import React from "react";
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import partnerImg from '../../../assets/partnerModalImg.png'
import {normalize} from "../../responsive/fontSize";
import ModalHeader from "../../../assets/modalHeader.svg";
import ModalButton from "../../../assets/modalButton.svg";
import {styles} from "./styles";

const BecomePartnerModal = ({setIsOpen, isOpen}) => {
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
                        <Image source={partnerImg} style={{
                            width: normalize(42),
                            height: normalize(41),
                            position: 'absolute',
                            bottom: 0
                        }}/>

                    </View>
                    <Text style={styles.title}>Oh, we're not in your city yet</Text>
                    <Text style={styles.text}>Unfortunately, the service is not yet available in your city. We will let
                        you know as soon as the service is available.</Text>
                    <TouchableOpacity style={styles.button} onPress={() => setIsOpen(false)}>
                        <ModalButton width={'100%'} height={normalize(56)}/>
                        <Text style={styles.buttonText}>Become a partner</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default BecomePartnerModal;
