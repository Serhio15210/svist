import axios from "axios";
import {BASE_URL} from "./apiKeys";
import * as RNFS from "expo-file-system";

export const getScooters = (token) => {
  return axios.get(`${BASE_URL}/api/v1/dashboard/get-scooters`, {
    headers: {
      'Authorization': token
    },
  }).then((response) => {

    return response?.data?.data
  }).catch((error) => {
    console.log(error)
  });
}
export const getPolygons = (token) => {
  return axios.get(`${BASE_URL}/api/v1/polygons`, {
    headers: {
      'access-token': token
    },
  }).then((response) => {

    return response.data.data
  }).catch((error) => {
    console.log(error)
  });
}
export const getCurrentTrip = (token) => {

  return axios.get(`${BASE_URL}/api/v1/get-current-trip`, {
    headers: {
      'Authorization': token
    },
  }).then((response) => {

    return response.data.data
  }).catch((error) => {
    return error.response.data.errors[0].message
  });
}
export const createTrip = (token, name) => {

  return axios.post(`${BASE_URL}/api/v1/create-trip`, {
    name: name
  }, {
    headers: {
      'access-token': token
    },
  }).then((response) => {

    return response.data.data
  }).catch((error) => {
    return error.response.data.errors[0].message
  });
}
export const startTrip = (token, id,isReserve) => {
  const formData = new FormData();
  formData.append('tripId', id)
  formData.append('isReserve', isReserve||0)

  return axios.post(`${BASE_URL}/api/v1/start-trip`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'access-token': token
    },
  }).then((response) => {

    return response.data.data
  }).catch((error) => {
    return error.response.data.errors[0].message
  });
}
export const startReservedTrip = (token, id) => {

  const formData = new FormData();
  formData.append('tripId', id)

  return axios.post(`${BASE_URL}/api/v1/start-reserved-trip`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'access-token': token
    },
  }).then((response) => {

    return response.data.data
  }).catch((error) => {
    return error.response.data.errors[0].message
  });
}
export const pauseTrip = (token, id) => {

  const formData = new FormData();
  formData.append('tripId', id)
  return axios.post(`${BASE_URL}/api/v1/pause-trip`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'access-token': token
    },
  }).then((response) => {
    console.log('---pause trip---')
    return response.data
  }).catch((error) => {
    return error
  });
}
export const continueTrip = (token, id) => {

  const formData = new FormData();
  formData.append('tripId', id)
  return axios.post(`${BASE_URL}/api/v1/continue-trip`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'access-token': token
    },
  }).then((response) => {
    console.log('---continue trip---')
    return response.data
  }).catch((error) => {
    return error
  });
}
export const stopTrip = (token, id, latitude, longitude) => {


  return axios.post(`${BASE_URL}/api/v1/stop-trip`, {
    "tripId": id,
    "latitude": latitude,
    "longitude": longitude,
    "request_id": "test"
  }, {
    headers: {
      'Authorization': token
    },
  }).then((response) => {
    console.log('---stop trip---')
    return response.data.data
  }).catch((error) => {
    return error.response.data.errors[0].message
  });
}
export const setRatingTrip = (token, id,rating,image) => {

  // const imageData = image.base64
  // const imagePath = `${RNFS.cacheDirectory}${imageData.split('/')[2]}.jpg`;
  // console.log(token,id,rating,imagePath)
  // RNFS.writeAsStringAsync(imagePath, imageData, {
  //   encoding: RNFS.EncodingType.Base64,
  // })
  //   .then(() => console.log('Image converted to jpg and saved at ' + imagePath));
  let name =image?.uri.split('/').pop()
  let match = /\.(\w+)$/.exec(name);
  let type = match ? `image/${match[1]}` : `image`;
  const formData = new FormData();
  formData.append('tripId', id)
  formData.append('rating', rating)
  formData.append('image', {
    name: name,
    type: type,
    uri: image?.uri
  })
  return axios.post(`${BASE_URL}/api/v1/set-rating-trip`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'access-token': token
    },
  }).then((response) => {

    return response.data
  }).catch((error) => {
    return error
  });
}
export const getCloseScooter=(coords,token)=>{
  return axios.get(`${BASE_URL}/api/v1/dashboard/near-scooters?XDEBUG_SESSION_START=PHPSTORM`, {
    params:{

    latitude:coords?.latitude,
    longitude:coords?.longitude

    },
    headers: {
      'Authorization': token
    },
  }).then((response) => {

    return response.data.data
  }).catch((error) => {
    console.log(error)
  });
}
export const getDebts=(token)=>{
  return axios.get(`${BASE_URL}/api/v1/has-debt`, {
    headers: {
      'Authorization': token
    },
  }).then((response) => {

    return response.data.data
  }).catch((error) => {
    console.log(error)
  });
}
export const isRange=(token,coordinates)=>{
  return axios.get(`${BASE_URL}/api/v1/dashboard/is-range`,{
    params:{
      latitude:coordinates?.latitude,
      longitude:coordinates?.longitude

    },
    headers: {
      'Authorization': token
    },
  }).then((response) => {

    return response.data
  }).catch((error) => {
    console.log('is range: ',error.response.data.errors[0].message)
  });
}
