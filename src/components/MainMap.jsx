import React, {useRef, useState} from 'react';
import MapView, {Circle, Marker, PROVIDER_GOOGLE,Polygon} from "react-native-maps";
import UserMarker from "./UserMarker";
import ScooterMarker from "./ScooterMarker";
import OutZoomMarker from "./OutZoomMarker";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {normalize} from "../responsive/fontSize";
import MainButton from "../../assets/mainButton.svg";
import scan from "../../assets/scan.png";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {GT} from "../constants/fonts";

const MainMap = ({
                   reservation,
                   showInfo,
                   setShowInfo,
                   isConnectedErrorOpen,
                   setSelectScooter,
                   selectScooter,
                   locationError,
                   scooters,
                   polygons,
                   coordinates,
                   setOpenCityError,
                   checkLocation,
                   setOpenLocationError,mapRef,setMapFocus
                 }) => {
  const [zoomLevel, setZoomLevel] = useState({latitudeDelta: 0, longitudeDelta: 0})
  const marker = useRef();
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
  return (
    <>
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

        {polygons?.length > 0 && polygons?.map(item =>
          <Polygon key={item?.id} coordinates={item?.polygon}
                   fillColor={hexToRgbA(item?.color)}
                   strokeColor={item?.color}
                   strokeWidth={2}/>)}
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
                                      latitudeDelta: 0.05,
                                      longitudeDelta: 0.05,
                                    }, 1000)
                                  }
                                } else {
                                  setOpenLocationError(true)
                                }
                              })
                            }}>

            <MaterialIcons name="gps-fixed" size={24} color="black"/>
          </TouchableOpacity>
        </View>
      </View>
      </>
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
      export default MainMap;
