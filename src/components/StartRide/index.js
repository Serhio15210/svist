import React, {useEffect, useState} from 'react';
import {useSvistContext} from "../../provider/SvistProvider";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import RideStatus from "../statusHeaders/RideStatus";
import PauseRideStatus from "../statusHeaders/PauseRideStatus";
import DangerRideStatus from "../statusHeaders/DangerRideStatus";
import SlowRideStatus from "../statusHeaders/SlowRideStatus";
import ParkingRideStatus from "../statusHeaders/ParkingRideStatus";
import ConnectionErrorStatus from "../statusHeaders/ConnectionErrorStatus";
import reserveSamokat from "../../../assets/reserveSamokat.png";
import MainButton from "../../../assets/mainButton.svg";
import PauseBlock from "../../../assets/pauseBlock.svg";
import ActiveStatus from "../../../assets/activeStatus.svg";
import SlowStatus from "../../../assets/slowStatus.svg";
import PauseStatus from "../../../assets/pauseStatus.svg";
import DangerStatus from "../../../assets/dangerStatus.svg";
import BlackStatus from "../../../assets/blackStatus.svg";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FirstPauseModal from "../FirstPauseModal";
import DangerZoneInfoModal from "../DangerZoneInfoModal";
import ReserveButton from "../../../assets/reserveButton.svg";
import ParkingZoneInfoModal from "../ParkingZoneInfoModal";
import {styles} from "./styles";
import ErrorModal from "../ErrorModal/ErrorModal";
import {useAuth} from "../../provider/AuthProvider";
import PushErrorModal from "../PushErrorModal/PushErrorModal";
import GoToParkingAreaModal from "../GoToParkingAreaModal";
import BlackRideStatus from "../statusHeaders/BlackRideStatus";

const StartRide = ({
                     scooter,
                     seconds,
                     setSeconds,
                     errorOpen,
                     setErrorOpen,
                     error,
                     rideStart,
                     ridePause,
                     rideContinue,
                     rideStop,
                     goToParkingOpen,
                     setFirstPauseOpen,
                     firstPause,
                     setFirstPause,
                     firstPauseOpen,
                     setGoToParkingOpen,
                     pushError, pushOpen, setPushOpen, setPushError, redZoneOpen, setRedZoneOpen, isFirstRide
                   }) => {
  const {
    rideArea,
    setRideTime,
    startRide,
    setStartRide,
    pauseRide,
    isConnectedError,
    setEndRide,
    dangerZoneOpen,
    setDangerZoneOpen,
    pauseTime,
    setPauseTime,

  } = useSvistContext()
  const {costSettings, i18n} = useAuth()
  const [openParkingInfo, setOpenParkingInfo] = useState(true)
  useEffect(() => {
    if (startRide && !isConnectedError) {
      // if (!pauseRide && !firstPauseOpen) {
      let myInterval = setTimeout(() => {
        setSeconds(seconds + 1);
        pauseRide && setPauseTime(pauseTime + 1)
      }, 1000)
      return () => {
        clearTimeout(myInterval);
      };
      // }
    }
    if (isConnectedError) {
      ridePause()
    }
  }, [startRide, seconds, pauseRide, isConnectedError]);


  useEffect(() => {
    console.log('goToParkingOpen', goToParkingOpen)
  }, [goToParkingOpen])

  return (
    <View style={{width: '97%', marginBottom: normalize(40)}}>
      {firstPauseOpen && <FirstPauseModal isOpen={firstPauseOpen} setIsOpen={setFirstPauseOpen}/>}
      {/*{goToParkingOpen && !dangerZoneOpen &&*/}
      {/*  <GoToParkingAreaModal isOpen={goToParkingOpen} setIsOpen={setGoToParkingOpen}/>}*/}
      {goToParkingOpen && !dangerZoneOpen && !isConnectedError &&
        <ParkingZoneInfoModal isOpen={goToParkingOpen} setIsOpen={setGoToParkingOpen}/>}
      {dangerZoneOpen && !goToParkingOpen &&
        <DangerZoneInfoModal isOpen={dangerZoneOpen} setIsOpen={setDangerZoneOpen} red={true} setStartRide={setStartRide}/>}
      {redZoneOpen && !goToParkingOpen &&
        <DangerZoneInfoModal isOpen={redZoneOpen} setIsOpen={setRedZoneOpen} red={true} setStartRide={setStartRide}/>}
      {startRide && !pauseRide && <RideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && pauseRide && <PauseRideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && rideArea === 'danger' && !pauseRide &&
        <DangerRideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && rideArea === 'slow' && !pauseRide &&
        <SlowRideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && rideArea === 'black' && !pauseRide &&
        <BlackRideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && rideArea === 'parking' && !pauseRide &&
        <ParkingRideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && isConnectedError && <ConnectionErrorStatus/>}
      {errorOpen && <ErrorModal setIsOpen={setErrorOpen} isOpen={errorOpen} errorText={error}/>}
      {!startRide && isFirstRide && <ParkingZoneInfoModal setIsOpen={setOpenParkingInfo} isOpen={openParkingInfo}/>}

      <View style={styles.reserveBlock}>
        <View style={styles.reserveRowBetween}>
          <View style={styles.rowContainer}>
            <Image source={reserveSamokat} style={{width: normalize(48), height: normalize(48)}}/>
            <View style={{marginLeft: normalize(10)}}>
              <Text style={styles.reserveTitle}>{scooter?.polygon_speed_limit} {i18n.t('km')}/{i18n.t('hour')}</Text>
              <Text style={{fontSize: normalize(12)}}>{scooter?.name_scooter}</Text>
            </View>
          </View>
          {startRide &&
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {rideArea === 'danger' ? <DangerStatus/> : rideArea === 'slow' ?
                <SlowStatus/> : rideArea === 'parking' || pauseRide ? <PauseStatus/> : rideArea === 'black' ?
                  <BlackStatus/> : <ActiveStatus/>}
              <Text style={{...styles.reserveTitle, color: 'white', fontSize: normalize(32), position: 'absolute'}}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}>{Math.floor(parseInt(seconds) / 60)}:{Math.floor(parseInt(seconds) % 60) < 10 ? `0${Math.floor(parseInt(seconds) % 60)}` : `${Math.floor(parseInt(seconds) % 60)}`} </Text>
            </View>}
        </View>

        <View style={styles.rowBetween}>
          {!startRide && !pauseRide &&
            <TouchableOpacity style={{...styles.startButtonBlock, alignSelf: startRide ? 'flex-start' : 'center'}}
                              onPress={() => {

                                scooter?.is_reserve || scooter?.is_been_reserved ? rideStart(true) : rideStart(false)
                              }}>
              <ReserveButton width={'100%'} height={normalize(56)}/>
              <Text style={styles.buttonText}>{i18n.t('startRide')}</Text>
            </TouchableOpacity>}

          {startRide && !pauseRide &&
            <TouchableOpacity style={{...styles.startButtonBlock, alignSelf: startRide ? 'flex-start' : 'center'}}
                              onPress={() => {
                                if (rideArea === 'parking') {
                                  setEndRide(true)
                                  setRideTime(scooter.duration)
                                  setStartRide(false)
                                  rideStop()
                                  // navigation.navigate('EndRideScreen')
                                } else {
                                  rideStop()
                                  // setGoToParkingOpen(true)
                                  // setPauseRide(true)
                                }

                              }}>
              <MainButton width={normalize(245)} height={normalize(56)}/>
              <View style={{
                width: 18,
                height: 18,
                backgroundColor: 'white',
                position: 'absolute',
                left: i18n.locale !== 'sk' ? i18n.locale === 'ukr' ? normalize(35) : normalize(50) : normalize(30),
                borderRadius: 5
              }}></View>

              <Text style={{
                ...styles.buttonText,
                color: 'white',
                right: i18n.locale !== 'sk' ? normalize(57) : normalize(45)
              }}>{i18n.t('endRide')}</Text>

            </TouchableOpacity>}
          {startRide && pauseRide &&
            <TouchableOpacity style={{...styles.startButtonBlock, alignSelf: startRide ? 'flex-start' : 'center'}}
                              onPress={() => {
                                rideContinue()

                              }}>
              <ReserveButton width={'100%'} height={normalize(56)}/>
              <Text style={styles.buttonText}>{i18n.t('continueWithRide')}</Text>
            </TouchableOpacity>}
          {startRide && !pauseRide &&
            <TouchableOpacity style={{...styles.startButtonBlock, alignSelf: setStartRide ? 'flex-start' : 'center'}}
                              onPress={() => {
                                ridePause()

                              }}>
              <PauseBlock height={normalize(56)} width={normalize(72)}/>
              <FontAwesome name={'pause'} style={{position: 'absolute', fontSize: normalize(24), color: '#FE7B01'}}/>
            </TouchableOpacity>}
        </View>
        <View style={{...styles.rowContainer, marginTop: normalize(15), justifyContent: 'center'}}>
          {/*<Text style={{fontSize: normalize(12), marginRight: normalize(19)}}>Unlock 0.00€</Text>*/}
          <Text style={{fontSize: normalize(12)}}>{costSettings?.cost_per_minute}€ / {i18n.t('min')}.</Text>
        </View>
      </View>
    </View>
  )
}


export default StartRide;
