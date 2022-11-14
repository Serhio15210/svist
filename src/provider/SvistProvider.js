import React, {useContext, useEffect, useState} from 'react';
import NetInfo, {useNetInfo} from "@react-native-community/netinfo";

const Context = React.createContext(null);
const SvistProvider = ({children}) => {
  const [selectScooter, setSelectScooter] = useState({})
  const [rideArea, setRideArea] = useState('none')
  const [rideTime, setRideTime] = useState(0)
  const [pauseTime, setPauseTime] = useState(0)
  const [startRide, setStartRide] = useState(false)
  const [endRide, setEndRide] = useState(false)
  const [pauseRide, setPauseRide] = useState(false)
  const [rideChange, setRideChange] = useState(false)
  const [isConnectedErrorOpen, setIsConnectedErrorOpen] = useState(false);
  const [isConnectedError, setIsConnectedError] = useState(false);
  const [dangerZoneOpen, setDangerZoneOpen] = useState(false)
  const [redZoneOpen, setRedZoneOpen] = useState(false)
  const [picture, setPicture] = useState({})
  const [claimFreeRide, setClaimFreeRide] = useState(false)
  const [reservation, setReservation] = useState(false)
  const [isFirstRide, setIsFirstRide] = useState(false)
  const netInfo = useNetInfo();
  useEffect(() => {
    let isMount = true
    const interval = setInterval(() => {
      NetInfo.refresh().then(state => {
        if (state.isConnected) {

          setIsConnectedError(false)
          setIsConnectedErrorOpen(false)
        } else {

          setIsConnectedErrorOpen(true);
          setIsConnectedError(true);
        }
      });


    }, 3000);
    return () => {
      isMount = false
      clearInterval(interval)
    }

  }, [])
  // const checkInternet=()=>{
  //     NetInfo.fetch().then(state => {
  //
  //          alert(state.isConnected)
  //     });
  // }
  return (
    <Context.Provider value={
      React.useMemo(() => ({
        rideArea,
        setRideArea,
        rideTime,
        setRideTime,
        startRide,
        setStartRide,
        pauseRide,
        setPauseRide,
        isConnectedErrorOpen,
        setIsConnectedErrorOpen,
        isConnectedError,
        setIsConnectedError,
        endRide,
        setEndRide,
        dangerZoneOpen,
        setDangerZoneOpen,
        pauseTime,
        setPauseTime,
        redZoneOpen,
        setRedZoneOpen,
        isFirstRide,
        setIsFirstRide,
        selectScooter,
        setSelectScooter,
        picture,
        setPicture,
        claimFreeRide,
        setClaimFreeRide,
        rideChange,
        setRideChange,
        reservation,
        setReservation
      }), [
        rideArea,
        setRideArea,
        rideTime,
        setRideTime,
        startRide,
        setStartRide,
        pauseRide,
        setPauseRide,
        isConnectedErrorOpen,
        setIsConnectedErrorOpen,
        isConnectedError,
        setIsConnectedError,
        endRide, setEndRide,
        dangerZoneOpen, setDangerZoneOpen,
        pauseTime, setPauseTime, redZoneOpen, setRedZoneOpen, isFirstRide, setIsFirstRide,
        selectScooter, setSelectScooter, picture, setPicture, claimFreeRide, setClaimFreeRide, rideChange, setRideChange, reservation, setReservation
      ])}>
      {children}
    </Context.Provider>
  );
};
export const useSvistContext = () => {
  const auth = useContext(Context);
  if (auth == null) {
    throw new Error("useSvistContext() called outside of a AuthProvider?");
  }
  return auth;
};
export default SvistProvider;
