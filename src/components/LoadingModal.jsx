import React from 'react';
import {Image, Modal, StyleSheet, Text, View} from 'react-native';
import {normalize} from '../responsive/fontSize';
import {useAuth} from '../provider/AuthProvider';
import {GT} from "../constants/fonts";

const LoadingModal = ({setOpenLoading}) => {
  const {setIsAuth,authToken,i18n}=useAuth()
  // useEffect(()=>{
  //   const timeout=setTimeout(()=>{
  //     console.log(authToken)
  //       createCard(authToken).then((res) => {
  //         if (res?.data.data?.cardId>0){
  //           AsyncStorage.setItem('auth', authToken)
  //           setIsAuth(true)
  //           setOpenLoading(false)
  //         }
  //       });
  //   },3000)
  //   return (()=>clearTimeout(timeout))
  // },[])
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.container}>
        <View style={styles.modalBlock}>
          {/* <Lottie source={require('../assets/loadingAnimation.json')} autoPlay loop /> */}
          {/*<GifImage*/}
          {/*  source={require('../../assets/loadingAnimation.gif')}*/}
          {/*  style={{*/}
          {/*    width: normalize(250),*/}
          {/*    height: normalize(150),*/}
          {/*  }}*/}
          {/*  resizeMode={'cover'}*/}
          {/*/>*/}
          <Image source={require('../../assets/loadingAnimation.gif')} style={{height:normalize(150),width:normalize(250)}}/>

          <Text style={styles.text}>{i18n.t('loading')}</Text>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  modalBlock: {
    backgroundColor: '#FE7B01',
    borderRadius: 25,
    padding: normalize(48),
    paddingTop:0,
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: normalize(24),

    fontWeight: '500',
    fontFamily: GT,
  },
});
export default LoadingModal;
