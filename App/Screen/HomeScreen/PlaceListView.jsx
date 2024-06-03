import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PlaceItem from './PlaceItem';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';
import { getFirestore } from "firebase/firestore";
import { app } from '../../Utils/FirebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';

export default function PlaceListView({ placeList }) {
  const flatListRef = useRef(null);
  const { user } = useUser();
  const [favList, setFavList] = useState([]);
  const { selectedMarker, setSelectedMarker } = useContext(SelectMarkerContext);

  useEffect(() => {
    selectedMarker && scrollToIndex(selectedMarker);
  }, [selectedMarker]);

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const getItemLayout = (_, index) => ({
    length: Dimensions.get('window').width,
    offset: Dimensions.get('window').width * index,
    index
  });

  // Get Data from Firestore 
  const db = getFirestore(app);
  useEffect(() => {
    user && getFav();
  }, [user]);

  const getFav = async () => {
    setFavList([]);
    const q = query(collection(db, "ev-fav-place"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setFavList(favList => [...favList, doc.data()]);
    });
  };

  const isFav = (place) => {
    const result = favList.find(item => item.place.id == place.id);
    return result ? true : false;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={placeList}
        horizontal
        pagingEnabled
        ref={flatListRef}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.itemContainer}>
            <PlaceItem
              place={item}
              isFav={isFav(item)}
              markedFav={() => getFav()}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
