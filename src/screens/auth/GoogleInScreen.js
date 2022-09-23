import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from "../../provider/AuthProvider";

import {useNavigation} from "@react-navigation/native";
import {profileUpdate, validationPhone} from "../../api/authApi";
import {Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import AuthBackButton from "../../../assets/authBackButton.svg";
import OutlineButton from "../../../assets/outlineButton.svg";
import ErrorIcon from "../../../assets/errorIcon.svg";
import AuthWhiteButton from "../../../assets/authWhiteButton.svg";
import PhoneInput from "react-native-phone-number-input";
import AntDesign from "react-native-vector-icons/AntDesign";
import InputLine from "../../../assets/inputLine.svg";
import {GT} from "../../constants/fonts";

const GoogleInScreen = () => {
  const [errorPhone, setErrorPhone] = useState(false)
  const [focusEmail, setFocusEmail] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const [isValidNumber, setIsValidNumber] = useState(true)
  const [errorText, setErrorText] = useState('')
  const inputEl = useRef(null);
  const {phone,setPhone,isNewUser, setIsNewUser,isSent, setIsSent,appToken,user,setUser}=useAuth()
  const navigation = useNavigation()

  const sentPhone=()=>{
    console.log('send')
    setIsSent(isSent+1)
    validationPhone(phone,appToken).then(res=>{
      console.log(res)
      if (res?.data?.success){
        setIsNewUser(res?.data?.isNewUser)
        setIsValidNumber(true)
        navigation.navigate('GoogleNumCodeScreen')
        setErrorText(null)
      }else {
        setErrorText(res)
        setIsValidNumber(false)
        setIsSent(0)
      }
    })

  }
  useEffect(()=>{
    if (navigation.isFocused()){
      setIsSent(0)
    }

  },[phone])
  return (
    // <ScrollView style={{flex:1}} scrollEnabled={focusEmail}>
    <Pressable style={{...styles.container,backgroundColor:isValidNumber?'#FE7B01':'#EF4E4E'}} onPress={Keyboard.dismiss} accessible={false}>

      <TouchableOpacity style={{position: 'absolute', left: 0, top: normalize(48)}} onPress={() => navigation.goBack()}>
        <AuthBackButton/>
      </TouchableOpacity>
      <View style={{width: '100%', marginBottom: normalize(24)}}>
        <Text style={styles.title}>Please fill your phone</Text>
        <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas risus pellentesque.</Text>

        <View style={{...styles.centerBlock,marginTop:normalize(40)}}>
          <OutlineButton width={'100%'}/>
          <PhoneInput
            layout="second"
            defaultCode={'SK'}
            containerStyle={styles.phoneInputContainer}
            codeTextStyle={{color: 'white',fontSize:normalize(16)}}
            placeholder={'Zadejte telefonní číslo'}
            textInputStyle={{color: 'white', padding: 0,fontSize:normalize(16)}}
            textContainerStyle={styles.phoneInputText}
            countryPickerButtonStyle={{color: 'white', fontSize:normalize(16)}}
            textInputProps={{placeholderTextColor: "#ffffff", fontSize:normalize(16),selectionColor:'white'}}
            renderDropdownImage={<AntDesign name={'down'} style={{color: 'white'}}/>}
            autoFocus={false}

            onChangeFormattedText={(e)=>setPhone(e)}
            value={phone}
          />
          <View style={{position: 'absolute', left: normalize(95)}}>
            <InputLine height={normalize(32)} />
          </View>
        </View>

      </View>
      {errorText?<Text style={{alignSelf:'center',color:'white',fontSize:normalize(16),fontFamily:GT,textAlign:'center',marginTop:normalize(5) }}>{errorText||'Invalid number'}</Text>:<></>}
      <TouchableOpacity style={{...styles.centerBlock, marginTop: normalize(16)}} onPress={()=>{
        isSent===0&&sentPhone()
      }} accessible={!isSent}>
        {phone?<AuthWhiteButton width={normalize(342)} />:<OutlineButton width={normalize(342)}/>}
        <Text style={{...styles.buttonText,color:phone?isValidNumber?'#FE7B01':'#EF4E4E':'white'}}>Continue</Text>
      </TouchableOpacity>



    </Pressable>
    // {/*</ScrollView>*/}
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#FE7B01',
    padding: normalize(24),
    alignItems: 'center',
    paddingTop: normalize(175),
    justifyContent: 'space-between',
    paddingBottom: normalize(40)
  },
  content: {
    width: '100%', marginTop: normalize(30)
  },
  centerBlock: {
    justifyContent: 'center', alignItems: 'center', width: '100%'
  },
  buttonText: {
    position: 'absolute', color: '#FE7B01', fontSize: normalize(24),

    fontFamily: GT
  },
  title: {
    fontSize: normalize(24),
    color: 'white',
    marginTop: normalize(24),
    fontWeight: '500',
    fontFamily: GT
  },
  text: {
    fontSize: normalize(16), color: 'white', alignSelf: 'center', marginTop: normalize(16)
  },
  input: {
    position: 'absolute',
    color: 'white',
    width: '100%',
    paddingLeft: normalize(34),
    fontSize: normalize(16)
  },
  errorText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: normalize(16),
    marginTop: normalize(16),
    fontFamily: GT
  },
  phoneInputContainer:{
    backgroundColor: 'transparent',
    width:'100%',
    color: 'white',
    justifyContent: 'center',
    position: 'absolute',
    height: normalize(53),
    borderRadius: 20,
    marginRight: 0,
    padding: 0,fontSize:normalize(16),left:normalize(10)
  },
  phoneInputText:{
    backgroundColor: 'transparent',
    color: 'white',
    width:'100%',
    borderRadius: 20,
    height:normalize(55),
    fontSize:normalize(16),
    justifyContent: 'center',
    textAlign: 'center'
  }
})


export default GoogleInScreen;
