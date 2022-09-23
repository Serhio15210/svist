import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import LogoWhite from "../../../assets/logoWhite.svg"
import AuthWhiteButton from "../../../assets/authWhiteButton.svg"
import AuthMiniInfoButton from "../../../assets/authMiniInfoButton.svg"
import Apple from "../../../assets/apple.svg"
import GoogleIcon from "../../../assets/google.svg"
import PhoneInput from "react-native-phone-number-input";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useAuth} from "../../provider/AuthProvider";
import {useNavigation} from "@react-navigation/native";
import {validationAppleGoogle, validationGoogle, validationPhone} from "../../api/authApi";
import OutlineButton from "../../../assets/outlineButton.svg";
import InputLine from "../../../assets/inputLine.svg";
import {LogBox} from 'react-native'
import ignoreWarnings from 'ignore-warnings';
import {GT} from "../../constants/fonts";
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import {makeRedirectUri} from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from 'expo-apple-authentication';

WebBrowser.maybeCompleteAuthSession()
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
    setIsAuth
  } = useAuth()
  ignoreWarnings('warn', ['ViewPropTypes', '[react-native-gesture-handler]'])
//a08b8af1a8b15ee5b58603e987cbf25e
  LogBox.ignoreLogs([
    'ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from \'deprecated-react-native-prop-types\'.',
    'NativeBase: The contrast ratio of',
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ])

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: '77036362618-598s07b0eohv5bsbl99usa0laoqlo9dq.apps.googleusercontent.com',
    clientId: '351919190833-r75t26st2uoa1j5i3dfgniu9hcag56vj.apps.googleusercontent.com',
    androidClientId: '351919190833-cqckdssfe4pvqb4hqdihtnnmdh1btjah.apps.googleusercontent.com',
    iosClientId: '351919190833-qsip66vvjt1elh2p7l16uvck327ri78u.apps.googleusercontent.com',

    // redirectUri: makeRedirectUri({
    //   scheme: 'svist'
    // }),
  })
  const navigation = useNavigation()
  useEffect(() => {
    // if (isAddedToken) {
    //   if (authToken) {
    //     setError(false)
    //     navigation.navigate('AboutScreen')
    //   } else {
    //     setError(true)
    //   }
    // }

    if (response?.type === 'success') {
      alert(response?.params?.id_token)
      validationAppleGoogle(response?.params?.id_token, 'google').then(res => {
        console.log(res)
        if (res.is_new_user) {
          setAuthKey(res?.auth_key)
          navigation.navigate('GoogleInScreen')
        } else {
          setAuthToken(res?.access_token)
          AsyncStorage.setItem('auth', res.access_token)
          setIsAuth(true)
        }
      })
      // setGoogleToken(response?.params?.id_token);
      // getUserData(response.authentication.accessToken)
    }
  }, [response])

  async function getUserData(token) {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {Authorization: `Bearer ${token}`}
    })

    userInfoResponse.json().then(data => {
      setUser({...data, surname: data?.name.split(' ')[0], name: data?.name.split(' ')[1]});
    });
  }

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
  useEffect(() => {
    console.log(isSent)
  }, [isSent])
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
            placeholder={'Zadejte telefonní číslo'}
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
        {errorText ? <Text style={styles.errorText}>{errorText || 'Invalid number'}</Text> : <></>}
        <TouchableOpacity style={{...styles.centerBlock, marginTop: normalize(16)}} onPress={() => {
          isSent === 0 && sentPhone()
        }} accessible={!isSent}>
          {phone ? <AuthWhiteButton width={normalize(342)}/> : <OutlineButton width={normalize(342)}/>}
          <Text style={{
            ...styles.buttonText,
            color: phone ? isValidNumber ? '#FE7B01' : '#EF4E4E' : 'white'
          }}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Or
          continue with</Text>
        <View style={styles.authButtonsRow}>
          <TouchableOpacity style={styles.centerBlock} onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync();
              console.log(credential)
              validationAppleGoogle(credential?.identityToken, 'apple').then(res => {
                console.log(res)
                if (res.is_new_user) {
                  setAuthKey(res?.auth_key)
                  navigation.navigate('GoogleInScreen')
                } else {
                  setAuthToken(res?.access_token)
                  AsyncStorage.setItem('auth', res.access_token)
                  setIsAuth(true)
                }
              })
            } catch (e) {
              console.log(e)
            }
          }}>
            <AuthMiniInfoButton width={normalize(163)}/>
            <Apple style={{position: 'absolute'}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.centerBlock}
                            onPress={() => {
                              promptAsync()
                            }}
          >
            <AuthMiniInfoButton width={normalize(163)}/>
            <GoogleIcon style={{position: 'absolute'}}/>
          </TouchableOpacity>
        </View>
        <Text style={{...styles.text, textAlign: 'center'}}>If you
          are creating a new account, <Text style={{textDecorationLine: 'underline'}}>Podmienky používania and Ochrana
            osobných údajov</Text> will apply</Text>
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
    paddingBottom: normalize(40)
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
