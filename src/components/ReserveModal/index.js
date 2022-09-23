import React, {useEffect, useState} from 'react';

import {Image, Text, TouchableOpacity, View} from "react-native";
import AddCardModal from "../AddCardModal";
import {normalize} from "../../responsive/fontSize";
import reserveSamokat from "../../../assets/reserveSamokat.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import mastercard from "../../../assets/mastercard.png";
import reserveCreditCard from "../../../assets/reserveCreditCard.png";
import ReserveButton from "../../../assets/reserveButton.svg";
import {useAuth} from "../../provider/AuthProvider";
import {useSvistContext} from "../../provider/SvistProvider";
import {styles} from "./styles";
import {getCards} from "../../api/authApi";
import {useNavigation} from "@react-navigation/native";
const ReserveModal= ({setConfirmReservation, setShowInfo,scooter,isAdded,setIsAdded}) => {
  const [addCard,setAddCard]=useState(false)
  const {costSettings, setCostSettings}=useAuth()
  const navigation=useNavigation()
  const checkReserve=()=>{
    setShowInfo(false)
    setConfirmReservation(true)
        }

  return (
    <View style={styles.reserveBlock}>
      {addCard&&!isAdded&&<AddCardModal setIsOpen={setAddCard} isOpen={addCard} setIsAdded={setIsAdded}/>}
      <View style={styles.infoContainer}>
        <View style={styles.rowContainer}>
          <Image source={reserveSamokat} style={{width: normalize(48), height: normalize(48)}}/>
          <View style={{marginLeft: normalize(10)}}>
            <Text style={styles.reserveTitle}>25 km</Text>
            <Text style={{fontSize: normalize(12)}}>{scooter?.scooter_name}</Text>
          </View>
        </View>
        <TouchableOpacity style={{...styles.screenButton, backgroundColor: "#F7F7F7"}}>
          <Ionicons name={"notifications-outline"} size={normalize(24)}/>
        </TouchableOpacity>
      </View>
      <View
        style={{
          ...styles.rowContainer,
          justifyContent: "space-between",
          width: "100%",
          marginTop: normalize(20)
        }}>
        <Text style={{fontSize: normalize(12)}}>Soukromá jazda</Text>
        <View style={styles.rowContainer}>
          {isAdded&&<Image source={mastercard}
                           style={{width: normalize(26), height: normalize(17), marginRight: normalize(20)}}/>}
          <View style={styles.rowContainer}>
            {isAdded?
              <>
                <View style={styles.cardDot}/>
                <View style={styles.cardDot}/>
                <View style={styles.cardDot}/>
                <View style={styles.cardDot}/>
                <Text style={{fontSize: normalize(16)}}>4367</Text></>:<Text style={{color:'#FE7B01',fontSize:normalize(16)}} onPress={()=>navigation.navigate('AddNewCardScreen')}>add a card</Text>}
            <Image source={reserveCreditCard}
                   style={{width: normalize(24), height: normalize(24), marginLeft: normalize(15)}}/>
          </View>
        </View>
      </View>
      <TouchableOpacity style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        alignSelf: 'center',
        marginTop: normalize(35)
      }} onPress={() => {
         isAdded?checkReserve():setAddCard(true)
      }}>
         <ReserveButton width={'100%'} height={normalize(56)}/>
        <Text style={{
          ...styles.reserveButtonText,
          position: 'absolute'
        }}>Reserve</Text>
      </TouchableOpacity>

      <View style={{...styles.rowContainer, marginTop: normalize(15), justifyContent: 'center'}}>
        <Text style={{fontSize: normalize(12), marginRight: normalize(19)}}>Unlock {costSettings?.unlock_cost}€</Text>
        <Text style={{fontSize: normalize(12)}}>{costSettings?.cost_per_minute}€ / min.</Text>
      </View>
    </View>
  );
};

export default ReserveModal;
