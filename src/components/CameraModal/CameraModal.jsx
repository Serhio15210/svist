import React, {useEffect, useState} from 'react';
import {Dimensions, ImageBackground, Modal, Text, TouchableOpacity, View} from "react-native";
import {useCamera} from "react-native-camera-hooks";
import {normalize} from "../../responsive/fontSize";
import BackPath from "../../../assets/backPath.svg";
import Feather from "react-native-vector-icons/Feather";
import HowToPark from "../../../assets/howToPark.svg";
import UnScannedLamp from "../../../assets/unScannedLamp.svg";
import {styles} from "./styles";
import Index from "../HowToParkModal";
import scannerBg from "../../../assets/scannerBg.png";
import ScannedLamp from "../../../assets/scannedLamp.svg";
import {Camera} from "expo-camera";
import {useNavigation} from "@react-navigation/native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const scanBarWidth = SCREEN_WIDTH * 0.46;
const scanBarHeight = SCREEN_WIDTH * 0.0025;
const CameraModal = ({isOpen, setIsOpen, picture, setPicture}) => {
  const [{cameraRef}, {takePicture}] = useCamera(null);
  const [openHowToPark, setOpenHowToPark] = useState(false)
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
  const navigation=useNavigation()
  const captureHandle = async () => {
    try {
      const data = await cameraRef.current.takePictureAsync({quality: 0.5, base64: true});
      setPicture(data)
      setIsOpen(false)
    } catch (error) {
      console.log(error);
    }
  }

  const __handleFlashMode = () => {
    if (flashMode === Camera.Constants.FlashMode.torch) {
      setFlashMode(Camera.Constants.FlashMode.off)
    } else if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.torch)
    }

  }
  useEffect(()=>{
    if (navigation.isFocused()){
      setOpenHowToPark(true)
    }
  },[navigation.isFocused()])
  return (

    <Modal
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(!isOpen);
      }}>
      {openHowToPark && <Index isOpen={openHowToPark} setIsOpen={setOpenHowToPark}/>}
      <Camera
        flashMode={flashMode}
        ref={cameraRef}
        type={Camera.Constants.Type.back}
        style={styles.preview}>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.topOverlay}>
            <TouchableOpacity onPress={() => {
              setIsOpen(false)
            }} style={{height: normalize(48)}}>
              <BackPath width={normalize(75)} height={normalize(48)}/>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', height: normalize(48)}}>
                   <HowToPark width={normalize(185)} height={normalize(48)}/>
                   <TouchableOpacity style={{position: 'absolute', flexDirection: 'row', alignItems: 'center'}}
                                      onPress={() => setOpenHowToPark(true)}>
                     <Text style={styles.howToParkText} numberOfLines={1} adjustsFontSizeToFit={true}>How to park?</Text>
                      {/*<Feather name={'info'} style={{color: 'white', fontSize: normalize(20)}}/>*/}
                    </TouchableOpacity>

                  </TouchableOpacity>
          </View>
          <ImageBackground source={scannerBg} style={{width: '100%', height: '100%', position: 'absolute'}}
                           resizeMode="cover"/>
          <View style={styles.bottomOverlay}>
                <View style={styles.cameraButton}>
                  <View width={normalize(72)} height={normalize(56)}/>
                  <TouchableOpacity style={styles.cameraOut} onPress={() => {
                    captureHandle()
                  }}>
                    <View style={styles.cameraIn}/>
                  </TouchableOpacity>
                  {flashMode === Camera.Constants.FlashMode.torch ? <ScannedLamp onPress={__handleFlashMode}/> : <UnScannedLamp onPress={__handleFlashMode}/>}
                </View>

                <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit={true}>Watchout for your parking!</Text>
             </View>
        </View>
      </Camera>

    </Modal>
  );
};
 export default CameraModal;
