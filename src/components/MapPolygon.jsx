import React, {useEffect} from 'react';
import hexToRgba from 'hex-to-rgba';
import {Polygon} from "react-native-maps";

const MapPolygon = ({item}) => {


    return (
        <Polygon key={item?.id} coordinates={item?.polygon}
                 fillColor={hexToRgba(item?.color,0.24)}
                 strokeColor={item?.color}
                 strokeWidth={2}/>
    );
};

export default React.memo(MapPolygon);
