import React, { Component, useState, useEffect  } from 'react'
import { View, StyleSheet , PermissionsAndroid} from 'react-native'
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';

import * as Location from 'expo-location';
import * as BackgroundFetch from 'expo-background-fetch';


import { WebView } from 'react-native-webview';
import axios from 'axios';


async function handleEvents(event) {

    let eventObj = JSON.parse(event.nativeEvent.data)
    console.log(eventObj)

    if (eventObj.data > 0) {
        console.log("Iniciando thread");


        setInterval(async () => {
               let location = await Location.getCurrentPositionAsync({});
                onLocation(location)
                console.log("..............");
        }, 4000);
        console.log("Encerrando thread");

    }

  }
const requestLocationPermission = async () => {
  try {

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permissão de Acesso à Localização",
        message: "Este aplicativo precisa acessar sua localização.",
        buttonNeutral: "Pergunte-me depois",
        buttonNegative: "Cancelar",
        buttonPositive: "OK"
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      alert('Permissão de Localização OK');
      return true;
    } else {
      console.warn('Permissão de Localização negada');
      return false;
    }
  } catch (err) {
    return false;
  }
};

async function onLocation(position) {
    if(position){
        let baseURL = `https://dtux-lab-04.free.beeceptor.com?lat=${position.coords.latitude}&long=${position.coords.longitude}`
        const response = await fetch(baseURL);
    }
}



const WebViewExample = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [start, setStart] = useState(false);

    useEffect(() => {
      (async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }


      })();
    }, []);




   return (
      <View style = {styles.container}>
         <WebView
          scalesPageToFit={false}
         mixedContentMode="compatibility"
        onMessage={async (event) => {
              handleEvents(event)
           }}
         source = {{ uri: 'https://120d-177-55-157-202.sa.ngrok.io' }}
        javaScriptEnabledAndroid
        useWebkit
        startInLoadingState={true}
        geolocationEnabled={true}
         />
      </View>
   )
}
export default WebViewExample;

const styles = StyleSheet.create({
   container: {
      height: 1000,
   }
})