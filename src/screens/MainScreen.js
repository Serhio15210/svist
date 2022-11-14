import React, {useEffect, useRef, useState} from "react";
import {AppState, Image, Linking, LogBox, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
// import {TouchableOpacity} from "react-native-gesture-handler";
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from "react-native-maps";
// import MapView from "react-native-map-clustering";
import {useIsFocused, useNavigation} from '@react-navigation/native';
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
import {createTrip, getCurrentTrip, getPolygons, getScooters, isRange, startTrip, stopTrip} from "../api/scooterApi";
import {useAuth} from "../provider/AuthProvider";
import ReserveModal from "../components/ReserveModal";
import SocketIOClient from "socket.io-client";
import OutZoomMarker from "../components/OutZoomMarker";
import ScooterMarker from "../components/ScooterMarker";
import LoadingModal from "../components/LoadingModal";
import {getCards, getCostSettings, getProfileInfo} from "../api/authApi";
import * as Location from 'expo-location';
import {GT} from "../constants/fonts";
import ignoreWarnings from "ignore-warnings";
import MapPolygon from "../components/MapPolygon";
import AddCardModal from "../components/AddCardModal";
import TimeoutModal from "../components/TimeoutModal";
import ReservationCanceledModal from "../components/ReservationCanceledModal";
import OutlineMarker from "../components/OutlineMarker";
import {useKeepAwake} from 'expo-keep-awake';
import hexToRgba from 'hex-to-rgba';

let foregroundSubscription = null
const MainScreen = () => {
  useKeepAwake();
  let mapRef = useRef();
  const marker = useRef();
  const isFocused = useIsFocused();
  const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0});
  const [coordinatesNearby, setCoordinatesNearby] = useState({latitude: 0, longitude: 0});
  const [coordinatesReserve, setCoordinatesReserve] = useState({});
  const navigation = useNavigation();
  const [locationError, setLocationError] = useState(null);
  const [openLocationError, setOpenLocationError] = useState(false);
  const [openCityError, setOpenCityError] = useState(false);
  const [checkCityError, setCheckCityError] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [reserved, setReserved] = useState(false);
  const {isConnectedErrorOpen, setIsConnectedErrorOpen, reservation, setReservation} = useSvistContext()
  const [openFreeRide, setOpenFreeRide] = useState(false);
  const [confirmReservation, setConfirmReservation] = useState(false);
  const [error, setError] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [scooters, setScooters] = useState([]);
  const [polygons, setPolygons] = useState([]);

  const {authToken, costSettings, user, seconds, setSeconds, setCostSettings, setUser, i18n,isAdded, setIsAdded} = useAuth()
  const {selectScooter, setSelectScooter, claimFreeRide, isFirstRide, setIsFirstRide} = useSvistContext()
  // const [seconds, setSeconds] = useState(costSettings?.max_reserve_minutes*60);
  const [addCard, setAddCard] = useState(false)
  const [timeout, setTimeout] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [cancelPress, setCancelPress] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(false)
  const [locationChange, setLocationChange] = useState(false)
  const [mapFocus, setMapFocus] = useState(false)
  const [scootersGet, setScootersGet] = useState(false)
  const [reserveName, setReserveName] = useState('')
  const [permissionChange, setPermissionChange] = useState(false)
  ignoreWarnings('warn', ['ViewPropTypes', '[react-native-gesture-handler]'])
  const {locale} = useAuth()
  LogBox.ignoreLogs([
    'animateToCoordinate() is deprecated, use animateCamera() instead'
  ])
  const socket = SocketIOClient(`https://scooter3.tcl.quazom.com:36502?token=${authToken}`, {
    transports: ['websocket']
  });

  const getLocation = async () => {
    // setLocationChange(true)
    const {granted, canAskAgain} = await Location.getForegroundPermissionsAsync()

    if (!granted && !canAskAgain) {
      Linking.openSettings();
      setPermissionChange(!permissionChange)
    }
    Location.getCurrentPositionAsync({}).then(async location => {

      setCoordinates(location.coords);
      if (Platform.OS === 'android') {
        mapRef?.current?.animateToCoordinate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 400)
      } else {
        mapRef?.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 400)
      }

      foregroundSubscription?.remove()

      foregroundSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
        },
        location => {
          setCoordinates({latitude: location.coords.latitude, longitude: location.coords.longitude})
        }
      )
      setLocationChange(true)
    }).catch(() => {
      setLocationChange(true)
    })

  }

  const reserveScooter = () => {
    createTrip(authToken, selectScooter?.scooter_name || selectScooter?.name_scooter).then(res => {
      if (res.result === 'success') {
        console.log('confirm create reserve trip')
        setSelectScooter({...selectScooter, tripId: res?.tripId})
        startTrip(authToken, res?.tripId, 1).then(res => {
          if (res.result === 'success') {
            console.log('---confirm reserve trip started---')
            setReservation(true)
            setError('')
          } else {
            setError(res?.message)
            setErrorOpen(true)
          }
        })

      } else {
        setError(res?.message || res)
        // console.log(res?.message || res)
        setErrorOpen(true)
        // setSelectScooter({})
      }
    })


  }
  const stopReservation = () => {
    stopTrip(authToken, selectScooter?.tripId || selectScooter?.id, selectScooter.latitude + '', selectScooter.longitude + '').then(res => {
      console.log(res)
      if (res.result === 'success' || res === 'Поездка не найдена'||res ==='Jazda sa nenašla'||res ==='Подорож не було знайдено'||res ==='The trip was not found') {
        if (seconds > 0) {
          // console.log('cancel',seconds,cancel)
          setCancel(true)
          setTimeout(false)
          setSelectScooter({})
          setReserveName('')
        } else {
          // console.log('time',seconds,!cancel)
          !cancel && setTimeout(true)
          setCancel(false)
        }
        setSeconds(costSettings?.max_reserve_minutes * 60)

        // setReservation(false)
      }
    })
  }
  const checkReservation = () => {
    getCurrentTrip(authToken).then(res => {
      if (res?.status === 'in_process') {
        setSelectScooter(res)
        // setCoordinatesReserve({})
        if (res?.is_reserve && parseInt(res?.duration) > 0) {
          costSettings?.max_reserve_minutes && setSeconds(parseInt(costSettings?.max_reserve_minutes * 60) - parseInt(res?.duration))
          setReservation(true)
        } else if (res?.is_been_started) {
          if (parseInt(res?.duration) > 0) {
            navigation.reset({
              index: 0,
              routes: [{name: 'RideScreen'}],
            })
          } else navigation.navigate('RideScreen')
        } else if (res?.is_been_reserved && parseInt(res?.duration) > 0) {
          stopReservation()
          setReservation(false)
        }
      }
      else if (reservation){
        setCancel(false)
        setTimeout(true)
        setSelectScooter({})
        // setReservation(false)
        setSeconds(costSettings?.max_reserve_minutes * 60)

      }
    })
  }

  const checkLocation = async () => {
    const res = await Location.getForegroundPermissionsAsync()
    return res.granted
  }

  const checkCityAccess = () => {
    isRange(authToken, coordinates).then((res) => {
      if (!res.data.is_range) {
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
          setLocationChange(true)
          setOpenLocationError(true)
        }
      })
  }, [isFocused, mapFocus, permissionChange])

  useEffect(() => {
    if (coordinates.latitude > 0 && checkCityError && isFocused) {
      checkCityAccess()
      setCheckCityError(false)
    }
  }, [coordinates, checkCityError, isFocused])
  useEffect(() => {
    if (isFocused) {
      checkReservation()
    }

  }, [isFocused, AppState.currentState])
  useEffect(() => {
    if (locationChange) {
      getScooters(authToken).then(res => {
        setScooters(res.filter(item => item.in_polygon))

      })
      getPolygons(authToken).then(res => {
        setPolygons(res)
      })
    }
    // getCloseScooter(coordinates, authToken).then(res => {
    //   setCoordinatesNearby({latitude: res?.latitude, longitude: res?.longitude})
    // })
    // return (() => {
    //   setScooters([])
    //   setPolygons([])
    //   // setIsAdded(false)
    //   // setCoordinates({latitude: 0, longitude: 0})
    //   // setCoordinatesNearby({latitude: 0, longitude: 0})
    // })
  }, [locationChange])

  useEffect(() => {
      getProfileInfo(authToken).then(info => {

        setUser(info)
        if (info?.number_of_trips > 0) {
          setIsFirstRide(false)
        } else setIsFirstRide(true)

      })
      getCostSettings(authToken).then(res => {

        setCostSettings(res.data)
      })
      getCards(authToken).then(res => {

        if (res?.data?.data?.length > 0) {
          setIsAdded(true)
        } else {
          setIsAdded(false)
        }
      })
  }, [])
  useEffect(() => {
    if (isFocused) {
      socket.on('connect', function () {
        // console.log('connect')
        socket.emit('subscribe', 'updateScooterLocation');

        socket.on('updateScooterLocation', function (data) {
          // console.log('new', data.data)
          if (data.data?.is_free||reserveName.length>0) {

            // let pastData = scooters.filter(item => item?.scooter_name === data.data?.scooter_name)[0]
            // console.log('data', pastData)
            // if (data.data?.longitude) {

              setScooters((prev) => prev.filter(item => item.scooter_name !== data.data.scooter_name).concat([{
                ...data.data,
                battery_power: data.data?.battery_level,
                latitude: data.data.latitude,
                longitude: data.data.longitude
              }]))

            // } else {
            //
            //   setScooters((prev) => scooters.filter(item => item.scooter_name !== data.data.scooter_name).concat([{
            //     ...data.data,
            //     battery_power: data.data?.battery_level
            //   }]))
            // }
          } else {
            console.log(reserveName)
            reserveName!==data.data.scooter_name&&setScooters((prev) => prev.filter(item => item.scooter_name !== data.data.scooter_name))
            // reservation&&setScooters(prev=>prev.concat([{...data.data}]))
          }
        })
      });
      // return () => {
      //   socket.disconnect();
      // };
    }
  }, [isFocused,reserveName])


  return (
    <View style={styles.container}>
      {timeout && isFocused &&
        <TimeoutModal setIsOpen={setTimeout} isOpen={timeout} setReservation={setReservation} setSeconds={setSeconds}
                      costSettings={costSettings} reserveScooter={reserveScooter}/>}
      {cancel && isFocused &&
        <ReservationCanceledModal setIsOpen={setCancel} isOpen={cancel} setReservation={setReservation}/>}
      {openLocationError &&
        <LocationErrorModal isOpen={openLocationError} setIsOpen={setOpenLocationError} getLocation={getLocation}/>}
      {openCityError && !reservation && <BecomePartnerModal isOpen={openCityError} setIsOpen={setOpenCityError}/>}
      {openFreeRide && !openLocationError && <FreeRideModal isOpen={openFreeRide} setIsOpen={setOpenFreeRide}/>}
      {confirmReservation &&
        <ConfirmReservationModal isOpen={confirmReservation} setIsOpen={setConfirmReservation}
                                 setReservation={setReservation} scooter={selectScooter}/>}
      {isConnectedErrorOpen &&
        <ConnectionErrorModal isOpen={isConnectedErrorOpen} setIsOpen={setIsConnectedErrorOpen}/>}
      <DrawerMenuButton/>
      {!claimFreeRide && !isConnectedErrorOpen && user?.avaliable_free_trip &&
        <TouchableOpacity style={styles.claimFreeRideButton} onPress={() => {
          setOpenFreeRide(true)
        }}>
          <InfoModalButton width={normalize(282)} height={normalize(48)}/>
          <Text style={styles.claimFreeRideText}>{i18n.t('claim')} {i18n.t('freeMinutes')}</Text>
        </TouchableOpacity>}

      {addCard && !isAdded && <AddCardModal setIsOpen={setAddCard} isOpen={addCard} setIsAdded={setIsAdded}/>}
      { !costSettings?.max_reserve_minutes && <LoadingModal/>}
      <MapView
        // provider={PROVIDER_GOOGLE}
        style={styles.map}
        // clusteringEnabled={true}
        // loadingEnabled={true}
        showsScale={false}
        showsBuildings={false}
        minZoomLevel={6}  // default => 0
        maxZoomLevel={15} // default => 20
        onPress={() => {
          if (!isConnectedErrorOpen && showInfo) {
            setShowInfo(false)
            setReserved(false)
            if (!reservation){
              setSelectScooter({})
              setReserveName('')
            }

          }
        }}
        onMapReady={() => {
          setMapFocus(true)
        }}
        initialRegion={{
          latitude: coordinates?.latitude > 0 ? coordinates.latitude : 48.1577172 || parseFloat(selectScooter?.latitude),
          longitude: coordinates.longitude > 0 ? coordinates.longitude : 17.1215901 || parseFloat(selectScooter?.longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onRegionChange={(region) => {
          !reservation && region.longitudeDelta <= 0.035896338522420024 && region.latitudeDelta <= 0.057341003097498344 ?
            setZoomLevel(true) : setZoomLevel(false)
        }}

        ref={mapRef}
      >
        {locationError !== 2 &&
          <Circle center={{latitude: coordinates.latitude, longitude: coordinates.longitude}} radius={150}
                  fillColor={ hexToRgba('#FE7B01',0.24)} strokeWidth={0}/>}
        {locationError !== 2 ? <Marker coordinate={{
          latitude: coordinates.latitude || 0,
          longitude: coordinates.longitude || 0,
        }} anchor={{x: 0.5, y: 0.5}}>
          <UserMarker/>
        </Marker> : <></>}

        {scooters?.map((item, index) => {
          return (
            <Marker coordinate={{
              latitude: parseFloat(item?.latitude) || 0,
              longitude: parseFloat(item?.longitude) || 0,
            }}  stopPropagation key={index} tracksViewChanges={false} tracksInfoWindowChanges={false}
            //         onCalloutPress={(e) => {
            //           e.stopPropagation()
            //           setReserved(true)
            //           if (!reservation && !isConnectedErrorOpen) {
            //             setSelectScooter(item)
            //             setShowInfo(true)
            //           }
            //         }} onSelect={(e) => {
            //           e.stopPropagation()
            //   setReserved(true)
            //   if (!reservation && !isConnectedErrorOpen) {
            //     setSelectScooter(item)
            //     setShowInfo(true)
            //   }
            // }}
                    onPress={(e) => {
              e.stopPropagation()
              // console.log(selectScooter?.scooter_id === item?.scooter_id)
              if (!reservation && !isConnectedErrorOpen) {
                setSelectScooter(item)
                // setReserveName(item?.scooter_name)
                setShowInfo(true)
              }
            }} style={{alignItems: "center", justifyContent: "center", width: 80}}>
              {zoomLevel ?
                selectScooter?.scooter_name === item?.scooter_name||selectScooter?.name_scooter===item?.scooter_name ?
                  <ScooterMarker item={item} selectMarker={selectScooter}/> :
                  <OutlineMarker item={item} selectMarker={selectScooter}/> :
                selectScooter?.scooter_name === item?.scooter_name||selectScooter?.name_scooter===item?.scooter_name ?
                  <ScooterMarker item={item} selectMarker={selectScooter}/> : <OutZoomMarker/>
              }


            </Marker>
          );
        })}

        {polygons?.length > 0 && polygons?.map(item =>
          <MapPolygon item={item} key={item?.id}/>)}
      </MapView>
      <View style={styles.scanRowContainer}>
        <View style={{...styles.rowContainer, justifyContent: "space-between"}}>
          <TouchableOpacity style={styles.screenButton} onPress={() => setOpenCityError(true)}>
            <Ionicons name={"ios-warning-outline"} style={{fontSize: normalize(24)}}/>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => {
                              if (isAdded) {
                                !isConnectedErrorOpen && navigation.navigate('ScannerScreen')
                              } else {
                                setAddCard(true)
                              }

                            }}>
            <MainButton width={normalize(230)} height={normalize(56)} fill={'red'}/>
            <View style={{...styles.scanButton, paddingRight: locale === 'eng' ? normalize(70) : normalize(40)}}>
              <Image source={scan} style={{width: 24, height: 24}}/>
              <Text style={styles.buttonText}>{i18n.t('scan')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.screenButton}
                            onPress={() => {
                              checkLocation().then(res => {
                                if (res) {
                                  setPermissionChange(!permissionChange)
                                  // console.log('here press')

                                  setOpenLocationError(false)
                                  if (coordinates?.latitude !== 0) {
                                    if (Platform.OS==='android'){
                                      mapRef?.current?.animateToCoordinate({
                                        latitude: coordinates.latitude,
                                        longitude: coordinates.longitude,
                                        latitudeDelta: 0.05,
                                        longitudeDelta: 0.05,
                                      }, 1000)
                                    }else {
                                      mapRef?.current.animateCamera({
                                          center: {
                                            latitude: coordinates.latitude,
                                            longitude: coordinates.longitude,
                                            latitudeDelta: 0.05,
                                            longitudeDelta: 0.05,
                                          }},
                                        {duration: 1000}
                                      );
                                    }
                                  }
                                  // getLocation()
                                } else {
                                  setOpenLocationError(true)
                                }
                              })
                            }}>

            <MaterialIcons name="gps-fixed" size={24} color="black"/>
          </TouchableOpacity>
        </View>
        {showInfo &&
          <ReserveModal confirmReservation={confirmReservation} setConfirmReservation={setConfirmReservation}
                        setShowInfo={setShowInfo} scooter={selectScooter} isAdded={isAdded} setIsAdded={setIsAdded}
                        setAddCard={setAddCard} addCard={addCard} reserveName={reserveName} setReserveName={setReserveName}/>}
        {reservation && <ReservationBlock setReservation={setReservation} seconds={seconds} setSeconds={setSeconds}
                                          selectScooter={selectScooter} setErrorOpen={setErrorOpen}
                                          errorOpen={errorOpen} stopReservation={stopReservation} cancel={cancel}
                                          setCancel={setCancel} setTimeout={setTimeout} timeout={timeout}
                                          reservation={reservation} reserveScooter={reserveScooter}
                                          cancelPress={cancelPress} setCancelPress={setCancelPress}/>}
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
    ...StyleSheet.absoluteFillObject, zIndex: -1,
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
