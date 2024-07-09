import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { styles } from "./style";
import { generalStyles } from "../../generalStyle";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const PhotoPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newTitles, setNewTitles] = useState<{ [key: number]: string }>({});
  const { id } = useLocalSearchParams<{ id: string }>();

  const fetchAllData = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${id}/photos`
      );

      if (response.ok) {
        const newPhotos: Photo[] = await response.json();
        const photosWithTitles = newPhotos.map((photo) => ({
          ...photo,
          title: newTitles[photo.id] || photo.title,
        }));
        setPhotos(photosWithTitles);
      } else {
        console.error("Failed to fetch photos");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdate = async (photoId: number, updatedTitle: string) => {
    try {
      if (!updatedTitle.trim()) {
        Alert.alert("Error", "Title cannot be empty!");
        return;
      }

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos/${photoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: updatedTitle }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Photo title updated successfully!");
        setPhotos((prevPhotos) =>
          prevPhotos.map((photo) =>
            photo.id === photoId ? { ...photo, title: updatedTitle } : photo
          )
        );
        setNewTitles((prevTitles) => ({
          ...prevTitles,
          [photoId]: updatedTitle,
        }));
      } else {
        console.error("Failed to update photo title");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos/${photoId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Photo deleted successfully!");
        setPhotos((prevPhotos) =>
          prevPhotos.filter((photo) => photo.id !== photoId)
        );
        setNewTitles((prevTitles) => {
          const { [photoId]: deletedTitle, ...rest } = prevTitles;
          return rest;
        });
      } else {
        console.error("Failed to delete photo");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleNavigateToDetail = (photoId: number) => {
    router.push(`/album/photo/photoDetails/${photoId}`);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <View style={styles.allPicturesContainer}>
          {photos.map((photo) => (
            <View key={photo.id} style={styles.pictureContainer}>
              <TouchableOpacity
                onPress={() => handleNavigateToDetail(photo.id)}
              >
                <Image
                  style={styles.picture}
                  source={{
                    uri: photo.url,
                  }}
                />
              </TouchableOpacity>
              <TextInput
                value={newTitles[photo.id] || photo.title}
                onChangeText={(text) =>
                  setNewTitles((prevTitles) => ({
                    ...prevTitles,
                    [photo.id]: text,
                  }))
                }
                placeholder="Enter new title"
              />
              <TouchableOpacity
                style={[generalStyles.button, generalStyles.updateButton]}
                onPress={() =>
                  handleUpdate(photo.id, newTitles[photo.id] || photo.title)
                }
              >
                <Text style={generalStyles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[generalStyles.button, generalStyles.deleteButton]}
                onPress={() => handleDeletePhoto(photo.id)}
              >
                <Text style={generalStyles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PhotoPage;
