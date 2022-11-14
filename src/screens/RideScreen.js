import React, {useEffect, useRef, useState} from "react";
import {StyleSheet, View} from "react-native";
import {AnimatedRegion} from "react-native-maps";
import DrawerMenuButton from "../components/DrawerMenuButton";
import {useSvistContext} from "../provider/SvistProvider";
import StartRide from "../components/StartRide";
import {
  continueTrip,
  getCurrentTrip,
  getPolygons,
  pauseTrip,
  startReservedTrip,
  startTrip,
  stopTrip
} from "../api/scooterApi";
import {useAuth} from "../provider/AuthProvider";
import LoadingModal from "../components/LoadingModal";
import {useNavigation} from "@react-navigation/native";
import {BLACK_ZONE, NORMAL_ZONE, PARKING_ZONE, RED_ZONE, SLOW_ZONE} from "../../assets/polygonColors";
import SocketIOClient from "socket.io-client";
import TrackerMap from "../components/TrackerMap/TrackerMap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';
import PushErrorModal from "../components/PushErrorModal/PushErrorModal";
import GpsLostModal from "../components/GpsLostModal";

const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = 0.05;
const LATITUDE = 0;
const LONGITUDE = 0;
const RideScreen = ({route}) => {
  const mapRef = useRef()
  const markerRef = useRef()
  const {authToken, i18n} = useAuth()
  // const {id} = route.params
  const {
    rideArea,
    setRideArea,
    rideTime,
    setRideTime,
    startRide,
    setStartRide,
    pauseRide,
    setPauseRide,
    isConnectedError,
    setIsConnectedError,
    endRide,
    setEndRide,
    dangerZoneOpen,
    setDangerZoneOpen,
    pauseTime,
    setPauseTime,
    selectScooter,
    setSelectScooter, redZoneOpen, setRedZoneOpen,isFirstRide
  } = useSvistContext()
  const {costSettings} = useAuth()
  const [polygons, setPolygons] = useState([]);
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(parseInt(selectScooter.duration) || 0);
  const [firstPause, setFirstPause] = useState(false)
  const [error, setError] = useState(false)
  const [pushError, setPushError] = useState({
    text: '',
    title: ''
  })
  const [gpsError, setGpsError] = useState({
    text: '',
    title: ''
  })
  const [pushOpen, setPushOpen] = useState(false)
  const [gpsLostOpen, setGpsLostOpen] = useState(false)
  const [batteryLow, setBatteryLow] = useState(false)
  const [goToParkingOpen, setGoToParkingOpen] = useState(false)
  const [openParkingInfo, setOpenParkingInfo] = useState(false)

  const [errorOpen, setErrorOpen] = useState(false)
  const [tripId, setTripId] = useState(0)
  const [firstPauseOpen, setFirstPauseOpen] = useState(false)
  const [firstRedZoneOpen, setFirstRedZoneOpen] = useState(false)
  const [startPosition, setStartPosition] = useState(new AnimatedRegion({
    latitude: 0,
    longitude: 0,
    longitudeDelta: 0.5,
    latitudeDelta: 0.5
  }))
  useEffect(() => {
    let isMount = true
    setLoading(true)
    getCurrentTrip(authToken).then(res => {
      setStartPosition(new AnimatedRegion({
        latitude: parseFloat(res?.latitude),
        longitude: parseFloat(res?.longitude),
        longitudeDelta: 0.5,
        latitudeDelta: 0.5
      }))
      setSelectScooter(res)
    })
    getPolygons(authToken).then(res => {

      setPolygons(res)
    })
    setLoading(false)
    return (() => {
      isMount = false
    })
  }, [])
  useEffect(() => {

      if (selectScooter?.push_description && selectScooter?.push_description !== 'Ты въехал в зону парковки') {
        setPushError({
          text: selectScooter?.push_description,
          title: selectScooter?.push_title || ''
        })
        if (parseInt(selectScooter?.battery_current_level) <= costSettings?.criticalPower) {

          // setEndRide(true)
          setRideTime(selectScooter?.duration)
          setStartRide(false)
          setBatteryLow(true)
        }
        setPushOpen(true)
      }
      if (selectScooter?.gps_error) {
        setGpsError({
          text: selectScooter?.gps_error_text,
          title: 'Gps lost'
        })
        setGpsLostOpen(true)
      }
      if (selectScooter?.polygon_color_mobile === PARKING_ZONE) {
        setFirstPause(true)
        setFirstRedZoneOpen(false)
        setRideArea('parking')
        !firstPause && setOpenParkingInfo(true)
      } else if (selectScooter?.polygon_color_mobile === RED_ZONE) {
        setFirstRedZoneOpen(true)
        !firstRedZoneOpen && setRedZoneOpen(true)
        setRideArea('danger')
      } else if (selectScooter?.polygon_color_mobile === SLOW_ZONE) {
        setFirstRedZoneOpen(false)
        setRideArea('slow')
      } else if (selectScooter?.polygon_color_mobile === BLACK_ZONE) {
        setFirstRedZoneOpen(false)
        setRideArea('black')
      } else if (selectScooter?.polygon_color_mobile === NORMAL_ZONE) {
        setFirstRedZoneOpen(false)
        setRideArea('none')
      } else if (startRide && !selectScooter?.polygon_color_mobile) {
        console.log('end')
        setDangerZoneOpen(true)
        setRideArea('danger')
        // setEndRide(true)
        // setRideTime(selectScooter?.duration)
        // // setStartRide(false)
        // setSelectScooter({
        //   ...selectScooter,
        //   endTime: `${moment(new Date()).format('DD.MM.YYYY')},${new Date().getHours()}:${new Date().getMinutes()}`
        // })

      } else {
        setRideArea('none')
        setFirstRedZoneOpen(false)
      }
      selectScooter?.status === 'in_process' && setSeconds(parseInt(selectScooter.duration))

  }, [selectScooter])
  useEffect(() => {
    if (selectScooter?.is_reserve) {
      rideStart(true)
    } else if (selectScooter?.status === 'in_process'&&parseInt(selectScooter?.duration) > 0) {

      setStartRide(true)
      setEndRide(false)
      setPauseRide(false)
      setTripId(selectScooter?.id)
      startTripSocket(selectScooter?.id)
    }
    return (() => {
      setStartRide(false)
      setEndRide(false)
      setPauseRide(false)
      setTripId('')
    })

  }, [false])
  useEffect(() => {
    if (pauseRide && rideArea !== 'parking') {
      if (!firstPause) {
        setFirstPauseOpen(true)
        setFirstPause(true)
      } else setFirstPauseOpen(false)
    }
  }, [pauseRide])

  const startTripSocket = (room) => {

    const socket = SocketIOClient(`https://scooter3.tcl.quazom.com:36502?token=${authToken}`);
    socket.on("connect", () => {
      // console.log('connect',room)
      socket.emit('subscribe', `start-trip-${room}`, (data) => {

      });
      socket.on(`start-trip-${room}`, (data) => {
        // console.log('start socket')
      });
      socket.emit('subscribe', `event-trip-${selectScooter?.id}`);
      socket.on(`event-trip-${selectScooter?.id}`, (data) => {
        console.log('con')
        console.log(data.data)
      });

      socket.emit('subscribe', `trip-${room}`);
      socket.on(`trip-${room}`, (data) => {
        console.log('-----------data-----------------')
        console.log(data.data)

        if (!endRide) {
          setRideArea(data.data?.polygon_color_mobile)
          setSelectScooter({...selectScooter, polygon_color_mobile: data.data?.polygon_color_mobile, ...data.data})
          // setStartPosition(new AnimatedRegion({
          //   latitude: parseFloat(data.data?.latitude),
          //   longitude: parseFloat(data.data?.longitude),
          //   longitudeDelta:0.5,
          //   latitudeDelta:0.5
          // }))
        }
      });
    });

return () => {
      socket.disconnect();
    };
  }

  const rideStart = (reserved) => {
    if (reserved) {
      startReservedTrip(authToken, selectScooter?.id).then(res => {
        if (res.result === 'success') {
          // console.log('---start reserved trip---')
          setStartRide(true)
          setEndRide(false)
          setPauseRide(false)
          setTripId(res.data?.tripId)
          startTripSocket(res.data?.tripId)
        }
      })
    } else {
      startTrip(authToken, selectScooter?.id, 0).then(res => {
        console.log(res)
        if (res.result === 'success') {
          // console.log('---start trip, reserve:', 0)
          setStartRide(true)
          setEndRide(false)
          setPauseRide(false)
          setTripId(res.data?.tripId)
          startTripSocket(res.data?.tripId)
        }
        else {
          setError(res?.message || res)
          setErrorOpen(true)
        }
      })
    }

  }
  const ridePause = () => {
    pauseTrip(authToken, tripId).then(res => {
      // console.log('pause',res?.data)
      if (res?.data?.result === 'success') {

        setPauseRide(true)
      } else {
        !isConnectedError&&setGoToParkingOpen(true)
      }
    })
  }
  const rideContinue = () => {
    continueTrip(authToken, tripId).then(res => {

      if (res.data.result === 'success') {
        setPauseRide(false)
      }
    })
  }
  const rideStop = () => {
    stopTrip(authToken, selectScooter.id, selectScooter.latitude + '', selectScooter.longitude + '').then(res => {
      // console.log(res,res)
      if (res.result === 'success') {
        setEndRide(true)
        setRideTime(selectScooter?.duration)
        setStartRide(false)
        setSelectScooter({
          ...selectScooter,
          endTime: `${moment(new Date()).format('DD.MM.YYYY')},${new Date().getHours()}:${new Date().getMinutes()}`
        })
        setSeconds(0)
        AsyncStorage.removeItem('reservation')
        navigation.reset({
          index: 0,
          routes: [{name: 'EndRideScreen'}],
        })
      } else {
        setGoToParkingOpen(true)
      }
    })
  }
  return (
    <View style={styles.container}>
      <DrawerMenuButton/>
      {pushOpen &&
        <PushErrorModal pushError={pushError} isOpen={pushOpen} setIsOpen={setPushOpen} setPushError={setPushError}
                        endRide={batteryLow}/>}
      {gpsLostOpen &&
        <GpsLostModal pushError={gpsError} isOpen={gpsLostOpen} setIsOpen={setGpsLostOpen} setPushError={setGpsError}
                      endRide={true}/>}
      {selectScooter?.latitude === 0 || polygons?.length === 0  && <LoadingModal/>}
      {selectScooter?.latitude !== 0 && polygons?.length !== 0  &&
        <TrackerMap startRide={startRide} rideArea={rideArea} scooter={selectScooter} polygons={polygons}
                    startPosition={startPosition} setStartPosition={setStartPosition}/>}
      {!endRide && <StartRide scooter={selectScooter} tripId={tripId} setTripId={setTripId} seconds={seconds}
                              setSeconds={setSeconds}
                              rideStart={rideStart} ridePause={ridePause} rideContinue={rideContinue}
                              rideStop={rideStop} redZoneOpen={redZoneOpen} setRedZoneOpen={setRedZoneOpen}
                              setFirstPause={setFirstPause} error={error} firstPause={firstPause} pushError={pushError}
                              setPushError={setPushError} pushOpen={pushOpen} setPushOpen={setPushOpen}
                              setFirstPauseOpen={setFirstPauseOpen} firstPauseOpen={firstPauseOpen}
                              openParkingInfo={openParkingInfo} goToParkingOpen={goToParkingOpen}
                              setGoToParkingOpen={setGoToParkingOpen} errorOpen={errorOpen}
                              setErrorOpen={setErrorOpen} isFirstRide={isFirstRide}/>}
    </View>
  );

};

const styles = StyleSheet.create({

  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

});
export default RideScreen;
