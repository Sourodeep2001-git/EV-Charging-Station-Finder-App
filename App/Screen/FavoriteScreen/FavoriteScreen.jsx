import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import Colors from '../../Utils/Colors';
import { collection, query, where, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from '../../Utils/FirebaseConfig';
import PlaceItem from '../HomeScreen/PlaceItem';
import { useUser } from '@clerk/clerk-expo';

export default function FavoriteScreen() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [favList, setFavList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getFav();
    }
  }, [user]);

  const getFav = async () => {
    setLoading(true);
    const q = query(collection(db, "ev-fav-place"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress));

    const querySnapshot = await getDocs(q);
    const newFavList = [];
    querySnapshot.forEach((doc) => {
      newFavList.push(doc.data());
    });
    setFavList(newFavList);
    setLoading(false);
  };

  return (
    <View>
      <Text style={{ padding: 10, fontFamily: 'outfit-medium', fontSize: 30 }}>
        My Favorite<Text style={{ color: Colors.PRIMARY }}>Place</Text>
      </Text>
      {loading && (
        <View style={{
          height: '100%',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ActivityIndicator size={'large'} color={Colors.PRIMARY} />
        </View>
      )}
      <FlatList
        data={favList}
        onRefresh={getFav}
        refreshing={loading}
        style={{ paddingBottom: 200 }}
        keyExtractor={(item) => item.place.id.toString()}
        renderItem={({ item }) => (
          <PlaceItem
            place={item.place}
            isFav={true}
            markedFav={() => getFav()} // Pass a callback function
          />
        )}
      />
      <View style={{ marginBottom: 200, height: 200 }} />
    </View>
  );
}
