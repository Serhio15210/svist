import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, LogBox, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import LogoWhite from "../../../assets/logoWhite.svg"
import AuthWhiteButton from "../../../assets/authWhiteButton.svg"
import Apple from "../../../assets/apple.svg"
import GoogleIcon from "../../../assets/google.svg"
import PhoneInput from "react-native-phone-number-input";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useAuth} from "../../provider/AuthProvider";
import {useNavigation} from "@react-navigation/native";
import {validationAppleGoogle, validationPhone} from "../../api/authApi";
import OutlineButton from "../../../assets/outlineButton.svg";
import InputLine from "../../../assets/inputLine.svg";
import ignoreWarnings from 'ignore-warnings';
import {GT} from "../../constants/fonts";
import * as WebBrowser from "expo-web-browser"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {GOOGLE_ANDROID_ID, GOOGLE_IOS_ID} from "../../constants/auth";
import * as Notifications from "expo-notifications";
// import {GoogleSignin} from "@react-native-google-signin/google-signin";
//
// WebBrowser.maybeCompleteAuthSession()
// GoogleSignin.configure({
//   webClientId: Platform.OS==='ios'?GOOGLE_IOS_ID:GOOGLE_ANDROID_ID
// });
const LogInScreen = () => {
  const [isFocus, setIsFocus] = useState(false)
  const [isValidNumber, setIsValidNumber] = useState(true)
  const [errorText, setErrorText] = useState('')
  const inputEl = useRef(null);
  const {
    phone,
    setPhone,
    isNewUser,
    setIsNewUser,
    isSent,
    setIsSent,
    appToken,
    user,
    setUser,
    setAuthToken,
    setAuthKey,
    setIsAuth,i18n
  } = useAuth()
  ignoreWarnings('warn', ['ViewPropTypes', '[react-native-gesture-handler]'])
//a08b8af1a8b15ee5b58603e987cbf25e
  LogBox.ignoreLogs([
    'ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from \'deprecated-react-native-prop-types\'.',
    'NativeBase: The contrast ratio of',
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ])
  const [notificationToken,setNotificationToken]=useState('')
// useEffect(() => {
//     Notifications.getDevicePushTokenAsync().then(res=>{
//       console.log(res.data)
//       setNotificationToken(res.data)
//     })
//
//   },[])
//   const navigation = useNavigation()
//
//   useEffect(()=>{
//     if (navigation.isFocused()) {
//
//       GoogleSignin.revokeAccess()
//     }
//
//   },[navigation.isFocused()])
//   async function onGoogleButtonPress() {
//     // Get the users ID token
//     const { idToken } = await GoogleSignin.signIn();
//
//     if (idToken){
//       validationAppleGoogle(idToken, 'google').then(res => {
//         console.log(res)
//         if (res.is_new_user) {
//           setAuthKey(res?.auth_key)
//           navigation.navigate('GoogleInScreen')
//         } else {
//           setAuthToken(res?.access_token)
//           AsyncStorage.setItem('auth', res.access_token)
//           setIsAuth(true)
//         }
//       })
//       GoogleSignin.revokeAccess()
//     }
//
//
//   }


  const sentPhone = () => {
    console.log('send')
    setIsSent(isSent + 1)
    validationPhone(phone, appToken).then(res => {
      console.log(res)
      if (res?.data?.success) {
        setIsNewUser(res?.data?.isNewUser)
        setIsValidNumber(true)
        navigation.navigate('NumCodeScreen')
        setErrorText(null)
      } else {
        setErrorText(res)
        setIsValidNumber(false)
        setIsSent(0)
      }
    })

  }
  useEffect(() => {
    if (navigation.isFocused()) {
      setIsSent(0)
    }

  }, [phone])

  return (

      <Pressable style={{...styles.container, backgroundColor: isValidNumber ? '#FE7B01' : '#EF4E4E'}}
                 onPress={Keyboard.dismiss} accessible={false}>
        <LogoWhite/>
        <View style={styles.content}>
          <View style={{...styles.centerBlock}}>
            <OutlineButton width={normalize(350)}/>
            <PhoneInput
                layout="second"
                defaultCode={'SK'}
                containerStyle={styles.phoneInputContainer}
                codeTextStyle={{color: 'white', fontSize: normalize(16)}}
                placeholder={i18n.t('inputPhoneNumber')||''}
                textInputStyle={{color: 'white', padding: 0, fontSize: normalize(16)}}
                textContainerStyle={styles.phoneInputText}
                countryPickerButtonStyle={{color: 'white', fontSize: normalize(16)}}
                textInputProps={{placeholderTextColor: "#ffffff", fontSize: normalize(16), selectionColor: 'white'}}
                renderDropdownImage={<AntDesign name={'down'} style={{color: 'white'}}/>}
                autoFocus={false}

                onChangeFormattedText={(e) => setPhone(e)}
                value={phone}
            />

            <View style={{position: 'absolute', left: normalize(106)}}>
              <InputLine height={normalize(32)}/>
            </View>
          </View>
          {/*<TextInput style={{borderWidth:1,borderColor:'white',marginTop:20}} multiline={true} value={notificationToken}/>*/}
          {errorText ? <Text style={styles.errorText}>{errorText || i18n.t('invalidPhoneNumber')}</Text> : <></>}
          <TouchableOpacity style={{...styles.centerBlock, marginTop: normalize(16)}} onPress={() => {
            isSent === 0 && sentPhone()
          }} accessible={!isSent}>
            {phone ? <AuthWhiteButton width={normalize(342)}/> : <OutlineButton width={normalize(342)}/>}
            <Text style={{
              ...styles.buttonText,
              color: phone ? isValidNumber ? '#FE7B01' : '#EF4E4E' : 'white'
            }}>{i18n.t('continue')}</Text>
          </TouchableOpacity>
          <Text style={styles.text}>{i18n.t('continueWith')}</Text>
          <View style={styles.authButtonsRow}>
            {/*<TouchableOpacity style={styles.centerBlock}*/}

            {/*>*/}
            {/*  <OutlineButton width={normalize(342)}/>*/}
            {/*  <Apple style={{position: 'absolute'}}/>*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity style={styles.centerBlock}
                              onPress={() => {
                                // onGoogleButtonPress()
                              }}
            >
              {/*<AuthMiniInfoButton width={normalize(163)}/>*/}
              <OutlineButton width={normalize(342)}/>
              {Platform.OS==='ios'?<Apple style={{position: 'absolute'}}/>:<GoogleIcon style={{position: 'absolute'}}/>}
            </TouchableOpacity>
          </View>
          <Text style={{...styles.text, textAlign: 'center'}}>{i18n.t('terms')}</Text>
        </View>
      </Pressable>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FE7B01',
    padding: normalize(24),
    alignItems: 'center',
    paddingTop: normalize(260),
    justifyContent: 'space-between',
    paddingBottom: normalize(40),
  },
  content: {
    width: '100%', marginTop: normalize(30)
  },
  centerBlock: {
    justifyContent: 'center', alignItems: 'center'
  },
  buttonText: {
    position: 'absolute', color: '#FE7B01', fontSize: normalize(24), fontFamily: GT
  },
  text: {
    fontSize: normalize(12), color: 'white', alignSelf: 'center', marginTop: normalize(24)
  },
  phoneInputContainer: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    width: '100%',
    color: 'white',
    justifyContent: 'center',
    position: 'absolute',
    height: normalize(53),
    borderRadius: 20,
    marginRight: 0,
    padding: 0, fontSize: normalize(16), left: normalize(16)
  },
  phoneInputText: {
    backgroundColor: 'transparent',
    color: 'white',
    width: '100%',
    borderRadius: 20,
    height: normalize(55),
    fontSize: normalize(16),
    justifyContent: 'center',
    textAlign: 'center'
  },
  errorText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: normalize(16),
    fontFamily: GT,
    textAlign: 'center',
    marginTop: normalize(5)
  },
  authButtonsRow:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(24),
    justifyContent: 'space-around'
  }
})
export default LogInScreen;
