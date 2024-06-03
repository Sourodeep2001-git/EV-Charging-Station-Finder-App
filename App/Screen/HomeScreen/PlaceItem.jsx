import { View, Text, Image, Dimensions, Pressable, ToastAndroid, Platform, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../Utils/Colors';
import GlobalApi from '../../Utils/GlobalApi';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";
import { app } from '../../Utils/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

export default function PlaceItem({ place, isFav: initialIsFav, markedFav }) {
  const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
  const { user } = useUser();
  const db = getFirestore(app);
  const [isFav, setIsFav] = useState(initialIsFav);

  useEffect(() => {
    console.log("initialIsFav changed:", initialIsFav);
    setIsFav(initialIsFav);
  }, [initialIsFav]);

  const onSetFav = async (place) => {
    try {
      await setDoc(doc(db, "ev-fav-place", place.id.toString()), {
        place: place,
        email: user?.primaryEmailAddress?.emailAddress
      });
      console.log("Fav Added");
      setIsFav(true);
      markedFav(true); // Pass true to indicate favorite added
      if (Platform.OS === 'android') {
        ToastAndroid.show('Fav Added!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error setting favorite:", error);
    }
  };

  const onRemoveFav = async (placeId) => {
    try {
      await deleteDoc(doc(db, "ev-fav-place", placeId.toString()));
      console.log("Fav Removed");
      setIsFav(false);
      markedFav(false); // Pass false to indicate favorite removed
      if (Platform.OS === 'android') {
        ToastAndroid.show('Fav Removed!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const onDirectionClick = () => {
    const url = Platform.select({
      ios: `maps:${place.location.latitude},${place.location.longitude}?q=${place.formattedAddress}`,
      android: `geo:${place.location.latitude},${place.location.longitude}?q=${place.formattedAddress}`,
    });

    Linking.openURL(url);
  };

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        margin: 5,
        borderRadius: 10,
        width: Dimensions.get('screen').width * 0.9,
        marginHorizontal: 20
      }}
    >
      <LinearGradient
        colors={['transparent', '#ffffff', '#ffffff']}
        style={{ borderRadius: 10 }}
      >
        {isFav ? (
          <Pressable style={{ position: 'absolute', right: 0, margin: 5 }}
            onPress={() => onRemoveFav(place.id)}
          >
            <Ionicons name='heart-sharp' size={30} color='red' />
          </Pressable>
        ) : (
          <Pressable style={{ position: 'absolute', right: 0, margin: 5 }}
            onPress={() => onSetFav(place)}
          >
            <Ionicons name='heart-outline' size={30} color='white' />
          </Pressable>
        )}

        <Image
          source={
            place?.photos && place.photos.length > 0 ? {
              uri: `${PLACE_PHOTO_BASE_URL}${place.photos[0].name}/media?key=${GlobalApi.API_KEY}&maxHeightPx=800&maxWidthPx=1200`
            } : require('./../../../assets/images/Electric-Vehicles.png')}
          style={{
            width: '100%', borderRadius: 10,
            height: 140, zIndex: -1
          }}
        />
        <View style={{ padding: 15 }}>
          <Text numberOfLines={1} style={{
            fontSize: 23,
            fontFamily: 'outfit-medium'
          }}>{place.displayName?.text}</Text>
          <Text style={{
            color: Colors.GRAY,
            fontFamily: 'outfit'
          }}>{place?.shortFormattedAddress}</Text>
          <View style={{
            display: 'flex', flexDirection: 'row',
            alignItems: 'center', justifyContent: 'space-between', marginTop: 15
          }}>
            <View>
              <Text style={{
                fontFamily: 'outfit',
                color: Colors.GRAY,
                fontSize: 17
              }}>Connectors</Text>
              <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 20,
                marginTop: 2
              }}>{place?.evChargeOptions?.connectorCount} Points</Text>
            </View>
            <Pressable 
              onPress={onDirectionClick}
              style={{
                padding: 12, backgroundColor: Colors.PRIMARY,
                borderRadius: 6, paddingHorizontal: 14
              }}
            >
              <FontAwesome name="location-arrow"
                size={25} color="white" />
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
