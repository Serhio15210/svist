import React, {useState} from 'react';
import {useAuth} from "../../provider/AuthProvider";
import {useNavigation} from "@react-navigation/native";
import {Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import ErrorIcon from "../../../assets/errorIcon.svg";
import AuthWhiteButton from "../../../assets/authWhiteButton.svg";
import OutlineButton from "../../../assets/outlineButton.svg";
import {profileUpdate} from "../../api/authApi";
import AuthBackButton from "../../../assets/authBackButton.svg";
import {GT} from "../../constants/fonts";

const FillEmailScreen = () => {
  const {name, setName, setSurname, surname, setEmail, email, authToken} = useAuth()
  const [errorEmail, setErrorEmail] = useState(false)
  const [focusEmail, setFocusEmail] = useState(false)
  const navigation = useNavigation()

  const validateEmail = () => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const sendInfo = () => {
    profileUpdate(name, surname, email, '', authToken).then(res => {
      res?.data?.data?.success ? navigation.navigate('FillAgeScreen') : setErrorEmail(true)
    })
  }
  return (
    // <ScrollView style={{flex:1}} scrollEnabled={focusEmail}>
    <Pressable onPress={Keyboard.dismiss} style={{flex:1}}>
    <View style={{...styles.container, backgroundColor: errorEmail ? '#EF4E4E' : '#FE7B01'}}>
      <TouchableOpacity style={{position: 'absolute', left: 0, top: normalize(48)}} onPress={() => navigation.goBack()}>
        <AuthBackButton/>
      </TouchableOpacity>
      <View style={{width: '100%', marginBottom: normalize(24)}}>
        <Text style={styles.title}>Fill in your email</Text>
        <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas risus
          pellentesque.</Text>

        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'flex-start', marginTop: normalize(40), width: '100%'}}>
          {focusEmail ? <OutlineButton width={'100%'}/> : <OutlineButton opacity={'0.24'} width={'100%'}/>}
          <TextInput placeholder={'Fill in an e-mail'} style={styles.input} placeholderTextColor={'white'}
                     onChangeText={(e) => setEmail(e)} value={email} onFocus={() => setFocusEmail(true)}
                     onBlur={() => setFocusEmail(false)}/>
          {errorEmail && <ErrorIcon style={{position: 'absolute', right: normalize(34)}}/>}
        </TouchableOpacity>
        {errorEmail && <Text style={styles.errorText}>The email you entered was incorrect.</Text>}
      </View>
      <TouchableOpacity style={{...styles.centerBlock}} onPress={() => {
        if (validateEmail()) {
          setErrorEmail(false)
          sendInfo()
        } else {
          setErrorEmail(true)
        }
      }}>
        {email ? <AuthWhiteButton/> : <OutlineButton/>}
        <Text style={{
          ...styles.buttonText,
          color: errorEmail ? email ? '#EF4E4E' : 'white' : email ? '#FE7B01' : 'white'
        }}>Continue</Text>
      </TouchableOpacity>


    </View>
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
  }
})

export default FillEmailScreen;
