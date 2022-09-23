import React, {useRef, useState} from 'react';
import MapView, {Circle, Marker, Polygon, PROVIDER_GOOGLE} from "react-native-maps";
import UserMarker from "../UserMarker";
import ScooterMarker from "../ScooterMarker";
import OutZoomMarker from "../OutZoomMarker";
import {StyleSheet} from "react-native";
import {normalize} from "../../responsive/fontSize";


const MainMap = ({
                   isConnectedErrorOpen,
                   setShowInfo,
                   setSelectScooter,
                   coordinatesNearby,
                   selectScooter,
                   coordinates,
                   scooters,
                   polygons,
                   reservation,locationError
                 }) => {
  let mapRef = useRef();
  const [zoomLevel, setZoomLevel] = useState({latitudeDelta: 0, longitudeDelta: 0})

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
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      onPress={() => {
        !isConnectedErrorOpen && setShowInfo(false)
        !reservation&&setSelectScooter({})
      }}

      initialRegion={{
        latitude: parseFloat(coordinatesNearby?.latitude) || parseFloat(selectScooter?.latitude) || 50.448513,
        longitude: parseFloat(coordinatesNearby?.longitude) || parseFloat(selectScooter?.longitude) || 30.517141,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
      onRegionChange={(region) => {
        !reservation&&setZoomLevel({latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta})
      }}
      ref={(mapView) => {
        mapRef = mapView;
      }}
    >
      {locationError !== 2 &&
        <Circle center={{latitude: coordinates.latitude || 0, longitude: coordinates.longitude || 0}} radius={150}
                fillColor={"rgba(254, 123, 1, 0.16)"} strokeWidth={0}/>}
      {locationError !== 2 && coordinates.latitude ? <Marker coordinate={{
        latitude: coordinates.latitude || 0,
        longitude: coordinates.longitude || 0,
      }} flat anchor={{x: 0.5, y: 0.5}}>
        <UserMarker/>
      </Marker> : <></>}
      {scooters?.map((item) => {
        return (
          <Marker coordinate={{
            latitude: parseFloat(item?.latitude) || 0,
            longitude: parseFloat(item?.longitude) || 0,
          }} key={item?.scooter_id} onPress={() => {
            if (!reservation && !isConnectedErrorOpen) {
              setSelectScooter(item)
              setShowInfo(true)
            }
          }} style={{alignItems: "center", justifyContent: "center", width: 80}}>
            {zoomLevel.longitudeDelta <= 0.035896338522420024 && zoomLevel.latitudeDelta <= 0.057341003097498344 ?
              <ScooterMarker item={item} selectMarker={selectScooter}/> :
              selectScooter?.scooter_id===item?.scooter_id?<ScooterMarker item={item} selectMarker={selectScooter}/>:<OutZoomMarker/>
            }

          </Marker>
        );
      })}

      {polygons.length > 0 && polygons?.map(item =>
        <Polygon key={item?.id} coordinates={item?.polygon}
                 fillColor={hexToRgbA(item?.color)}
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
  scanRowContainer: {
    position: "absolute", bottom: normalize(32), zIndex: 100, width: "95%"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  screenButton: {
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: 48,
  },
  scanButton: {
    alignItems: "center",
    paddingLeft: normalize(36),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: "row",
    paddingRight: normalize(70),
    position: 'absolute'

  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

});
export default MainMap;
