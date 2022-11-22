import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  AppState,
} from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import AuthController from './src/infrastructure/controllers/AuthControler';

const LOCATION_TRACKING = 'location-tracking';
const URL_LOCATION_TRACKING = 'https://dtux-lab-15.free.beeceptor.com';
const URL_WEBVIEW_LOCATION = 'http://10.22.0.66:4200';
const STORAGE_KEY = '@StorageLocationTracking';

function UserLocation() {
  const appState = useRef(AppState.currentState);

  /** Migrado */
  const startLocationTracking = async () => {
    console.log('[startLocationTracking]');

    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 10000,
      distanceInterval: 0,
      foregroundService: {
        notificationColor: '#009edb',
        notificationTitle: 'Using your location',
        notificationBody:
          'Para desligar, volte ao aplicativo e desligue alguma coisa.',
      },
    });

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );

    console.log('tracking started?', hasStarted);
  };

  /** Migrado */
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    /** Migrado */
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

  /** Migrado */
  const _handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }

    appState.current = nextAppState;
    console.log('AppState', appState.current);
  };
  /** Migrado parcialmente */
  async function handleEvents(event) {
    console.log('\n[handleEvents]');
    const responseBody = JSON.parse(event.nativeEvent.data);

    switch (responseBody.event) {
      case 'onLogin':
        startLocationTracking();
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(responseBody.data)
        );
        onStateTracking('login');
        break;

      case 'onLogout':
        console.log('[handleEvents] Event Logout');
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value !== null) {
          console.log('----------------------------------------------------');
          const eventObj = JSON.parse(value);
          console.log(eventObj);
          console.log('----------------------------------------------------');
        }

        stopLocation();
        onStateTracking('logout');
        await AsyncStorage.removeItem(STORAGE_KEY);

        break;

      default:
        console.log(`Sorry, we are out of ${responseBody.event}.`);
    }
  }
  /** Migrado */
  const stopLocation = () => {
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        hidden={true}
        backgroundColor="#009edb"
        showHideTransition={'fade'}
        animated={true}
      />

      <WebView
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        onMessage={async (event) => {
          handleEvents(event);
        }}
        originWhitelist={['*']}
        source={{ uri: URL_WEBVIEW_LOCATION }}
        javaScriptEnabledAndroid
        useWebkit
        startInLoadingState={true}
        geolocationEnabled={true}
        allowsFullscreenVideo={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        renderLoading={() => (
          <ActivityIndicator
            color="#009edb"
            size="large"
            style={styles.activityIndicatorStyle}
          />
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    background: '#009edb',
  },
  activityIndicatorStyle: {
    flex: 1,
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

const onSendTracking = async (position) => {
  if (position) {
    try {
      const authController = new AuthController();
      authController.login("diego", "anna");
      //let baseURL = `${URL_LOCATION_TRACKING}?lat=${position.coords.latitude}&long=${position.coords.longitude}`;
      //return await fetch(baseURL);
    } catch (error) {
      console.error(error);
    }
  }
};

const onStateTracking = async (state) => {
  try {
    let baseURL = `${URL_LOCATION_TRACKING}?state=${state}`;
    return await fetch(baseURL);
  } catch (error) {
    console.error(error);
  }
};
/** Migrado */
TaskManager.defineTask(
  LOCATION_TRACKING,
  async ({ data: { locations }, error }) => {
    if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
    }
    if (locations && locations.length > 0) {
      var position = [...locations].shift();
      console.log(
        `${new Date(Date.now()).toLocaleString()}: ${
          position.coords.latitude
        },${position.coords.longitude}`
      );
      onSendTracking(position);
    }
  }
);

export default UserLocation;
