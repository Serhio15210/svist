import React, {useRef} from 'react';
import {Image, Modal, Text, TouchableOpacity, View} from "react-native";
import {WebView} from "react-native-webview";
import MainButton from "../../../assets/mainButton.svg";
import {normalize} from "../../responsive/fontSize";
import scan from "../../../assets/scan.png";
import {GT} from "../../constants/fonts";


const PaymentModal = ({isOpen,setIsOpen,url,setCanGoBack}) => {
  const webView=useRef()
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(!isOpen);
      }}>
      <View style={{flex:1}}>
        <WebView
          source={{uri:url}}

          ref={webView}
          onNavigationStateChange={(e) => {
            // console.log(e.title)
              if(e.title==='Platba'||e.title==='Оплата'){
                setIsOpen(false)
                // setCanGoBack(true)
              }

          }}

        />
        <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center',backgroundColor:'#FE7B01',padding:normalize(20)}}
                          onPress={() => {

                            setIsOpen(false)
                          }}>

            <Text style={{color: "white",
              fontSize: normalize(24),
              fontFamily: GT}}>Back</Text>

        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PaymentModal;
