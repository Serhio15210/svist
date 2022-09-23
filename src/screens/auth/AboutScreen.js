import React, {useState} from 'react';
import {Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useAuth} from "../../provider/AuthProvider";
import {useNavigation} from "@react-navigation/native";
import {normalize} from "../../responsive/fontSize";
import ErrorIcon from "../../../assets/errorIcon.svg";
import AuthWhiteButton from "../../../assets/authWhiteButton.svg"
import AuthMiniInfoButton from "../../../assets/authMiniInfoButton.svg";
import OutlineButton from "../../../assets/outlineButton.svg";
import AuthBackButton from "../../../assets/authBackButton.svg";
import {GT} from "../../constants/fonts";

const AboutScreen = () => {
  const {name, setName, setSurname, surname,user} = useAuth()
  const [errorName, setErrorName] = useState(false)
  const [errorSurName, setErrorSurName] = useState(false)
  const [focusName, setFocusName] = useState(false)
  const [focusSurname, setFocusSurname] = useState(false)
  const [isNext, setIsNext] = useState(false)
  const navigation = useNavigation()

  const checkInfo = () => {
    let matchesName = name.match(/\d+/g);
    let matchesSurName = surname.match(/\d+/g);
    matchesName !== null ? setErrorName(true) : setErrorName(false)
    matchesSurName !== null ? setErrorSurName(true) : setErrorSurName(false)
    return matchesName===null&&matchesSurName===null&&surname&&name
  }
  // useEffect(()=>{
  //   if (!errorSurName&&!errorName){
  //     setIsNext(true)
  //   }
  // },[errorName,errorSurName])
  return (
    // <ScrollView style={{flex:1}} scrollEnabled={focusName||focusSurname}>
    <Pressable onPress={Keyboard.dismiss} style={{flex:1}}>
    <View style={{...styles.container, backgroundColor: errorSurName || errorName ? '#EF4E4E' : '#FE7B01'}}>
      <TouchableOpacity style={{position: 'absolute', left: 0, top: normalize(48)}} onPress={() => navigation.goBack()}>
        <AuthBackButton/>
      </TouchableOpacity>
      <View style={{width: '100%',marginBottom:normalize(24)}}>
        <Text style={styles.title}>Tell us something about you</Text>
        <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas risus
          pellentesque.</Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: normalize(40),
          justifyContent: 'space-around'
        }}>
          <TouchableOpacity style={styles.centerBlock}>
            {focusName ? <AuthMiniInfoButton/> : <AuthMiniInfoButton opacity={'0.24'}/>}
            <TextInput placeholder={'Name'} style={styles.input} placeholderTextColor={'white'} value={name}
                       onChangeText={(e) => setName(e)} onFocus={() => setFocusName(true)}
                       onBlur={() => setFocusName(false)}/>
            {errorName && <ErrorIcon style={{position: 'absolute', right: normalize(24)}}/>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.centerBlock}>
            {focusSurname ? <AuthMiniInfoButton/> : <AuthMiniInfoButton opacity={'0.24'}/>}
            <TextInput placeholder={'Surname'} style={styles.input} placeholderTextColor={'white'} value={surname}
                       onChangeText={(e) => setSurname(e)} onFocus={() => setFocusSurname(true)}
                       onBlur={() => setFocusSurname(false)}/>
            {errorSurName && <ErrorIcon style={{position: 'absolute', right: normalize(24)}}/>}
          </TouchableOpacity>

        </View>
        {errorName && <Text style={styles.errorText}>The name you entered was incorrect.</Text>}
        {errorSurName && <Text style={styles.errorText}>The surname you entered was incorrect.</Text>}
      </View>
      <TouchableOpacity style={{...styles.centerBlock }} onPress={() => {

        if (checkInfo()){
          if (name&&surname){
            user?.email?navigation.navigate('AddPaymentScreen'):navigation.navigate('FillEmailScreen')
          }

        }
      }}>
        {name&&surname?<AuthWhiteButton/>:<OutlineButton/>}
        <Text style={{...styles.buttonText, color: errorSurName || errorName ? name&&surname?'#EF4E4E':'white' : name&&surname?'#FE7B01':'white'}}>Continue</Text>
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
    justifyContent: 'center', alignItems: 'center'
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
    paddingLeft: normalize(24),
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
export default AboutScreen;
