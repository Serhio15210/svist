import React, {useEffect, useState} from 'react';
import {normalize} from "../../responsive/fontSize";
import {Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import Logo from "../../../assets/logo.svg";
import {GT, GT_BOLD} from "../../constants/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../../provider/AuthProvider";
import {useSvistContext} from "../../provider/SvistProvider";
import {getDebts} from "../../api/scooterApi";
import DrawerMenu from "../../../assets/drawerMenu.svg";
import MenuIcon from "../../../assets/menuIcon.svg";
import DrawerLabel from "../../../assets/drawerLabel.svg";
import UserAvatar from "../../../assets/userAvatar.svg";
import MenuPayment from "../../../assets/menu/menuPayment.svg";
import MenuHistory from "../../../assets/menu/menuHistory.svg";
import MenuPromoCodes from "../../../assets/menu/menuPromoCodes.svg";
import MenuSupport from "../../../assets/menu/menuSupport.svg";
import MenuPartnership from "../../../assets/menu/menuPartnership.svg";
import MenuRewards from "../../../assets/menu/menuRewards.svg";
import MenuLanguageButton from "../../../assets/menu/menuLanguageButton.svg";
import { useDrawerStatus } from '@react-navigation/drawer';
import {styles} from "./styles"
const DrawerContainer = ({props}) => {
  const isOpen=useDrawerStatus() === 'open'
  const {
    authToken,
    setIsAuth, setPhone,
    setName,
    setSurname,
    setEmail,
    setAge,
    setCard,user
  } = useAuth();
  const {endRide, rideChange, setRideChange} = useSvistContext()
  const [sum, setSum] = useState()
  useEffect(() => {
    let isMounted = true;
    getDebts(authToken).then(res => {
      setSum(res?.amount)
    })

    return (() => {
      isMounted = false;
      setSum('')

    })
  }, [rideChange, endRide]);
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
          <Text style={{color:'#1F1E1D',fontSize:normalize(12),fontFamily:GT}}>Go to profile</Text>
        </View>
      </View>
      {sum>0&&<TouchableOpacity style={styles.menuItem}>
        <MenuPayment width={normalize(24)} height={normalize(24)}/>
        <Text style={styles.menuItemText}>Debt: {sum}</Text>
      </TouchableOpacity>}
      <TouchableOpacity style={styles.menuItem}>
        <MenuPayment width={normalize(24)} height={normalize(24)}/>
        <Text style={styles.menuItemText}>Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{...styles.menuItem,alignItems:'flex-start'}}>
        <MenuPromoCodes width={normalize(24)} height={normalize(24)}/>
        <View>
          <Text style={styles.menuItemText}>Promo codes</Text>
          <Text style={{color:'#1F1E1D',fontSize:normalize(16),marginLeft:normalize(18),fontFamily:GT,marginTop:normalize(8)}}>Free minutes:<Text style={{color:'#FE7B01'}}>  129</Text></Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <MenuHistory width={normalize(24)} height={normalize(24)}/>
        <Text style={styles.menuItemText}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <MenuSupport width={normalize(24)} height={normalize(24)}/>
        <Text style={styles.menuItemText}>Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <MenuPartnership width={normalize(24)} height={normalize(24)}/>
        <Text style={styles.menuItemText}>Partnership</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <MenuRewards width={normalize(24)} height={normalize(24)}/>
        <Text style={styles.menuItemText}>Rewards</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.languageBlock}>
        <MenuLanguageButton width={normalize(79)} height={normalize(48)}/>
        <Text style={{...styles.menuItemText,position:'absolute'}}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        AsyncStorage.setItem('auth', '')
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
        }}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DrawerContainer;
