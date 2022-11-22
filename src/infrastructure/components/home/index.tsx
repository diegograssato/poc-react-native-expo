import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { WebView } from 'react-native-webview';
import IntegrationOptions from '../../../domain/models/IntegrationOptions';
import HomeController from '../../controllers/HomeController';
import IntegrationRepositoryImpl from '../../repository/IntegrationRepositoryImpl';

const URL_WEBVIEW_LOCATION = 'http://10.22.0.56:4200';


export function Home() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const homeController = new HomeController();

  useEffect(() => {
      
   
    //homeController.initEvents();
    /**
     * Instancia o evento para monitorar o status do device background ou foregroud
     */
      const subscription = AppState.addEventListener(
        'change',
        _handleAppStateChange
      );

    return () => {
      subscription.remove();
    };
  }, []);

  
  /**
   * Metodo que é envocado toda vez que o device alterar seu estado
   */
  const _handleAppStateChange = async (nextAppState: any) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);

    console.log('AppState', appState.current);
   // homeController.load();
    
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
          homeController.handleEvents(event);
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
