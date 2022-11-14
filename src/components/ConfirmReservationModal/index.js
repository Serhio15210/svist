import React, {useState} from "react";
import {Modal, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import ModalTime from "../../../assets/modalTime.svg"
import {createTrip, startTrip} from "../../api/scooterApi";
import {useAuth} from "../../provider/AuthProvider";
import {useSvistContext} from "../../provider/SvistProvider";
import {styles} from "./styles";
import ErrorModal from "../ErrorModal/ErrorModal";
import ReserveFocusButton from "../../../assets/reserveFocusButton.svg";
import CloseIcon from "../../../assets/closeIcon.svg";
import {activateKeepAwake} from "expo-keep-awake";
import CloseButton from "../CloseButton";

const ConfirmReservationModal = ({setIsOpen, isOpen, scooter, setReservation}) => {
  const {authToken, costSettings, i18n} = useAuth()
  const [error, setError] = useState('')
  const {setSelectScooter} = useSvistContext()
  const [errorOpen, setErrorOpen] = useState(false)
  const reserveScooter = () => {

    createTrip(authToken, scooter?.scooter_name).then(res => {
      if (res.result === 'success') {
        console.log('confirm create reserve trip')
        setSelectScooter({...scooter, tripId: res?.tripId})
        startTrip(authToken, res?.tripId, 1).then(res => {
          if (res.result === 'success') {
            console.log('---confirm reserve trip started---')
            setReservation(true)
            setIsOpen(false)
            setError('')
          } else {
            setError(res?.message)
            setErrorOpen(true)
          }
        })

      } else {
        setError(res?.message || res)
        setErrorOpen(true)
      }
    })


  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(!isOpen);
      }}>
      {errorOpen && <ErrorModal setIsOpen={setErrorOpen} isOpen={errorOpen} errorText={error}/>}
      <View style={styles.container}>
        <CloseButton onPress={() => setIsOpen(false)}/>
        <View style={styles.modalBlock}>
          <ModalTime style={{marginBottom: normalize(24)}}/>

          <Text style={styles.title}>{i18n.t('reserveFor')} {costSettings?.cost_per_minute_reserve}€
            / {i18n.t('min')}.</Text>
          <Text
            style={styles.text}>{i18n.t('canReserveScooterForMinutes')} {costSettings?.max_reserve_minutes} {i18n.t('minutes')}. {i18n.t('canReserveScooterForMinutes2')}</Text>
          <TouchableOpacity style={styles.button} onPress={() => {
            reserveScooter()
          }}>

            <ReserveFocusButton width={normalize(342)} height={normalize(56)}/>
            <Text style={styles.buttonText}>{i18n.t('confirmReservation')}</Text>


          </TouchableOpacity>
          {/*<Text style={styles.errorText}>{error}</Text>*/}
        </View>
      </View>
    </Modal>
  );
};


export default ConfirmReservationModal;
