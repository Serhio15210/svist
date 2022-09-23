import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import reserveSamokat from "../../../assets/reserveSamokat.png";
import TimerBlock from "../../../assets/timerBlock.svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import TimeoutModal from "../TimeoutModal";
import ReservationCanceledModal from "../ReservationCanceledModal";
import ReserveButton from "../../../assets/reserveButton.svg";
import {useAuth} from "../../provider/AuthProvider";
import {getCurrentTrip, stopTrip} from "../../api/scooterApi";
import {useSvistContext} from "../../provider/SvistProvider";
import {styles} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorModal from "../ErrorModal/ErrorModal";
import {useNavigation} from "@react-navigation/native";
import {GT} from "../../constants/fonts";

const ReservationBlock = ({
                            setReservation,
  reservation,
                            seconds,
                            errorOpen,
                            setErrorOpen,
                            selectScooter,
                            stopReservation,
                            cancel,
                            setCancel,
                            timeout,
                            setTimeout,setSeconds
                          }) => {

  const navigation=useNavigation()
  const {costSettings, setCostSettings,authToken}=useAuth()
  useEffect(()=>{
      if (!cancel && !timeout && reservation) {
        let myInterval = setInterval(() => {
          if (seconds > 0) {
            AsyncStorage.setItem('reservation', seconds - 1 + '')
            setSeconds(seconds - 1);
          } else {
            AsyncStorage.removeItem('reservation')
            stopReservation()
          }
        }, 900)
        let tripInterval
        return () => {
          clearInterval(myInterval);

        }
      }

  },[seconds,reservation,cancel,timeout])
  return (
    <View style={styles.headerContainer}>
      <View style={{...styles.rowContainer, padding: normalize(24), paddingTop: 0, paddingBottom: normalize(15)}}>
        <AntDesign name={'clockcircleo'} style={{fontSize: normalize(24), color: 'white'}}/>
        <Text style={{color: 'white', marginLeft: normalize(18), fontSize: normalize(16)}}>Reservation ongoing</Text>
      </View>
      <View style={styles.reserveBlock}>
        {timeout && navigation.isFocused()&&<TimeoutModal setIsOpen={setTimeout} isOpen={timeout} setReservation={setReservation}/>}
        {cancel && navigation.isFocused()&&<ReservationCanceledModal setIsOpen={setCancel} isOpen={cancel} setReservation={setReservation}/>}
        {errorOpen &&
          <ErrorModal isOpen={errorOpen} setIsOpen={setErrorOpen} errorText={'Ошибка остановки резервирования'}/>}
        <View style={{
          ...styles.rowContainer,
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#EDEDF1",
          paddingBottom: normalize(14),
        }}>
          <View style={styles.rowContainer}>
            <Image source={reserveSamokat} style={{width: normalize(48), height: normalize(48)}}/>
            <View style={{marginLeft: normalize(10)}}>
              <Text style={styles.reserveTitle}>25 km</Text>
              <Text
                style={{fontSize: normalize(12)}}>{selectScooter?.name_scooter || selectScooter?.scooter_name}</Text>
            </View>
          </View>
          <TouchableOpacity style={{...styles.screenButton, backgroundColor: "#F7F7F7", marginLeft: normalize(43)}}>
            <Ionicons name={"notifications-outline"} size={normalize(24)}/>
          </TouchableOpacity>
          <View style={{alignItems: 'center', justifyContent: 'center', marginLeft: normalize(10)}}>
            <TimerBlock/>
            <Text style={{...styles.reserveTitle, color: 'white', fontSize: normalize(32), position: 'absolute'}}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}>{Math.floor(seconds / 60)}:{Math.floor(seconds % 60) < 10 ? `0${Math.floor(seconds % 60)}` : Math.floor(seconds % 60)}</Text>
          </View>
        </View>
        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          alignSelf: 'center',
          marginTop: normalize(35)
        }} onPress={() => {
          stopReservation()
        }}>
          <ReserveButton width={'100%'} height={normalize(56)}/>
          <Text style={{
            fontSize: normalize(24),
            color: '#EF4E4E',
            fontFamily: GT,
            position: 'absolute'
          }}>Cancel reservation</Text>
        </TouchableOpacity>
        <View style={{...styles.rowContainer, marginTop: normalize(15), justifyContent: 'center'}}>
          <Text style={{fontSize: normalize(12), marginRight: normalize(19)}}>Unlock {costSettings?.unlock_cost}€</Text>
          <Text style={{fontSize: normalize(12)}}>{costSettings?.cost_per_minute}€ / min.</Text>
        </View>
      </View>
    </View>
  );
};

export default ReservationBlock;
