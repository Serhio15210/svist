import React from 'react';

import {Image, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import reserveSamokat from "../../../assets/reserveSamokat.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import mastercard from "../../../assets/mastercard.png";
import reserveCreditCard from "../../../assets/reserveCreditCard.png";
import ReserveButton from "../../../assets/reserveButton.svg";
import {useAuth} from "../../provider/AuthProvider";
import {styles} from "./styles";
import {useNavigation} from "@react-navigation/native";

const ReserveModal= ({setConfirmReservation, setShowInfo,scooter,isAdded,setIsAdded,setAddCard,addCard,setReserveName}) => {
  // const [addCard,setAddCard]=useState(false)
  const {costSettings, setCostSettings,i18n}=useAuth()
  const navigation=useNavigation()
  const checkReserve=()=>{
    setReserveName(scooter?.scooter_name)
    setShowInfo(false)
    setConfirmReservation(true)

  }

  return (
    <View style={styles.reserveBlock}>
      {/*{addCard&&!isAdded&&<AddCardModal setIsOpen={setAddCard} isOpen={addCard} setIsAdded={setIsAdded}/>}*/}
      <View style={styles.infoContainer}>
        <View style={styles.rowContainer}>
          <Image source={reserveSamokat} style={styles.scooterImg}/>
          <View style={{marginLeft: normalize(10)}}>
            <Text style={styles.reserveTitle}>{scooter?.polygon_speed_limit||'25'} {i18n.t('km')}</Text>
            <Text style={{fontSize: normalize(12)}}>{scooter?.scooter_name}</Text>
          </View>
        </View>
        <TouchableOpacity style={{...styles.screenButton, backgroundColor: "#F7F7F7"}}>
          <Ionicons name={"notifications-outline"} size={normalize(24)}/>
        </TouchableOpacity>
      </View>
      <View style={{...styles.rowBetween, marginTop: normalize(20)}}>
        <Text style={{fontSize: normalize(12)}}>{i18n.t('privateRide')}</Text>
        <View style={styles.rowContainer}>
          {isAdded&&<Image source={mastercard} style={styles.cardTypeImg}/>}
          <View style={styles.rowContainer}>
            {isAdded?
              <>
                <View style={styles.cardDot}/>
                <View style={styles.cardDot}/>
                <View style={styles.cardDot}/>
                <View style={styles.cardDot}/>
                <Text style={{fontSize: normalize(16)}}>4367</Text></>:<Text style={styles.addCardText} onPress={()=>navigation.navigate('AddNewCardScreen')}>{i18n.t('addCard')}</Text>}
            <Image source={reserveCreditCard} style={styles.walletImg}/>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.addCardButton} onPress={() => {
         isAdded?checkReserve():setAddCard(true)
      }}>
         <ReserveButton width={'100%'} height={normalize(56)}/>
        <Text style={{
          ...styles.reserveButtonText,
          position: 'absolute'
        }}>{i18n.t('reserve')}</Text>
      </TouchableOpacity>

      <View style={{...styles.rowContainer, marginTop: normalize(15), justifyContent: 'center'}}>
        <Text style={{fontSize: normalize(12), marginRight: normalize(19)}}>{i18n.t('unlock')} {costSettings?.unlock_cost}€</Text>
        <Text style={{fontSize: normalize(12)}}>{costSettings?.cost_per_minute}€ / {i18n.t('min')}.</Text>
      </View>
    </View>
  );
};

export default ReserveModal;
