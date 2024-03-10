import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, Image, ScrollView, SafeAreaView } from "react-native";
import { styles } from "./style";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const PhotoPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { id } = useLocalSearchParams<{ id: string }>();

  const fetchAllData = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${id}/photos`
      );

      if (response.ok) {
        const newPhotos: Photo[] = await response.json();
        setPhotos(newPhotos);
      } else {
        console.error("Failed to fetch photos");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    fetchAllData();
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <View style={styles.allPicturesContainer}>
          {photos.map((photo, index) => (
            <View style={styles.pictureContainer}>
              <Image
                style={styles.picture}
                source={{
                  uri: photo.url,
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PhotoPage;
