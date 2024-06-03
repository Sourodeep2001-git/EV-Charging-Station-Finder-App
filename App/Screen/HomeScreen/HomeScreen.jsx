// HomeScreen.js

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AppMapView from './AppMapView';
import Header from './Header';
import SearchBar from './SearchBar';
import { UserLocationContext } from '../../Context/UserLocationContext';
import GlobalApi from '../../Utils/GlobalApi';
import PlaceListView from './PlaceListView';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';
import * as Location from 'expo-location';

export default function HomeScreen({ navigation }) {
  const { location, setLocation } = useContext(UserLocationContext);
  const [placeList, setPlaceList] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    setSelectedMarker(0);
    location && GetNearByPlace();
  }, [location]);

  const GetNearByPlace = () => {
    const data = {
      "includedTypes": ["electric_vehicle_charging_station"],
      "maxResultCount": 10,
      "locationRestriction": {
        "circle": {
          "center": {
            "latitude": location?.latitude,
            "longitude": location?.longitude
          },
          "radius": 5000.0
        }
      }
    };
    GlobalApi.NewNearByPlace(data).then(resp => {
      setPlaceList(resp.data?.places);
    });
  };

  const handleGetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let { coords } = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  return (
    <SelectMarkerContext.Provider value={{ selectedMarker, setSelectedMarker }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            <Header navigation={navigation} getCurrentLocation={handleGetCurrentLocation} />
            <SearchBar
              searchedLocation={(location) =>
                setLocation({
                  latitude: location.lat,
                  longitude: location.lng
                })}
            />
          </View>
          {!placeList ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <AppMapView placeList={placeList} />
          )}
          {!isKeyboardVisible && (
            <View style={styles.placeListContainer}>
              {placeList && <PlaceListView placeList={placeList} />}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SelectMarkerContext.Provider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    zIndex: 10,
    padding: 20,
    width: '100%',
    paddingHorizontal: 18,
    top: 0,
  },
  placeListContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%',
  },
});
