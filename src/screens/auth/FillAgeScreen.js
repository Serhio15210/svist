import React, {useEffect, useState} from 'react';
import {useAuth} from "../../provider/AuthProvider";
import {useNavigation} from "@react-navigation/native";
import {Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import AuthWhiteButton from "../../../assets/authWhiteButton.svg";
import DateBlock from "../../../assets/dateBlock.svg";
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import {createCard, profileUpdate} from "../../api/authApi";
import AuthBackButton from "../../../assets/authBackButton.svg";
import LoadingModal from "../../components/LoadingModal";
import WheelPicker from "../../components/WheelPicker/WheelPicker";
import {GT} from "../../constants/fonts";

const FillAgeScreen = () => {
    const {name, setName, setSurname, surname, setEmail, email, authToken, setIsAuth} = useAuth()
    const [errorAge, setErrorAge] = useState(false)

    const days = []
    const days31 = []
    const days28 = []
    const years = []
    const months = [{name: 'jan', num: 1}, {
      name: 'fab',
      num: 2
    }, {name: 'march', num: 3}, {name: 'apr', num: 4}, {name: 'may', num: 5}, {
      name: 'june',
      num: 6
    }, {name: 'july', num: 7}, {name: 'aug', num: 8}, {name: 'sep', num: 9}, {
      name: 'oct',
      num: 10
    }, {name: 'nov', num: 11}, {name: 'dec', num: 12}]
    const [selectDay, setSelectDay] = useState(3)
    const [selectMonth, setSelectMonth] = useState(5)
    const [selectYear, setSelectYear] = useState(1994)
    const [openLink, setOpenLink] = useState(false)
    const [selectIndex, setSelectIndex] = useState(2)

    const checkAge = () => {
      return new Date(selectYear + 18, selectMonth - 1, selectDay) <= new Date()
    }

    const navigation = useNavigation()
    let max = new Date().getFullYear()
    let min = max - 30
    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    for (let i = 1; i <= 30; i++) {
      days.push(i)
    }
    for (let i = 1; i <= 31; i++) {
      days31.push(i)
    }
    for (let i = 1; i <= 28; i++) {
      days28.push(i)
    }
    const sendInfo = () => {
      const age = `${selectYear}-${selectMonth < 10 ? `0${selectMonth}` : selectMonth}-${selectDay < 10 ? `0${selectDay}` : selectDay}`
      profileUpdate(name, surname, email, age, authToken).then(res => {
        res.data.data.success ? navigation.navigate('AddPaymentScreen') : setErrorAge(true)
      })
    }
    const [selectData, setSelectData] = useState(days31)
    useEffect(() => {
      if (selectMonth === 1 || selectMonth === 3 || selectMonth === 5 || selectMonth === 7 || selectMonth === 8 || selectMonth === 10 || selectMonth === 12) {

        setSelectData(days31)
      } else if (selectMonth === 2) {
        if (selectIndex===30){
          setSelectData(['','',''].concat(days28))
        }else if (selectIndex===29){
          setSelectData(['',''].concat(days28))
        } else setSelectData(days28)

      } else{
        if (selectIndex===30){
          setSelectData([''].concat(days))
        }else setSelectData(days)
      }
    }, [selectMonth])
  useEffect(()=>{
    if (selectDay===''){
      setSelectData(selectData.filter(item=>item>0))
    }
  },[selectDay])
    return (
      <View style={{...styles.container, backgroundColor: errorAge ? '#EF4E4E' : '#FE7B01'}}>
        {openLink && <LoadingModal setOpenLoading={setOpenLink}/>}
        <TouchableOpacity style={{position: 'absolute', left: 0, top: normalize(48)}} onPress={() => navigation.goBack()}>
          <AuthBackButton/>
        </TouchableOpacity>
        <View style={{width: '100%'}}>
          <Text style={styles.title}>Fill in age</Text>
          <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas risus
            pellentesque.</Text>
          <View style={styles.wheelContainer}>

            <WheelPicker dataSource={selectData.concat(selectData.filter(item=>item>0))} selectMonth={selectMonth} errorAge={errorAge}
                         setSelectDay={setSelectDay} selectDay={selectDay} selectIndex={selectIndex}
                         setSelectIndex={setSelectIndex}/>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <DateBlock style={{position: 'absolute'}}/>
              <View style={{height: normalize(240), width: normalize(103), backgroundColor: 'transparent'}}>
                <ScrollPicker
                  dataSource={months.concat(months)}
                  selectedIndex={2}
                  renderItem={(data, index, isSelected) => {
                    return (
                      <Text style={{
                        fontWeight: isSelected ? '700' : '300',
                        fontSize: normalize(16),
                        color: isSelected ? errorAge ? '#EF4E4E' : '#FE7B01' : errorAge ? '#FD9F9F' : '#F9B26F'
                      }}>{data.name}</Text>
                    )
                  }}
                  onValueChange={(data, selectedIndex) => {
                    setSelectMonth(data.num)
                  }}
                  wrapperHeight={normalize(235)}
                  wrapperWidth='100%'
                  wrapperColor='transparent'
                  itemHeight={50}
                  highlightColor={'transparent'}
                  highlightBorderWidth={2}
                  activeItemColor={'#222121'}
                  itemColor={'#B4B4B4'}
                />
              </View>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <DateBlock style={{position: 'absolute'}}/>
              <View style={{height: normalize(240), width: normalize(103), backgroundColor: 'transparent'}}>
                <ScrollPicker
                  dataSource={years.reverse().concat(years)}
                  selectedIndex={2}
                  renderItem={(data, index, isSelected) => {
                    return (
                      <Text style={{
                        fontWeight: isSelected ? '700' : '300',
                        fontSize: normalize(16),
                        color: isSelected ? errorAge ? '#EF4E4E' : '#FE7B01' : errorAge ? '#FD9F9F' : '#F9B26F'
                      }}>{data}</Text>
                    )
                  }}
                  onValueChange={(data, selectedIndex) => {
                    setSelectYear(data)
                  }}
                  wrapperHeight={normalize(235)}
                  wrapperWidth='100%'
                  wrapperColor='transparent'
                  itemHeight={50}
                  highlightColor={'transparent'}
                  highlightBorderWidth={2}
                  activeItemColor={'#222121'}
                  itemColor={'#B4B4B4'}
                />
              </View>
            </View>
          </View>
          {errorAge &&
            <Text style={styles.errorText} numberOfLines={2} adjustsFontSizeToFit={true}>You can use scooters only when
              you are 18+ years old</Text>}
        </View>

        <TouchableOpacity style={styles.centerBlock} onPress={() => {
          if (checkAge()) {
            setErrorAge(false)
            sendInfo()
          } else {
            setErrorAge(true)
          }
        }}>
          <AuthWhiteButton/>
          <Text style={{...styles.buttonText, color: errorAge ? '#EF4E4E' : '#FE7B01'}}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }
;
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
  wheelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: normalize(40)
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
    fontFamily: GT,
    width: normalize(203),
    textAlign: 'center'
  }
})

export default FillAgeScreen;
