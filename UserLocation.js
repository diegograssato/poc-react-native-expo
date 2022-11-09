import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { WebView } from 'react-native-webview';

const LOCATION_TRACKING = 'location-tracking';


async function onLocation(position) {
    console.log(position);
    if(position){
        let baseURL = `https://dtux-lab-08.free.beeceptor.com?lat=${position.coords.latitude}&long=${position.coords.longitude}`
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
const startLocation = () => {
        startLocationTracking();
    }

async function handleEvents(event) {
    let eventObj = JSON.parse(event.nativeEvent.data)

//        await AsyncStorage.setItem(
//          '@Armando:key',eventObj
//        );

    startLocationTracking();
    console.log(eventObj);
//    const value = await AsyncStorage.getItem('@Armando:key');
//    if (value !== null) {
//      // We have data!!
//      console.log(value);
//    }
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
                 scalesPageToFit={false}
                 mixedContentMode="compatibility"
               onMessage={async (event) => {
                     handleEvents(event)
                  }}
                source = {{ uri: 'https://4db4-177-55-157-202.sa.ngrok.io' }}
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