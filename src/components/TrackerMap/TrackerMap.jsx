import React, {useEffect, useRef} from 'react';
import MapView, {Marker, Polygon, PROVIDER_GOOGLE} from "react-native-maps";
import TrackingMarker from "../TrackingMarker/TrackingMarker";
import {Platform, StyleSheet} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {useSvistContext} from "../../provider/SvistProvider";
import {GT} from "../../constants/fonts";
import LoadingModal from "../LoadingModal";

const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = 0.05;
const TrackerMap = ({scooter,polygons,startPosition,rideArea,startRide}) => {
  const mapRef = useRef()
  const markerRef = useRef()
  const {selectScooter}=useSvistContext()
  useEffect(() => {
    animate(parseFloat(selectScooter?.latitude), parseFloat(selectScooter?.longitude))
  }, [selectScooter]);

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    if (Platform.OS === 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 2000);
        startPosition.timing(newCoordinate).start();
        mapRef.current.animateToRegion({
          ...newCoordinate, latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }, 2000)
      }
    } else {
      startPosition.timing(newCoordinate).start();
    }
  }
  function hexToRgbA(hex) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.24)';
    }
    throw new Error('Bad Hex');
  }
  return (
    <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: parseFloat(selectScooter?.latitude), longitude: parseFloat(selectScooter?.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker.Animated
            ref={markerRef}
            coordinate={startPosition}
            style={{alignItems: "center", justifyContent: "center", width: 80}}
          >
            <TrackingMarker rideArea={rideArea} startRide={startRide} selectScooter={selectScooter}/>
          </Marker.Animated>
          {polygons.length > 0 && polygons?.map(item =>
            <Polygon key={item?.id} tappable={true} coordinates={item?.polygon} fillColor={hexToRgbA(item?.color)}
                     strokeColor={item?.color}
                     strokeWidth={2}/>)}
        </MapView>
  );
};
const styles = StyleSheet.create({

  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reserveBlock: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: normalize(25),
    width: "100%",
    marginTop: normalize(15),

  },
  reserveTitle: {
    fontFamily: GT,
    fontSize: normalize(24),
    fontWeight: "500",
  },
  buttonText: {
    fontSize: normalize(24), color: '#FE7B01', fontFamily: GT, position: 'absolute'
  },


});
export default TrackerMap;
