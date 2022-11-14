import React, {useEffect, useState} from 'react';
import {normalize} from "../../responsive/fontSize";
import {Text, TouchableOpacity, View} from "react-native";
import Logo from "../../../assets/logo.svg";
import {GT, GT_BOLD} from "../../constants/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../../provider/AuthProvider";
import {useSvistContext} from "../../provider/SvistProvider";
import {getDebts} from "../../api/scooterApi";
import DrawerLabel from "../../../assets/drawerLabel.svg";
import UserAvatar from "../../../assets/userAvatar.svg";
import ChangeLanguageBlock from "../../../assets/changeLanguageBlock.svg";
import MenuPayment from "../../../assets/menu/menuPayment.svg";
import MenuPromoCodes from "../../../assets/menu/menuPromoCodes.svg";
import ChangeLanguageLine from "../../../assets/changeLanguageLine.svg";
import MenuLanguageButton from "../../../assets/menu/menuLanguageButton.svg";
import {useDrawerStatus} from '@react-navigation/drawer';
import {styles} from "./styles"
import * as Localization from "expo-localization";

const DrawerContainer = ({props}) => {
  const isOpen=useDrawerStatus() === 'open'
  const {
    authToken,
    setIsAuth, setPhone,
    setName,
    setSurname,
    setEmail,
    setAge,
    setCard,user,i18n,locale,setLocale
  } = useAuth();
  const {endRide, rideChange, setRideChange} = useSvistContext()
  const {setUser}=useAuth()
  const [sum, setSum] = useState('')
  const [changeLanguage, setChangeLanguage] = useState(false)
  useEffect(() => {
    let isMounted = true;
    getDebts(authToken).then(res => {
      setSum(res?.amount)
      console.log(res)
    })

    return (() => {
      isMounted = false;
      // setSum('')

    })
  }, [rideChange, endRide,useDrawerStatus()]);
  return (
    <View style={styles.container}>
      <View style={{paddingTop: normalize(10),marginBottom:normalize(40)}}>
        {isOpen&&<TouchableOpacity style={styles.label} onPress={()=>props.navigation.closeDrawer()}>
          <DrawerLabel width={normalize(76)} height={normalize(48)}/>
        </TouchableOpacity>}
        <Logo/>
      </View>
      <View style={styles.rowContainer}>
        <UserAvatar width={normalize(72)} height={normalize(56)}/>
        <View style={{marginLeft:normalize(16)}}>
          <Text style={styles.title}>{user?.name}</Text>
          {/*<Text style={{color:'#1F1E1D',fontSize:normalize(12),fontFamily:GT}}>{i18n.t('goToProfile')}</Text>*/}
        </View>
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <MenuPayment width={normalize(24)} height={normalize(24)}/>
        <Text style={styles.menuItemText}>{i18n.t('payment')}</Text>
      </TouchableOpacity>
      {sum>0&&<TouchableOpacity style={{...styles.menuItem,alignItems:'flex-start'}}>
        <MenuPromoCodes width={normalize(24)} height={normalize(24)}/>
        <View>
           <Text  style={styles.menuItemText}>{i18n.t('negativeBalance')}:<Text style={{color:'#EF4E4E'}}> -{sum}€</Text></Text>
          {/*<Text style={styles.menuItemText}>{i18n.t('promoCodes')}</Text>*/}
          {/*<Text style={{color:'#1F1E1D',fontSize:normalize(16),marginLeft:normalize(18),fontFamily:GT,marginTop:normalize(8)}}>Free minutes:<Text style={{color:'#FE7B01'}}>  129</Text></Text>*/}
          {/*  {sum>0&&<Text style={{color:'#1F1E1D',fontSize:normalize(16),marginLeft:normalize(18),fontFamily:GT,marginTop:normalize(8)}}>Neg. balance::<Text style={{color:'#EF4E4E'}}> -{sum}€</Text></Text>}*/}
        </View>

      </TouchableOpacity>}

      {/*<TouchableOpacity style={styles.menuItem}>*/}
      {/*  <MenuHistory width={normalize(24)} height={normalize(24)}/>*/}
      {/*  <Text style={styles.menuItemText}>History</Text>*/}
      {/*</TouchableOpacity>*/}
      {/*<TouchableOpacity style={styles.menuItem}>*/}
      {/*  <MenuSupport width={normalize(24)} height={normalize(24)}/>*/}
      {/*  <Text style={styles.menuItemText}>Support</Text>*/}
      {/*</TouchableOpacity>*/}
      {/*<TouchableOpacity style={styles.menuItem}>*/}
      {/*  <MenuPartnership width={normalize(24)} height={normalize(24)}/>*/}
      {/*  <Text style={styles.menuItemText}>Partnership</Text>*/}
      {/*</TouchableOpacity>*/}
      {/*<TouchableOpacity style={styles.menuItem}>*/}
      {/*  <MenuRewards width={normalize(24)} height={normalize(24)}/>*/}
      {/*  <Text style={styles.menuItemText}>Rewards</Text>*/}
      {/*</TouchableOpacity>*/}
      {!changeLanguage?<TouchableOpacity style={styles.languageBlock} onPress={()=>setChangeLanguage(true)}>
        <MenuLanguageButton width={normalize(79)} height={normalize(48)}/>
        <Text style={{...styles.menuItemText,position:'absolute',textTransform: 'uppercase'}}>{i18n.locale}</Text>
      </TouchableOpacity>:
        <View style={{...styles.languageBlock,alignItems:'flex-start'}}  >
          <ChangeLanguageBlock/>
          <View style={{position:'absolute',flexDirection:'row',alignItems:'center'}}>
            <Text style={{...styles.menuItemText,marginRight:normalize(15),color:'#FE7B01',textTransform: 'uppercase'}}>{i18n.locale}</Text>
            <ChangeLanguageLine/>
            <TouchableOpacity onPress={()=>{
              setLocale('sk')
              AsyncStorage.setItem('locale','sk')
              setChangeLanguage(false)
            }}>
              <Text style={{...styles.menuItemText}}  >SK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
              setLocale('eng')
              AsyncStorage.setItem('locale','eng')
              setChangeLanguage(false)
            }}>
              <Text style={{...styles.menuItemText}}  >ENG</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
              setLocale('ukr')
              AsyncStorage.setItem('locale','ukr')
              setChangeLanguage(false)
            }}>
            <Text style={{...styles.menuItemText}}  >UKR</Text>
            </TouchableOpacity>
          </View>

        </View>}

      <TouchableOpacity onPress={() => {
        // AsyncStorage.setItem('auth', '')

        AsyncStorage.removeItem('auth')
        setUser({})
        setIsAuth(false)
        setName('')
        setPhone('')
        setEmail('')
        setAge('')
        setSurname('')
      }
      }>
        <Text style={{
          color: '#1F1E1D',
          fontSize: normalize(20),
          marginTop: normalize(40),fontFamily:GT_BOLD
        }}>{i18n.t('exit')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DrawerContainer;
