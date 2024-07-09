import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, Image, SafeAreaView } from "react-native";
import { styles } from "../style";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const PhotoDetailPage = () => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

  const fetchPhotoDetails = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos/${id}`
      );

      if (response.ok) {
        const photoDetails: Photo = await response.json();
        setPhoto(photoDetails);
      } else {
        console.error("Failed to fetch photo details");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPhotoDetails();
    }
  }, [id]);

  if (!photo) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.photoDetailContainer}>
        <Image
          style={styles.picture}
          source={{
            uri: photo.url,
          }}
        />
        <Text style={styles.text}>{photo.title}</Text>
      </View>
    </SafeAreaView>
  );
};

export default PhotoDetailPage;
