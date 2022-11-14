import {ACCESS_TOKEN, BASE_URL} from "./apiKeys";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginApp = () => {
  return axios.post(`${BASE_URL}/api/v1/login-app`, {
    "grant_type": "application",
    "client_id": "svist_client",
    "client_secret": "32768"
  }).then((response) => {
    return response.data
  }).catch((error) => {
    console.log(error)
  });
}
export const safeFirebaseToken = (token,authToken) => {
  console.log(token,authToken)
  return axios.post(`${BASE_URL}/api/v1/save-firebase-token`, {
    fire_base_token:token
  },{
    'access-token': authToken,
    headers:{
      'device-id':12
    }
  },).then((response) => {
    return response?.data
  }).catch((error) => {
    console.log(error)
  });
}
export const validationPhone = async (phone,token) => {
  console.log(phone,token)
  const locale=await AsyncStorage.getItem('locale')
  console.log(locale)
  return axios.post(`${BASE_URL}/api/v1/validation-phone`, {
    "phone_number": phone
  }, {
    headers: {
      'access-token': token,
      'language':locale
    },
  }).then((response) => {

    return response.data
  }).catch((error) => {

    if (error?.response?.data?.message){
      return 'Invalid number'
    }else return error?.response?.data?.errors[0]?.message
  });
}
export const validationAppleGoogle = async (token,service) => {
  console.log(token)
  return axios.post(`${BASE_URL}/api/v1/login`, {

    "id_token":token,
    "service":service
  }).then((response) => {

    return response.data
  }).catch((error) => {

    if (error?.response?.data?.message){
      return 'Invalid number'
    }else return error?.response?.data?.errors[0]?.message
  });
}
export const validationCode = async (phone, code,token) => {
  console.log(phone,code,token)
  const locale=await AsyncStorage.getItem('locale')
  console.log(locale)
  return axios.post(`${BASE_URL}/api/v1/validation-code`, {
    "phone_number": phone,
    "sms_code": code
  }, {
    headers: {
      'access-token': token,
      'language':locale
    },
  }).then((response) => {

    return response.data
  }).catch((error) => {
    return error.response.data.errors[0].message
  });
}
export const validationGoogleCode = async (phone, code,token,key) => {
  console.log(phone,code,token,key)
  return axios.post(`${BASE_URL}/api/v1/validation-code`, {
    "phone_number": phone,
    "sms_code": code,
    "auth_key":key
  }, {
    headers: {
      'access-token': token
    },
  }).then((response) => {

    return response.data
  }).catch((error) => {
    return error.response.data.errors[0].message
  });
}
export const profileUpdate = async (name, surname, email, age, token) => {
  console.log('age',email, age)
  const locale = await AsyncStorage.getItem('locale')

  return axios.put(`${BASE_URL}/api/v1/profile/update`, {
    "name": name,
    "surname": surname,
    "confirmed_email": email,
    "birth_date": age
  }, {
    headers: {
      'Authorization': token,
      'language':locale
    },
  }).then((response) => {
    // console.log(response.data.data)
    return response
  }).catch((error) => {
    return error.response.data.errors[0].message
  });
}
export const getProfileInfo = async (token) => {
  const locale = await AsyncStorage.getItem('locale')
  return axios.get(`${BASE_URL}/api/v1/profile/get-info`, {
    headers: {
      'access-token': token,
      'language':locale
    },
  }).then((response) => {
    return response.data.data
  }).catch((error) => {
    console.log(error)
  });
}
export const createCard = async (token) => {
  const locale = await AsyncStorage.getItem('locale')
  return axios.post(`${BASE_URL}/api/v1/create-card`, {}, {
    headers: {
      'access-token': token,
      'language':locale
    },
  }).then((response) => {
    return response
  }).catch((error) => {
    console.log(error)
  });
}
export const profileGetInfo = (token) => {
  return axios.get(`${BASE_URL}/api/v1/profile/get-info`, {
    headers: {
      'Authorization': token
    },
  }).then((response) => {
    console.log(response.data.data)
    return response
  }).catch((error) => {
    console.log(error)
  });
}
export const getCards = async (token) => {
  const locale = await AsyncStorage.getItem('locale')
  return axios.get(`${BASE_URL}/api/v1/cards`, {
    headers: {
      'Authorization': token,
      'language':locale
    },
  }).then((response) => {

    return response
  }).catch((error) => {
    console.log(error)
  });
}
export const getCostSettings = (token) => {
  let locale=''
  AsyncStorage.getItem('locale').then(res=>{
    locale=res
  })
  return axios.get(`${BASE_URL}/api/v1/dashboard/cost-settings`, {
    headers: {
      'Authorization': token,
      'language':locale
    },
  }).then((response) => {
    return response.data
  }).catch((error) => {
    console.log(error)
  });
}

