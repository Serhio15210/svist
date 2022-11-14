import React, {useEffect, useRef, useState} from "react";
import {Dimensions, ImageBackground, Linking, StyleSheet, Text, TouchableOpacity, Vibration, View} from "react-native";
import {normalize} from "../responsive/fontSize";
import BackPath from "../../assets/backPath.svg";
import UnScannedLamp from "../../assets/unScannedLamp.svg";
import ScannedLamp from "../../assets/scannedLamp.svg";
import scannerBg from "../../assets/scannerBg.png";
import {useNavigation} from "@react-navigation/native";
import AllowCameraModal from "../components/AllowCameraModal";

import ScanErrorModal from "../components/ScanErrorModal";
import EnterCodeModal from "../components/EnterCodeModal";
import {createTrip, getCurrentTrip} from "../api/scooterApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../provider/AuthProvider";
import ErrorModal from "../components/ErrorModal/ErrorModal";
import {BarCodeScanner} from 'expo-barcode-scanner';
import {Camera} from 'expo-camera';
import {useSvistContext} from "../provider/SvistProvider";
import { useLinkTo } from '@react-navigation/native';
const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#22ff00";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const ScannerScreen = () => {
  const navigation = useNavigation()
  const cameraRef=useRef()
  const linkTo = useLinkTo();
  const [scanned, setScanned] = useState(false)
  const [disableScan, setDisableScan] = useState(false)
  const {authToken,setSeconds,costSettings,i18n }=useAuth()
  const [cameraAllow, setCameraAllow] = useState(false)
  const [errorScan, setErrorScan] = useState(false)
  const [enterCode, setEnterCode] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [permissionChange, setPermissionChange] = useState(false)
  const [error, setError] = useState('')
  const [grant, setGrant] = useState('granted')
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
  const [status, setStatus] = useState({});
  const {reservation, setReservation}=useSvistContext()
  const tripStart=(value)=>{
    console.log(value)
    setDisableScan(true)
    getCurrentTrip(authToken).then(res=>{
      if (res?.is_reserve&&res?.status==='in_process'){
        console.log('current',res?.name_scooter,value)
        if (res?.name_scooter===value) {
          console.log('---created trip reserved ---')
          AsyncStorage.setItem('reservation', '')
          setSeconds(costSettings?.max_reserve_minutes * 60)
          setReservation(false)

          navigation.reset({
            index: 0,
            routes: [{name: 'MainScreen'},{name: 'RideScreen'}],
          })
          // navigation.navigate('RideScreen')
          // setScanned(!scanned)
        }else {
          setError('Уже есть активная поездка')
          setErrorOpen(true)

        }
      }else{
        setDisableScan(true)
        createTrip(authToken,value).then(res=>{
          if (res.result==='success'){

            console.log('---created trip from scanner---')
            AsyncStorage.setItem('reservation', '')
            console.log('imei',res?.scooter?.imei)

            navigation.reset({
              index: 0,
              routes: [{name: 'MainScreen'},{name: 'RideScreen'}],
            })

          }else {
            setError(res?.message||res)
            setErrorOpen(true)
          }
        })
      }
    })

  }
  useEffect(()=>{
    if(!errorOpen){
      setScanned(!scanned)
      setDisableScan(false)
    }
  },[errorOpen])
  const checkPermission = () => {
    const [status, requestPermission] = Camera.useCameraPermissions()
    console.log('status',status)
    requestPermission().then(res=>{
      console.log('r',res)
    })

  }
  let permModal=useRef()
  const [tries,setTries]=useState(0)
  useEffect(() => {
    // permModal?.openModal()
    // checkPermission()
    // if (navigation.isFocused()) {
    //   let interval = setInterval(() => {
    //     checkPermission()
    //   }, 1000)
    //   return (() => {
    //     clearInterval(interval)
    //   })
    // }
    Camera.getCameraPermissionsAsync().then(res=>{
      if (res.granted){
        setCameraAllow(false)
      } else {
        setCameraAllow(true)
      }

    })
  }, [])
  // useEffect(()=>{
  //   grant==='updated'&&navigation.goBack()
  // },[grant])
  const __handleFlashMode = () => {
    if (flashMode === Camera.Constants.FlashMode.torch) {
      setFlashMode(Camera.Constants.FlashMode.off)
    } else if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.torch)
    }

  }

  return (
    <View style={{flex:1}}>
      {errorScan && <ScanErrorModal setIsOpen={setErrorScan} isOpen={errorScan}/>}
      {enterCode && <EnterCodeModal setIsOpen={setEnterCode} isOpen={enterCode}/>}
      {cameraAllow && <AllowCameraModal setIsOpen={setCameraAllow} isOpen={cameraAllow} checkPermission={checkPermission} />}
      {errorOpen&&<ErrorModal setIsOpen={setErrorOpen} isOpen={errorOpen} errorText={error}/>}
      {cameraAllow?
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'black'}}>
          <View style={styles.topOverlay}>
            <TouchableOpacity onPress={() => {
              navigation.goBack()
            }} style={{height: normalize(48)}}>
              <BackPath width={normalize(75)} height={normalize(48)}/>
            </TouchableOpacity>
            {/*<Feather name={'info'} style={{color: 'white', fontSize: normalize(20)}}/>*/}
          </View>
          <ImageBackground source={scannerBg} style={{width: '100%', height: '100%', position: 'absolute'}}
                           resizeMode="cover"/>
          <View style={styles.bottomOverlay}>
            {flashMode === Camera.Constants.FlashMode.torch ? <ScannedLamp onPress={__handleFlashMode}/> : <UnScannedLamp onPress={__handleFlashMode}/>}
            <Text style={{color: 'white', fontSize: normalize(16), marginTop: normalize(70)}}
                  onPress={() => setEnterCode(true)}>{i18n.t('enterCodeManually')}</Text>
          </View>
        </View>
       :
      <Camera
        key={0}
        flashMode={flashMode}
        // onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{width:'100%',height:'100%'}}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={(e)=>{
          if (e.data){
            console.log(e.data)
            if ( !disableScan&&!errorOpen){
              Vibration.vibrate(100)
              tripStart('S'+e.data.split('S')[1])
            }

          }
        }}
      >
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.topOverlay}>
            <TouchableOpacity onPress={() => {
              navigation.goBack()
            }} style={{height: normalize(48)}}>
              <BackPath width={normalize(75)} height={normalize(48)}/>
            </TouchableOpacity>
            {/*<Feather name={'info'} style={{color: 'white', fontSize: normalize(20)}}/>*/}
          </View>
          <ImageBackground source={scannerBg} style={{width: '100%', height: '100%', position: 'absolute'}}
                           resizeMode="cover"/>
          <View style={styles.bottomOverlay}>
            {flashMode === Camera.Constants.FlashMode.torch ? <ScannedLamp onPress={__handleFlashMode}/> : <UnScannedLamp onPress={__handleFlashMode}/>}
            <TouchableOpacity onPress={() => setEnterCode(true)} style={{ marginTop: normalize(70)}}>
              <Text style={{color: 'white', fontSize: normalize(16)}}
                     >{i18n.t('enterCodeManually')}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Camera>}

    </View>

  );
}

const styles = StyleSheet.create({
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  rectangle: {
    height: normalize(300),
    width: '90%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 20
  },

  topOverlay: {
    justifyContent: "space-between",
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    top: normalize(55),
    zIndex: 100,
    paddingRight: normalize(26)
  },

  bottomOverlay: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: normalize(20),
    maxHeight: normalize(200),
    height: '100%'
  },

  leftAndRightOverlay: {
    height: '100%',
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor
  }
});

export default ScannerScreen;
