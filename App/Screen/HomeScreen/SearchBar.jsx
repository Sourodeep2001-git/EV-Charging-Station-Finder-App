import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';

export default function SearchBar({ searchedLocation }) {
  const googlePlacesRef = useRef();
  const [inputKey, setInputKey] = useState(0); // Add state to control input key
  const [isFocused, setIsFocused] = useState(false); // Add state to track focus

  const clearSearchBox = () => {
    googlePlacesRef.current?.setAddressText(''); // Clear input text
    setInputKey(prevKey => prevKey + 1); // Change key to trigger re-render
    setIsFocused(false); // Reset focus state
  };

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      marginTop: 15,
      paddingHorizontal: 5,
      backgroundColor: Colors.WHITE,
      borderRadius: 6,
      alignItems: 'center',
    }}>
      <TouchableOpacity onPress={clearSearchBox}>
        <Ionicons 
          name={isFocused ? "arrow-back" : "location-sharp"} 
          size={24} 
          color={Colors.GRAY} 
           
        />
      </TouchableOpacity>
      <GooglePlacesAutocomplete
        key={inputKey} // Add key to re-render component
        ref={googlePlacesRef}
        placeholder='Search EV Charging Station'
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          searchedLocation(details?.geometry?.location);
        }}
        query={{
          key: 'GOOGLE_API_KEY',
          language: 'en',
        }}
        textInputProps={{
          onFocus: () => setIsFocused(true), // Set focus state to true
          onBlur: () => setIsFocused(false), // Set focus state to false
        }}
      />
      <Ionicons
        name="close-circle-outline"
        size={24}
        color={Colors.GRAY}
        
        onPress={clearSearchBox}
      />
    </View>
  );
}
