import React, {useEffect} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import reserveSamokat from "../../../assets/reserveSamokat.png";
import TimerBlock from "../../../assets/timerBlock.svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import ReserveButton from "../../../assets/reserveButton.svg";
import {useAuth} from "../../provider/AuthProvider";
import {styles} from "./styles";
import ErrorModal from "../ErrorModal/ErrorModal";
import {useNavigation} from "@react-navigation/native";
import {GT} from "../../constants/fonts";
import BackgroundTimer from 'react-native-background-timer';

const ReservationBlock = ({setReservation,
  reservation,
                            seconds,
                            errorOpen,
                            setErrorOpen,
                            selectScooter,
                            stopReservation,
                            cancel,
                            setCancel,
                            timeout,
                            setTimeout,setSeconds,reserveScooter,cancelPress,setCancelPress
                          }) => {
  const navigation=useNavigation()
  const {costSettings, setCostSettings,authToken,i18n}=useAuth()

  useEffect(()=>{

      if (!cancel && !timeout && reservation) {
        let myInterval = BackgroundTimer.setInterval(() => {
          console.log(seconds)
          if (seconds > 0) {
            setSeconds(seconds - 1);
          } else {
            stopReservation()
          }
        }, 1000)
        return () => {
          BackgroundTimer.clearInterval(myInterval);
        }
      }
    // }
  },[seconds,reservation,cancel,timeout])
  return (
    <View style={styles.headerContainer}>
      <View style={{...styles.rowContainer, padding: normalize(24), paddingTop: 0, paddingBottom: normalize(15)}}>
        <AntDesign name={'clockcircleo'} style={{fontSize: normalize(24), color: 'white'}}/>
        <Text style={styles.ongoingText}>{i18n.t('reservationOngoing')}</Text>
      </View>
      <View style={styles.reserveBlock}>
        {errorOpen &&
          <ErrorModal isOpen={errorOpen} setIsOpen={setErrorOpen} errorText={'Ошибка остановки резервирования'}/>}
        <View style={styles.reserveRow}>
          <View style={styles.rowContainer}>
            <Image source={reserveSamokat} style={styles.scooterImg}/>
            <View style={{marginLeft: normalize(10)}}>
              <Text style={styles.reserveTitle}>{selectScooter?.polygon_speed_limit||'25'} {i18n.t('km')}</Text>
              <Text style={{fontSize: normalize(12)}}>{selectScooter?.name_scooter || selectScooter?.scooter_name}</Text>
            </View>
          </View>
          <TouchableOpacity style={{...styles.screenButton, backgroundColor: "#F7F7F7", marginLeft: normalize(43)}}>
            <Ionicons name={"notifications-outline"} size={normalize(24)}/>
          </TouchableOpacity>
          <View style={{alignItems: 'center', justifyContent: 'center', marginLeft: normalize(10)}}>
            <TimerBlock/>
            {seconds>=0?<Text style={{...styles.reserveTitle, color: 'white', fontSize: normalize(32), position: 'absolute'}}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}>{Math.floor(seconds / 60)}:{Math.floor(seconds % 60) < 10 ? `0${Math.floor(seconds % 60)} ` : `${Math.floor(parseInt(seconds) % 60)} `}</Text>:
              <Text style={{...styles.reserveTitle, color: 'white', fontSize: normalize(32), position: 'absolute'}}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}>00:00</Text>}

              </View>
        </View>
        <TouchableOpacity style={styles.stopReserveButton} onPress={() => {
          // setCancel(true)
          setCancelPress(true)
          stopReservation()
        }}>
          <ReserveButton width={'100%'} height={normalize(56)}/>
          <Text style={styles.cancelText}>{i18n.t('cancelReservation')}</Text>
        </TouchableOpacity>
        <View style={{...styles.rowContainer, marginTop: normalize(15), justifyContent: 'center'}}>
          <Text style={{fontSize: normalize(12), marginRight: normalize(19)}}>{i18n.t('unlock')}{costSettings?.unlock_cost}€</Text>
          <Text style={{fontSize: normalize(12)}}>{costSettings?.cost_per_minute}€ / {i18n.t('min')}.</Text>
        </View>
      </View>
    </View>
  );
};

export default ReservationBlock;
