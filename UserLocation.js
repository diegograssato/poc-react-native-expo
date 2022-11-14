import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_TRACKING = 'location-tracking';
const STORAGE_KEY="@StorageLocationTracking"

async function onLocation(position) {
    console.log(position);
    if(position){
        let baseURL = `https://dtux-lab-09.free.beeceptor.com?lat=${position.coords.latitude}&long=${position.coords.longitude}`
        const response = await fetch(baseURL);
    }
}

function UserLocation() {

const [locationStarted, setLocationStarted] = React.useState(false);
    const startLocationTracking = async () => {
        await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 6000,
            distanceInterval: 0,
        });
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TRACKING
        );
        setLocationStarted(hasStarted);

        console.log('tracking started?', hasStarted);
    };

React.useEffect(() => {
        const config = async () => {
            let resf = await Location.requestForegroundPermissionsAsync();
            let resb = await Location.requestBackgroundPermissionsAsync();
            if (resf.status != 'granted' && resb.status !== 'granted') {
                console.log('Permission to access location was denied');
            } else {
                console.log('Permission to access location granted');
            }
        };

    config();
}, []);

async function handleEvents(event) {
    console.log("=============== handleEvents =================");
    const responseBody = JSON.parse(event.nativeEvent.data)

    switch (responseBody.event) {
        case 'onLogin':
            console.log(`On login`);
            console.log(JSON.stringify(responseBody.data));
            startLocationTracking();
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(responseBody.data));
            break;

        case 'onLogout':
            console.log(`On ${responseBody.data}.`);
               const value = await AsyncStorage.getItem(STORAGE_KEY)
               if(value !== null) {
                  console.log("----------------------------------------------------");
                  const eventObj = JSON.parse(value)
                  console.log(eventObj)
                  console.log("----------------------------------------------------");
              }
            stopLocation();
            await AsyncStorage.removeItem(STORAGE_KEY);

        break;

      default:
        console.log(`Sorry, we are out of ${responseBody.event}.`);
    }


}
const stopLocation = () => {
        setLocationStarted(false);
        TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING)
            .then((tracking) => {
                if (tracking) {
                    Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
                }
            })
    }
return (
        <View style = {styles.container}>
                <WebView
//                style={{
//                  flex: 1,
//                  margin: 60,
//                }}
                 scalesPageToFit={true}
                 mixedContentMode="compatibility"
              onMessage={async (event) => {
                                   handleEvents(event)
                                }}
                source = {{ uri: 'http://10.22.0.66:4200' }}
                javaScriptEnabledAndroid
                useWebkit
                startInLoadingState={true}
                geolocationEnabled={true}
                />
             </View>
    );
}
const styles = StyleSheet.create({
   container: {
      height: 1000,
   }
})
TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
        console.log('LOCATION_TRACKING task ERROR:', error);
        return;
    }
    if (data) {
        const { locations } = data;
        let lat = locations[0].coords.latitude;
        let long = locations[0].coords.longitude;
        await onLocation( locations[0]);
console.log(
            `${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
        );
    }
});
export default UserLocation;