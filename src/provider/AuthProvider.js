import React, {useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCostSettings, getFreeRide, getProfileInfo, loginApp} from "../api/authApi";
import * as RNFS from "expo-file-system";

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
 useEffect(() => {
    setSeconds(costSettings?.max_reserve_minutes * 60)
  }, [costSettings.max_reserve_minutes]);

  useEffect(() => {
    // RNFS.readDirectoryAsync(RNFS.cacheDirectory).then(res=>{
    //   res.map(item=>{
    //     if (item.includes('.jpg')){
    //       console.log(`${RNFS.cacheDirectory}${item}`)
    //       RNFS.deleteAsync(`${RNFS.cacheDirectory}${item}`, {idempotent: true})
    //     }
    //   })
    // })
    loginApp().then(res => {
      setAppToken(res?.data?.access_token)
      AsyncStorage.setItem('appToken', res?.data?.access_token)
    }).catch(e=>{
      console.log('login',e)
    })
    AsyncStorage.getItem('auth').then(res => {
      if (res === null) {
        setIsAuth(false)
      } else if (res) {
        console.log(res)
        setAuthToken(res)
        setIsAuth(true)
      } else {
        setIsAuth(false)
      }
    })
  }, [])
  useEffect(() => {
    if (isAuth && authToken !== '') {
      getProfileInfo(authToken).then(info => {
        console.log(info)
        setUser(info)
      })
      getCostSettings(authToken).then(res => {
        // console.log(res.data)
        setCostSettings(res.data)
      })
    }
    // AsyncStorage.getItem('appToken').then(res=> {
    //   if (res){
    //     setAppToken(res)
    //   }else {
    //     loginApp().then(res => {
    //       // console.log(res.data)
    //       setAppToken(res.data.access_token)
    //       AsyncStorage.setItem('appToken', res.data.access_token)
    //     })
    //   }
    //
    // })
  }, [isAuth, authToken])

  useEffect(() => {
    if (authToken) {
      const interval = setInterval(() => {
        getCostSettings(authToken).then(res => {
          // console.log(res.data)
          setCostSettings(res.data)
        })

      }, 1000)
      return (() => clearInterval(interval))
    }
  }, [authToken])


  return (
    <AuthContext.Provider value={{
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
      authKey, setAuthKey
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
