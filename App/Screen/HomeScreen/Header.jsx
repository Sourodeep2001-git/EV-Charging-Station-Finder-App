import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { MaterialIcons } from '@expo/vector-icons';


export default function Header({ getCurrentLocation }) {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
      <Image source={{ uri: user?.imageUrl }}
        style={{ width: 45, height: 45, borderRadius: 100 }}
      />
      </View>
      <Image source={require('./../../../assets/images/logo2.png')} style={styles.image} />
      <TouchableOpacity onPress={getCurrentLocation} style={styles.buttonContainer}>
        <View style={styles.button}>
          <MaterialIcons name="my-location" size={25} color="green" />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  
  },
  logo:{
    flex:1,
    marginRight: 29
  },
  image: {
    width: 235,
    height: 45,
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginLeft: 15, // Pushes the button to the right
  },
  button: {
    borderRadius: 10,
    shadowColor: '#1AF700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#FDFFDA', // Set the background color as needed
    padding: 10 // Adjust padding as needed
  },
})
