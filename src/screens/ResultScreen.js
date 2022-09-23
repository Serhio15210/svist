import React, {useEffect, useState} from 'react';
import DrawerMenuButton from "../components/DrawerMenuButton";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../responsive/fontSize";
import MiniEndRide from "../../assets/miniEndRide.svg"
import MiniSamokat from "../../assets/miniSamokat.svg"
import Wallet from "../../assets/wallet.svg"
import Routes from "../../assets/routes.svg"
import BadRide from "../../assets/badRide.svg"
import GoodRide from "../../assets/goodRide.svg"
import Min from "../../assets/min.svg"
import {useSvistContext} from "../provider/SvistProvider";
import {Path, Svg} from "react-native-svg";
import {getCurrentTrip, setRatingTrip} from "../api/scooterApi";
import {useAuth} from "../provider/AuthProvider";
import {useNavigation} from "@react-navigation/native";
import PlayIcon from "../../assets/playIcon.svg"
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';
import {GT} from "../constants/fonts";
import * as RNFS from "expo-file-system";
const ResultScreen = () => {
  const [openResult, setOpenResult] = useState(false)

  return (
    <View style={styles.container}>
      <DrawerMenuButton/>
      <ResultModal/>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        initialRegion={{
          latitude: 37.78825, longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
      </MapView>
    </View>
  )
};
const ResultModal = () => {
  const {rideTime, pauseTime} = useSvistContext()
  const [rating, setRating] = useState(0)
  const {picture, setPicture, selectScooter,setSelectScooter} = useSvistContext()
  const {authToken} = useAuth()
  const navigation = useNavigation()
  const sendRatingTrip = (rating) => {
    setRatingTrip(authToken, selectScooter?.tripId || selectScooter?.id, rating, picture).then(res => {
      console.log(res)
      if (res.data.result === 'success') {
        setPicture({})
        setSelectScooter({})
        navigation.reset({
          index: 0,
          routes: [{name: 'MainScreen'}],
        })
      }
    })
  }
  useEffect(()=>{
    getCurrentTrip(authToken).then(res=>{
      if (res?.status==='finished' ){
        setSelectScooter(res)
      }
    })

  },[])
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
    >
      <View style={styles.resultBlock}>
        <View style={{padding: normalize(24), paddingBottom: normalize(30)}}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit={true}>Your ride ended</Text>
          <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit={true}>{selectScooter?.endTime}</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginTop: normalize(30)
          }}>
            <MiniSamokat width={normalize(31)} height={normalize(24)}/>

            <View style={{width: '80%'}}>
              <View style={{width: '100%', height: 1, backgroundColor: 'white'}}/>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{...styles.text, fontSize: normalize(12)}}>Pick up</Text>
                <Text style={{...styles.text, fontSize: normalize(12)}}>End of ride</Text>
              </View>
            </View>
            <MiniEndRide width={normalize(31)} height={normalize(24)}/>
          </View>
          <View style={{...styles.rowContainer, justifyContent: 'space-between'}}>

            <View style={{...styles.rowContainer, marginTop: normalize(30)}}>
              <PlayIcon style={{marginRight: normalize(18)}}/>
              <Text style={styles.number} adjustsFontSizeToFit={true}
                    numberOfLines={1}>{Math.floor((selectScooter?.duration / 60) * 100) / 100}<Text
                style={{...styles.text}}> min.</Text></Text>
            </View>

            <View style={{...styles.rowContainer, marginTop: normalize(30)}}>
              <Wallet/>
              <Text style={{...styles.number, marginLeft: normalize(18)}} adjustsFontSizeToFit={true}
                    numberOfLines={1}>{selectScooter?.trip_sum || 0}<Text
                style={{...styles.text}}> €</Text></Text>
            </View>

          </View>
          <View style={{...styles.rowContainer, justifyContent: 'space-between'}}>

            <View style={{...styles.rowContainer, marginTop: normalize(30)}}>
              <Min style={{marginRight: normalize(18)}}/>
              <Text style={styles.number} adjustsFontSizeToFit={true}
                    numberOfLines={1}>{Math.floor((pauseTime / 60) * 100) / 100}<Text
                style={{...styles.text}}> min.</Text></Text>
            </View>
            <View style={{...styles.rowContainer, marginTop: normalize(30)}}>
              <Routes/>
              <Text style={{...styles.number, marginLeft: normalize(18)}} adjustsFontSizeToFit={true}
                    numberOfLines={1}>{Math.ceil((selectScooter?.distance / 1000) )}<Text
                style={{...styles.text}}> km.</Text></Text>
            </View>

          </View>
        </View>
        <View style={styles.secondBlock}>
          <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {
            sendRatingTrip(2)
          }}>
            <BadRide/>
            <Text style={styles.buttonText}>Bad ride</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems: 'center', marginLeft: normalize(24)}} onPress={() => {
            sendRatingTrip(5)
          }}>
            <GoodRide/>
            <Text style={styles.buttonText}>Good ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({

  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultBlock: {
    backgroundColor: '#FE7B01',
    position: 'absolute',
    bottom: 0,
    width: '100%',


  },
  title: {
    fontSize: normalize(24),
    fontFamily: GT,
    fontWeight: '500',
    color: 'white'
  },
  text: {
    color: 'white',
    fontSize: normalize(16)
  },
  number: {
    fontSize: normalize(32),
    fontWeight: '500',
    color: 'white'
  },
  secondBlock: {
    backgroundColor: 'white',
    width: '100%',
    paddingLeft: normalize(87),
    paddingRight: normalize(87),
    paddingTop: normalize(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: normalize(140)
  },
  buttonText: {
    fontSize: normalize(12), fontWeight: '700', fontFamily: GT
  }

});
export default ResultScreen;
