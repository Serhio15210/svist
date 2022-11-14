import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCostSettings, loginApp} from "../api/authApi";
import {eng, sk,   ukr} from "../localizations/localizations";
import {I18n} from "i18n-js";

const AuthContext = React.createContext(null);
const AuthProvider = ({children}) => {
  const [user, setUser] = useState({})
  const [userCards, setUserCards] = useState([])
  const [isAuth, setIsAuth] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [googleToken, setGoogleToken] = useState('')
  const [appToken, setAppToken] = useState('')
  const [authKey, setAuthKey] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [card, setCard] = useState({
    number: '',
    date: '',
    cvv: ''
  })
  const [isSent, setIsSent] = useState(0)
  const [freeRide, setFreeRide] = useState(false)
  const [costSettings, setCostSettings] = useState({})
  const [seconds, setSeconds] = useState(0);
  const [isAdded, setIsAdded] = useState(false)
  const [locale,setLocale]=useState('sk')
  const translations = {
    eng: eng,
    sk:sk,
    ukr:ukr
  };
  const i18n = new I18n(translations);
  i18n.enableFallback = true;
  i18n.translations={eng,sk,ukr}
  i18n.locale=locale
 useEffect(() => {
    setSeconds(costSettings?.max_reserve_minutes * 60)
  }, [costSettings.max_reserve_minutes]);

  useEffect(() => {


    loginApp().then(res => {
      setAppToken(res?.data?.access_token)
      // AsyncStorage.setItem('appToken', res?.data?.access_token)
    }).catch(e=>{
      console.log('login',e)
    })
    AsyncStorage.getItem('auth').then(res => {
       if (res) {
         // requestUserPermission(res)
        console.log(res)
        setAuthToken(res)
        setIsAuth(true)
        getCostSettings(res).then(res => {
          // console.log(res.data)
          setCostSettings(res.data)
        })
      } else {
        setIsAuth(false)
      }
    })
    AsyncStorage.getItem('locale').then(res => {
      if (res){
      if (res==='sk'){
        setLocale('sk')
      }else if (res==='eng'){
        setLocale('eng')
      }else if (res==='ukr'){
        setLocale('ukr')
      }else {
        setLocale('sk')
      }
    }else {
      AsyncStorage.setItem('locale','sk')
        setLocale('sk')
      }
    })

  }, [])
  // useEffect(() => {
  //   if (isAuth && authToken !== '') {
  //     getProfileInfo(authToken).then(info => {
  //       // console.log(info)
  //       setUser(info)
  //     })
  //
  //   }
  //
  // }, [isAuth, authToken])
  // if (loading) {
  //   return null;
  // }
  // useEffect(() => {
  //   if (authToken) {
  //     const interval = setInterval(() => {
  //       getCostSettings(authToken).then(res => {
  //         console.log(res.data)
  //         setCostSettings(res.data)
  //       })
  //
  //     }, 1000)
  //     return (() => clearInterval(interval))
  //   }
  // }, [authToken])


  return (
    <AuthContext.Provider value={{
      i18n,
      locale,setLocale,
      user,
      setUser,
      userCards,
      setUserCards,
      isAuth,
      setIsAuth,
      phone,
      setPhone,
      name,
      setName,
      surname,
      setSurname,
      email,
      setEmail,
      age,
      setAge,
      card,
      setCard,
      authToken,
      setAuthToken,
      isNewUser,
      setIsNewUser,
      isSent,
      setIsSent,
      appToken,
      setAppToken,
      costSettings,
      setCostSettings,
      googleToken,
      setGoogleToken,
      seconds, setSeconds,
      authKey, setAuthKey,isAdded, setIsAdded
    }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error("useAuth() called outside of a AuthProvider?");
  }
  return auth;
};

export default AuthProvider;
