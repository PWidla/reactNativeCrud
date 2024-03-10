import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { styles } from "./photo/style";

interface Album {
  userId: number;
  id: number;
  title: string;
}

const AlbumPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  const fetchAllData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/albums"
      );
      if (response.ok) {
        const newAlbums: Album[] = await response.json();
        setAlbums(newAlbums);
      } else {
        console.error("Failed to fetch albums");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        {albums.map((album, index) => (
          <Link key={index} href={`/album/photo/${album.id}`}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{album.title}</Text>
            </View>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AlbumPage;
