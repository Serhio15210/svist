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
  pushError,pushOpen,setPushOpen,setPushError
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
  const {costSettings}=useAuth()
  const [openParkingInfo,setOpenParkingInfo]=useState(true)
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




  return (
    <View style={{width: '97%', marginBottom: normalize(40)}}>
      {firstPauseOpen && <FirstPauseModal isOpen={firstPauseOpen} setIsOpen={setFirstPauseOpen}/>}
      {/*{goToParkingOpen && !dangerZoneOpen &&*/}
      {/*  <GoToParkingAreaModal isOpen={goToParkingOpen} setIsOpen={setGoToParkingOpen}/>}*/}
      {goToParkingOpen && !dangerZoneOpen &&
        <ParkingZoneInfoModal isOpen={goToParkingOpen} setIsOpen={setGoToParkingOpen}/>}
      {dangerZoneOpen && !goToParkingOpen &&
        <DangerZoneInfoModal isOpen={dangerZoneOpen} setIsOpen={setDangerZoneOpen}/>}
      {startRide && !pauseRide && <RideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && pauseRide && <PauseRideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && rideArea === 'danger' && !pauseRide && <DangerRideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && rideArea === 'slow' && !pauseRide && <SlowRideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && rideArea === 'parking' && !pauseRide && <ParkingRideStatus batteryLevel={scooter?.battery_current_level}/>}
      {startRide && isConnectedError && <ConnectionErrorStatus/>}
      {errorOpen && <ErrorModal setIsOpen={setErrorOpen} isOpen={errorOpen} errorText={error}/>}
      {!startRide && openParkingInfo && <ParkingZoneInfoModal setIsOpen={setOpenParkingInfo} isOpen={openParkingInfo}/>}

      <View style={styles.reserveBlock}>
        <View style={{
          ...styles.rowContainer,
          justifyContent: 'space-between',
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#EDEDF1",
          paddingBottom: normalize(14),
        }}>
          <View style={styles.rowContainer}>
            <Image source={reserveSamokat} style={{width: normalize(48), height: normalize(48)}}/>
            <View style={{marginLeft: normalize(10)}}>
              <Text style={styles.reserveTitle}>25 km</Text>
              <Text style={{fontSize: normalize(12)}}>{scooter?.name_scooter}</Text>
            </View>
          </View>
          {startRide &&
            <View style={{alignItems: 'center', justifyContent: 'center'}}>

              {rideArea === 'danger' ? <DangerStatus/> : rideArea === 'slow' ?
                <SlowStatus/> : rideArea === 'parking' || pauseRide ? <PauseStatus/> : <ActiveStatus/>}
              <Text style={{...styles.reserveTitle, color: 'white', fontSize: normalize(32), position: 'absolute'}}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}>{Math.floor(parseInt(seconds) / 60)}:{Math.floor(parseInt(seconds) % 60) < 10 ? `0${Math.floor(parseInt(seconds) % 60)}` : Math.floor(parseInt(seconds) % 60)}</Text>
            </View>}
        </View>

        <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
          {!startRide && !pauseRide &&
            <TouchableOpacity style={{...styles.startButtonBlock, alignSelf: startRide ? 'flex-start' : 'center'}}
                              onPress={() => {

                                scooter?.is_reserve||scooter?.is_been_reserved?rideStart(true):rideStart(false)
                              }}>
              <ReserveButton width={'100%'} height={normalize(56)}/>
              <Text style={styles.buttonText}>{'Start a ride'}</Text>
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
                left: normalize(50),
                borderRadius: 5
              }}></View>

              <Text style={{...styles.buttonText, color: 'white', right: normalize(57)}}>{'End ride'}</Text>

            </TouchableOpacity>}
          {startRide && pauseRide &&
            <TouchableOpacity style={{...styles.startButtonBlock, alignSelf: startRide ? 'flex-start' : 'center'}}
                              onPress={() => {
                                rideContinue()

                              }}>
              <ReserveButton width={'100%'} height={normalize(56)}/>
              <Text style={styles.buttonText}>{'Continue with ride'}</Text>
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
          <Text style={{fontSize: normalize(12)}}>{costSettings?.cost_per_minute}€ / min.</Text>
        </View>
      </View>
    </View>
  )
}


export default StartRide;
