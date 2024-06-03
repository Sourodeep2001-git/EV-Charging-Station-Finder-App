import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { Marker } from 'react-native-maps';
import Colors from '../../Utils/Colors';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';

export default function Markers({ index, place }) {
  const { selectedMarker, setSelectedMarker } = useContext(SelectMarkerContext);

  // Ensure the place and location exist and have valid coordinates
  const latitude = place?.location?.latitude;
  const longitude = place?.location?.longitude;

  // Log the coordinates for debugging
  console.log(`Marker ${index} - Latitude: ${latitude}, Longitude: ${longitude}`);

  // Check if coordinates are valid numbers
  if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
    console.error(`Invalid coordinates for marker ${index}`);
    return null;
  }

  return (
    <Marker
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      onPress={() => setSelectedMarker(index)}
    >
      {selectedMarker === index ? (
        <Image
          source={require('./../../../assets/images/marker-selected.png')}
          style={{ width: 60, height: 60 }}
        />
      ) : (
        <Image
          source={require('./../../../assets/images/marker.png')}
          style={{ width: 60, height: 60 }}
        />
      )}
    </Marker>
  );
}
