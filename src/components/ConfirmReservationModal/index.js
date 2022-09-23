import React, {useState} from "react";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {normalize} from "../../responsive/fontSize";
import ModalTime from "../../../assets/modalTime.svg"
import Svg, {Mask, Path} from "react-native-svg";
import {createTrip, startTrip} from "../../api/scooterApi";
import {useAuth} from "../../provider/AuthProvider";
import {useSvistContext} from "../../provider/SvistProvider";
import {styles} from "./styles";
import ErrorModal from "../ErrorModal/ErrorModal";
import ReserveButton from "../../../assets/reserveButton.svg";
import ReserveFocusButton from "../../../assets/reserveFocusButton.svg";

const ConfirmReservationModal = ({setIsOpen, isOpen, scooter,setReservation}) => {
  const {authToken,costSettings }=useAuth()
  const [error, setError] = useState('')
  const {setSelectScooter}=useSvistContext()
  const [errorOpen, setErrorOpen] = useState(false)
  const reserveScooter=()=>{
    createTrip(authToken,scooter?.scooter_name).then(res=>{
      if (res.result==='success') {
        console.log('confirm create reserve trip')
        setSelectScooter({...scooter,tripId:res?.tripId})
        startTrip(authToken,res?.tripId,1).then(res=>{
          if (res.result === 'success') {
            console.log('---confirm reserve trip started---')
            setReservation(true)
            setIsOpen(false)
            setError('')
          }else {
            setError(res?.message)
            setErrorOpen(true)
          }
        })

      }else {
        setError(res?.message||res)
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
      {errorOpen&&<ErrorModal setIsOpen={setErrorOpen} isOpen={errorOpen} errorText={error}/>}
      <View style={styles.container}>
        <AntDesign name={'closesquareo'}
                   style={{position: 'absolute', top: 30, right: 20, fontSize: 24, color: 'white'}}
                   onPress={() => setIsOpen(false)}/>
        <View style={styles.modalBlock}>
          <ModalTime style={{marginBottom: normalize(24)}}/>

          <Text style={styles.title}>Rezervované na {costSettings?.cost_per_minute_reserve}€ / min.</Text>
          <Text style={styles.text}>Vozidlo si môzes rezervovat na {costSettings?.max_reserve_minutes} minút. Úctovat sa začne akonáhle rezerváciu
            potvrdís.</Text>
          <TouchableOpacity style={styles.button} onPress={() => {
            reserveScooter()
          }}>
            {/*<Svg width={normalize(342)} height={normalize(56)} viewBox="0 0 342 56" fill="none"*/}
            {/*     xmlns="http://www.w3.org/2000/svg">*/}
            {/*  <Mask id="path-1-inside-1_2_1750" fill="white">*/}
            {/*    <Path*/}
            {/*      d="M341.845 10.4175L334.512 48.8688C334.129 50.8745 333.06 52.6841 331.487 53.9858C329.914 55.2875 327.936 55.9998 325.895 56H8.77199C7.4807 55.9997 6.20541 55.7143 5.03712 55.1642C3.86882 54.6141 2.8363 53.8129 2.01326 52.8177C1.19022 51.8225 0.596954 50.658 0.275766 49.407C-0.0454215 48.1561 -0.0866031 46.8497 0.155167 45.5811L7.48832 7.12975C7.87095 5.12416 8.94093 3.31482 10.5139 2.0134C12.0869 0.711975 14.0645 -3.9935e-05 16.1059 1.67994e-09H333.228C334.519 0.000344978 335.795 0.285741 336.963 0.835826C338.131 1.38591 339.164 2.18712 339.987 3.18229C340.81 4.17746 341.403 5.34205 341.724 6.59296C342.045 7.84387 342.087 9.15027 341.845 10.4189"*/}
            {/*      fill={'#FE7B01'}/>*/}
            {/*  </Mask>*/}
            {/*  <Path*/}
            {/*    d="M341.845 10.4175L334.512 48.8688C334.129 50.8745 333.06 52.6841 331.487 53.9858C329.914 55.2875 327.936 55.9998 325.895 56H8.77199C7.4807 55.9997 6.20541 55.7143 5.03712 55.1642C3.86882 54.6141 2.8363 53.8129 2.01326 52.8177C1.19022 51.8225 0.596954 50.658 0.275766 49.407C-0.0454215 48.1561 -0.0866031 46.8497 0.155167 45.5811L7.48832 7.12975C7.87095 5.12416 8.94093 3.31482 10.5139 2.0134C12.0869 0.711975 14.0645 -3.9935e-05 16.1059 1.67994e-09H333.228C334.519 0.000344978 335.795 0.285741 336.963 0.835826C338.131 1.38591 339.164 2.18712 339.987 3.18229C340.81 4.17746 341.403 5.34205 341.724 6.59296C342.045 7.84387 342.087 9.15027 341.845 10.4189"*/}
            {/*    fill="#FE7B01"/>*/}

            {/*</Svg>*/}
            <ReserveFocusButton width={normalize(342)} height={normalize(56)}/>
            <Text style={styles.buttonText}>Confirm reservation</Text>


          </TouchableOpacity>
          {/*<Text style={styles.errorText}>{error}</Text>*/}
        </View>
      </View>
    </Modal>
  );
};


export default ConfirmReservationModal;
