import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { styles } from "./photo/style";
import { generalStyles } from "../generalStyle";
import { Picker } from "@react-native-picker/picker";

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface User {
  id: number;
  name: string;
}

const AlbumPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newAlbumTitle, setNewAlbumTitle] = useState<string>("");
  const [albumTitles, setAlbumTitles] = useState<{ [key: number]: string }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "all">("all");

  useEffect(() => {
    fetchAllData();
    fetchUsers();
  }, [selectedUserId]);

  const fetchAllData = async () => {
    let url = "https://jsonplaceholder.typicode.com/albums";
    if (selectedUserId !== "all") {
      url += `?userId=${selectedUserId}`;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        const newAlbums: Album[] = await response.json();
        setAlbums(newAlbums);
        const initialTitles = newAlbums.reduce((acc, album) => {
          acc[album.id] = album.title;
          return acc;
        }, {} as { [key: number]: string });
        setAlbumTitles(initialTitles);
      } else {
        console.error("Failed to fetch albums");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (response.ok) {
        const data: User[] = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleCreateAlbum = async () => {
    if (!newAlbumTitle.trim()) {
      Alert.alert("Error", "Album title cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/albums",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newAlbumTitle,
            userId: 1,
          }),
        }
      );

      if (response.ok) {
        const newAlbum: Album = await response.json();
        setAlbums((prevAlbums) => [...prevAlbums, newAlbum]);
        setAlbumTitles((prevTitles) => ({
          ...prevTitles,
          [newAlbum.id]: newAlbum.title,
        }));
        setNewAlbumTitle("");
        Alert.alert("Success", "Album created successfully!");
      } else {
        console.error("Failed to create album");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleUpdateAlbum = async (albumId: number) => {
    const updatedTitle = albumTitles[albumId];
    if (!updatedTitle.trim()) {
      Alert.alert("Error", "Album title cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${albumId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: updatedTitle }),
        }
      );

      if (response.ok) {
        setAlbums((prevAlbums) =>
          prevAlbums.map((album) =>
            album.id === albumId ? { ...album, title: updatedTitle } : album
          )
        );
        Alert.alert("Success", "Album updated successfully!");
      } else {
        console.error("Failed to update album");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleDeleteAlbum = async (albumId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${albumId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAlbums((prevAlbums) =>
          prevAlbums.filter((album) => album.id !== albumId)
        );
        Alert.alert("Success", "Album deleted successfully!");
      } else {
        console.error("Failed to delete album");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <View style={styles.textContainer}>
          <TextInput
            value={newAlbumTitle}
            onChangeText={setNewAlbumTitle}
            placeholder="Enter new album title"
            style={generalStyles.textInput}
          />
          <TouchableOpacity
            style={generalStyles.button}
            onPress={handleCreateAlbum}
          >
            <Text style={generalStyles.buttonText}>Create Album</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text>Select User:</Text>
          <Picker
            selectedValue={selectedUserId}
            onValueChange={(itemValue) =>
              setSelectedUserId(itemValue as number | "all")
            }
          >
            <Picker.Item label="All Users" value="all" />
            {users.map((user) => (
              <Picker.Item key={user.id} label={user.name} value={user.id} />
            ))}
          </Picker>
        </View>
        {albums.map((album) => (
          <View key={album.id} style={styles.textContainer}>
            <Link href={`/album/photo/${album.id}`}>
              <Text style={styles.text}>{album.title}</Text>
            </Link>
            <TextInput
              value={albumTitles[album.id]}
              onChangeText={(text) =>
                setAlbumTitles((prevTitles) => ({
                  ...prevTitles,
                  [album.id]: text,
                }))
              }
              placeholder="Enter new title"
              style={generalStyles.textInput}
            />
            <TouchableOpacity
              style={[generalStyles.button, generalStyles.updateButton]}
              onPress={() => handleUpdateAlbum(album.id)}
            >
              <Text style={generalStyles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[generalStyles.button, generalStyles.deleteButton]}
              onPress={() => handleDeleteAlbum(album.id)}
            >
              <Text style={generalStyles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AlbumPage;
