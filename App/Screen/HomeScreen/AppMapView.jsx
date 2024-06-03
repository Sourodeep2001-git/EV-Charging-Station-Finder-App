import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewStyle from './../../Utils/MapViewStyle.json';
import { UserLocationContext } from '../../Context/UserLocationContext';
import Markers from './Markers';

export default function AppMapView({ placeList }) {
  const { location, errorMsg } = useContext(UserLocationContext);

  if (errorMsg) {
    console.error('Error fetching user location:', errorMsg);
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading Your Location...</Text>
      </View>
    );
  }

  const { latitude: userLatitude, longitude: userLongitude } = location;

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapViewStyle}
        region={{
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0421 
        }}
      >
        <Marker
          coordinate={{
            latitude: userLatitude,
            longitude: userLongitude
          }}
        >
          <Image
            source={require('./../../../assets/images/car-marker.png')}
            style={{ width: 60, height: 60 }}
          />
        </Marker>

        {placeList && placeList.map((item, index) => (
          <Markers key={index} index={index} place={item} />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
