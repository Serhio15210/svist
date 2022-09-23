import React, {useEffect, useRef, useState} from "react";
import {Image, LogBox, StyleSheet, Text, View} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import MapView, {Circle, Marker, Polygon, PROVIDER_GOOGLE} from "react-native-maps";
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import scan from "../../assets/scan.png";
import LocationErrorModal from "../components/LocationErrorModal";
import BecomePartnerModal from "../components/BecomePartnerModal";
import FreeRideModal from "../components/FreeRideModal";
import ConnectionErrorModal from "../components/ConnectionErrorModal";
import UserMarker from "../components/UserMarker";
import {normalize} from "../responsive/fontSize";
import ConfirmReservationModal from "../components/ConfirmReservationModal";
import ReservationBlock from "../components/ReservationBlock";
import MainButton from "../../assets/mainButton.svg";
import InfoModalButton from "../../assets/infoModalButton.svg";
import DrawerMenuButton from "../components/DrawerMenuButton";
import {useSvistContext} from "../provider/SvistProvider";
import {getCloseScooter, getCurrentTrip, getPolygons, getScooters, isRange, stopTrip} from "../api/scooterApi";
import {useAuth} from "../provider/AuthProvider";
import ReserveModal from "../components/ReserveModal";
import SocketIOClient from "socket.io-client";
import OutZoomMarker from "../components/OutZoomMarker";
import ScooterMarker from "../components/ScooterMarker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingModal from "../components/LoadingModal";
import {getCards, getCostSettings} from "../api/authApi";
import * as Location from 'expo-location';
import * as TaskManager from "expo-task-manager"
import {GT} from "../constants/fonts";
import ignoreWarnings from "ignore-warnings";
import * as RNFS from "expo-file-system";
// SplashScreen.preventAutoHideAsync();
const FONT = 'GTEestiProText-BookItalic'
const LOCATION_TASK_NAME = "LOCATION_TASK_NAME"
let foregroundSubscription = null
const MainScreen = () => {
  let mapRef = useRef();
  const marker = useRef();
  const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0});
  const [coordinatesNearby, setCoordinatesNearby] = useState({latitude: 0, longitude: 0});
  const navigation = useNavigation();
  const [locationError, setLocationError] = useState(null);
  const [openLocationError, setOpenLocationError] = useState(false);
  const [openCityError, setOpenCityError] = useState(false);
  const [checkCityError, setCheckCityError] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const {isConnectedErrorOpen, setIsConnectedErrorOpen,reservation, setReservation} = useSvistContext()
  const [openFreeRide, setOpenFreeRide] = useState(false);
  const [confirmReservation, setConfirmReservation] = useState(false);
  const [error, setError] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [scooters, setScooters] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [isAdded, setIsAdded] = useState(false)
  const {authToken,costSettings,user,seconds, setSeconds} = useAuth()
  const {selectScooter, setSelectScooter, claimFreeRide} = useSvistContext()
  // const [seconds, setSeconds] = useState(costSettings?.max_reserve_minutes*60);
  const [timeout, setTimeout] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [zoomLevel, setZoomLevel] = useState({latitudeDelta: 0, longitudeDelta: 0})
  const [locationChange, setLocationChange] = useState(false)
  const [mapFocus, setMapFocus] = useState(false)
  const [scootersGet, setScootersGet] = useState(false)
  ignoreWarnings('warn', ['ViewPropTypes', '[react-native-gesture-handler]'])

  LogBox.ignoreLogs([
    'animateToCoordinate() is deprecated, use animateCamera() instead'
  ])
  // useEffect(()=>{
  //
  //     getCostSettings(authToken).then(res => {
  //       setSeconds(res.data?.max_reserve_minutes*60)
  //     })
  //
  // },[])
  const hexToRgbA = (hex) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.24)';
    }
    throw new Error('Bad Hex');
  }

  const getLocation = async () => {
    const {granted} = await Location.getForegroundPermissionsAsync()
    if (!granted) {
      console.log("location tracking denied")
      return
    }
    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove()
    // Start watching position in real-time
    let location = await Location.getCurrentPositionAsync({});

    setCoordinates(location.coords);
    mapRef?.current?.animateToCoordinate({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }, 1000)
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      location => {

        setCoordinates({latitude: location.coords.latitude, longitude: location.coords.longitude})
      }
    )
  }

  const stopReservation = () => {
    stopTrip(authToken, selectScooter?.tripId || selectScooter?.id, selectScooter.latitude + '', selectScooter.longitude + '').then(res => {
      console.log(res)
      console.log('stop')
      if (res.result === 'success') {
        AsyncStorage.removeItem('reservation')
        if (seconds > 0) {
          setSeconds(costSettings?.max_reserve_minutes*60)
          setCancel(true)
        } else {
          setSeconds(costSettings?.max_reserve_minutes*60)
          setTimeout(true)
        }
      }
      // else {
      //   console.log(res)
      //   setError('Ошибка остановки резервирования')
      //   setErrorOpen(true)
      // }
    })
  }
  const checkReservation = () => {
    getCurrentTrip(authToken).then(res => {
      if (res?.status === 'in_process'  ) {
        setSelectScooter(res)
        if (res?.is_reserve&& parseInt(res?.duration) > 0) {
          AsyncStorage.getItem('reservation').then(time => {
            if (time) {
              console.log('time',time)
              setSeconds(parseInt(time))
              setReservation(true)
            } else setSeconds(costSettings?.max_reserve_minutes*60)
          })
        } else {
          if(parseInt(res?.duration) > 0){
            navigation.reset({
              index: 0,
              routes: [{name: 'RideScreen'}],
            })
          }else navigation.navigate('RideScreen')

        }
      }
    })
  }
  const checkLocation = async () => {
    const res = await Location.getForegroundPermissionsAsync()
    return res.granted
  }
  const checkCityAccess =  () => {
    isRange(authToken,coordinates).then((res)=>{
      if (!res.data.is_range){
        setOpenCityError(true)
      }

    })
  }
  useEffect(() => {

    Location.getForegroundPermissionsAsync().then(res => {
      if (res.granted) {
        getLocation()
        setOpenLocationError(false)
      } else {
        setOpenLocationError(true)
      }
    })
  }, [])
  useEffect(()=>{
    if (coordinates.latitude>0&&checkCityError&&navigation.isFocused()){
      checkCityAccess()
      setCheckCityError(false)
    }
  },[coordinates,checkCityError,navigation.isFocused()])
  useEffect(() => {
    // if (navigation.isFocused()) {
      checkReservation()
      getScooters(authToken).then(res => {
        setScooters(res)
        setScootersGet(true)
      })
      getPolygons(authToken).then(res => {
        setPolygons(res)
      })
      // getCloseScooter(coordinates, authToken).then(res => {
      //   setCoordinatesNearby({latitude: res?.latitude, longitude: res?.longitude})
      // })
      return (() => {
        setScooters([])
        setPolygons([])
        setIsAdded(false)
        setCoordinates({latitude: 0, longitude: 0})
        setCoordinatesNearby({latitude: 0, longitude: 0})
      })

  }, [])
  useEffect(() => {
    if (navigation.isFocused()) {

      getCards(authToken).then(res => {
        if (res?.data?.data?.length > 0) {
          setIsAdded(true)
        } else {
          setIsAdded(false)
        }
      })
    }
  }, [navigation.isFocused()])
  useEffect(() => {
    if (navigation.isFocused()) {
      const socket = SocketIOClient(`https://scooter3.tcl.quazom.com:36502?token=${authToken}`, {
        transports: ['websocket']
      });
      socket.on('connect', function () {
        console.log('connect')
        socket.emit('subscribe', 'updateScooterLocation');
        socket.on('updateScooterLocation', function (data) {
          // console.log('new', data.data)

          if (data.data.is_free) {
            let pastData = scooters.filter(item => item?.scooter_name === data.data?.scooter_name)[0]
            // console.log('data', pastData)
            if (pastData?.longitude) {

              setScooters((prev) => prev.filter(item => item.scooter_name !== data.data.scooter_name).concat([{
                ...pastData,
                battery_power: data.data?.battery_level > 0 ? data.data?.battery_level : pastData?.battery_power,
                latitude: data.data.latitude,
                longitude: data.data.longitude
              }]))
            } else {

              setScooters((prev) => prev.filter(item => item.scooter_name !== data.data.scooter_name).concat([{
                ...data.data,
                battery_power: data.data?.battery_level
              }]))
            }
          } else {
            setScooters((prev) => prev.filter(item => item.scooter_name !== data.data.scooter_name))
          }
        })
      });
      // return () => {
      //   socket.disconnect();
      // };
    }
  }, [navigation.isFocused()])

  return (
    <View style={styles.container}>
      {openLocationError &&
        <LocationErrorModal isOpen={openLocationError} setIsOpen={setOpenLocationError} getLocation={getLocation}/>}
      {openCityError && <BecomePartnerModal isOpen={openCityError} setIsOpen={setOpenCityError}/>}
      {openFreeRide && !openLocationError  && <FreeRideModal isOpen={openFreeRide} setIsOpen={setOpenFreeRide}/>}
      {confirmReservation &&
        <ConfirmReservationModal isOpen={confirmReservation} setIsOpen={setConfirmReservation}
                                 setReservation={setReservation} scooter={selectScooter}/>}
      {isConnectedErrorOpen &&
        <ConnectionErrorModal isOpen={isConnectedErrorOpen} setIsOpen={setIsConnectedErrorOpen}/>}

      <DrawerMenuButton/>
      {!claimFreeRide && !isConnectedErrorOpen&&user?.avaliable_free_trip && <TouchableOpacity style={styles.claimFreeRideButton} onPress={() => {
        setOpenFreeRide(true)
      }}>
        <InfoModalButton width={normalize(282)} height={normalize(48)}/>
        <Text style={styles.claimFreeRideText}>Claim your FREE ride here</Text>
      </TouchableOpacity>}
      {!mapFocus && !openLocationError &&seconds<=0&& <LoadingModal/>}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onPress={() => {
          if (!isConnectedErrorOpen && showInfo) {
            setShowInfo(false)
            !reservation && setSelectScooter({})
          }

        }}
        onMapReady={() => {
          setMapFocus(true)
        }
        }
        initialRegion={{
          latitude: 50.455378,
          longitude: 30.519155,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}

        onRegionChange={(region) => {
          // console.log(region)
          !reservation && setZoomLevel({latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta})
        }}
        ref={mapRef}
      >
        {locationError !== 2 &&
          <Circle center={{latitude: coordinates.latitude, longitude: coordinates.longitude}} radius={150}
                  fillColor={"rgba(254, 123, 1, 0.16)"} strokeWidth={0}/>}
        {locationError !== 2 ? <Marker coordinate={{
          latitude: coordinates.latitude || 0,
          longitude: coordinates.longitude || 0,
        }} anchor={{x: 0.5, y: 0.5}}>
          <UserMarker/>
        </Marker> : <></>}
        {scooters?.map((item) => {
          return (
            <Marker coordinate={{
              latitude: parseFloat(item?.latitude) || 0,
              longitude: parseFloat(item?.longitude) || 0,
            }} key={item?.scooter_id} onCalloutPress={() => {

              if (!reservation && !isConnectedErrorOpen) {

                setSelectScooter(item)
                setShowInfo(true)
              }
            }} onSelect={() => {

              if (!reservation && !isConnectedErrorOpen) {
                setSelectScooter(item)
                setShowInfo(true)
              }
            }} onPress={() => {

              if (!reservation && !isConnectedErrorOpen) {

                setSelectScooter(item)
                setShowInfo(true)
              }
            }} style={{alignItems: "center", justifyContent: "center", width: 80}}>
              {zoomLevel.longitudeDelta <= 0.035896338522420024 && zoomLevel.latitudeDelta <= 0.057341003097498344 ?
                <ScooterMarker item={item} selectMarker={selectScooter}/> :
                selectScooter?.scooter_id === item?.scooter_id ?
                  <ScooterMarker item={item} selectMarker={selectScooter}/> : <OutZoomMarker/>
              }

            </Marker>
          );
        })}

        {/*{polygons?.length > 0 && polygons?.map(item =>*/}
        {/*  <Polygon key={item?.id} coordinates={item?.polygon}*/}
        {/*           fillColor={hexToRgbA(item?.color)}*/}
        {/*           strokeColor={item?.color}*/}
        {/*           strokeWidth={2}/>)}*/}
      </MapView>
      <View style={styles.scanRowContainer}>
        <View style={{...styles.rowContainer, justifyContent: "space-between"}}>
          <TouchableOpacity style={styles.screenButton} onPress={() => setOpenCityError(true)}>
            <Ionicons name={"ios-warning-outline"} style={{fontSize: normalize(24)}}/>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => {
                              !isConnectedErrorOpen && navigation.navigate('ScannerScreen')
                            }}>
            <MainButton width={normalize(230)} height={normalize(56)} fill={'red'}/>
            <View style={styles.scanButton}>
              <Image source={scan} style={{width: 24, height: 24}}/>
              <Text style={styles.buttonText}>Scan</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.screenButton}
                            onPress={() => {
                              checkLocation().then(res => {
                                if (res) {
                                  console.log('here press')
                                  setOpenLocationError(false)
                                  if (coordinates?.latitude !== 0) {
                                    mapRef?.current?.animateToCoordinate({
                                      latitude: coordinates.latitude,
                                      longitude: coordinates.longitude,
                                    }, 1000)
                                  }
                                } else {
                                  setOpenLocationError(true)
                                }
                              })
                            }}>
            {/*<MaterialIcons name={"gps-fixed"} style={{fontSize: 24}}/>*/}
            <MaterialIcons name="gps-fixed" size={24} color="black"/>
          </TouchableOpacity>
        </View>
        {showInfo &&
          <ReserveModal confirmReservation={confirmReservation} setConfirmReservation={setConfirmReservation}
                        setShowInfo={setShowInfo} scooter={selectScooter} isAdded={isAdded} setIsAdded={setIsAdded}/>}
        {reservation && <ReservationBlock setReservation={setReservation} seconds={seconds} setSeconds={setSeconds}
                                          selectScooter={selectScooter} setErrorOpen={setErrorOpen}
                                          errorOpen={errorOpen} stopReservation={stopReservation} cancel={cancel}
                                          setCancel={setCancel} setTimeout={setTimeout} timeout={timeout}
                                          reservation={reservation}/>}
      </View>
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
  scanRowContainer: {
    position: "absolute", bottom: normalize(32), zIndex: 1000, width: "95%"
  },
  map: {
    ...StyleSheet.absoluteFillObject, zIndex: -1
  },
  screenButton: {
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: 48,
  },
  scanButton: {
    alignItems: "center",
    paddingLeft: normalize(36),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: "row",
    paddingRight: normalize(70),
    position: 'absolute'

  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reserveBlock: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: normalize(25),
    width: "100%",
    marginTop: normalize(15),

  },
  reserveTitle: {
    fontFamily: GT,
    fontSize: normalize(24),
    fontWeight: "500",
  },
  buttonText: {
    color: "white",
    fontSize: normalize(24),
    fontFamily: GT
  },
  cardDot: {
    width: 4, height: 4, backgroundColor: "#1F1E1D", borderRadius: 10, marginRight: normalize(5)
  },
  reserveButton: {
    borderColor: 'rgba(254, 123, 1, 0.24)',
    borderWidth: 1,
    padding: 16,
    width: '100%',
    marginTop: normalize(35),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reserveButtonText: {
    color: '#FE7B01',
    fontFamily: GT,
    fontWeight: '500',
    fontSize: normalize(24)
  },
  claimFreeRideButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 100,
    top: normalize(50),
    alignSelf: 'center',
    right: normalize(24)
  },
  claimFreeRideText: {
    color: 'white',
    fontSize: normalize(16),
    position: 'absolute',
    alignSelf: 'flex-start',
    fontFamily: GT,
    marginLeft: normalize(28)
  }
});
export default MainScreen;
