import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import { styles } from "../album/photo/style";
import { generalStyles } from "../generalStyle";
import { Link } from "expo-router";
import { Picker } from "@react-native-picker/picker";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
}

const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostBody, setNewPostBody] = useState<string>("");
  const [editTitle, setEditTitle] = useState<{ [key: number]: string }>({});
  const [editBody, setEditBody] = useState<{ [key: number]: string }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "all">("all");

  useEffect(() => {
    fetchAllData();
    fetchUsers();
  }, [selectedUserId]);

  const fetchAllData = async () => {
    let url = "https://jsonplaceholder.typicode.com/posts";

    if (selectedUserId !== "all") {
      url += `?userId=${selectedUserId}`;
    }

    try {
      const postsResponse = await fetch(url);
      if (postsResponse.ok) {
        const newPosts: Post[] = await postsResponse.json();
        setPosts(newPosts);
        const initialTitles = newPosts.reduce((acc, post) => {
          acc[post.id] = post.title;
          return acc;
        }, {} as { [key: number]: string });
        setEditTitle(initialTitles);
        const initialBodies = newPosts.reduce((acc, post) => {
          acc[post.id] = post.body;
          return acc;
        }, {} as { [key: number]: string });
        setEditBody(initialBodies);
      } else {
        console.error("Failed to fetch posts");
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

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostBody.trim()) {
      Alert.alert("Error", "Title and body cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newPostTitle,
            body: newPostBody,
            userId: 1,
          }),
        }
      );

      if (response.ok) {
        const newPost: Post = await response.json();
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        setEditTitle((prevTitles) => ({
          ...prevTitles,
          [newPost.id]: newPost.title,
        }));
        setEditBody((prevBodies) => ({
          ...prevBodies,
          [newPost.id]: newPost.body,
        }));
        setNewPostTitle("");
        setNewPostBody("");
        Alert.alert("Success", "Post created successfully!");
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleUpdatePost = async (postId: number) => {
    const updatedTitle = editTitle[postId];
    const updatedBody = editBody[postId];

    if (!updatedTitle.trim() || !updatedBody.trim()) {
      Alert.alert("Error", "Title and body cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: updatedTitle, body: updatedBody }),
        }
      );

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, title: updatedTitle, body: updatedBody }
              : post
          )
        );
        Alert.alert("Success", "Post updated successfully!");
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        Alert.alert("Success", "Post deleted successfully!");
      } else {
        console.error("Failed to delete post");
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
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            placeholder="Enter new post title"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newPostBody}
            onChangeText={setNewPostBody}
            placeholder="Enter new post body"
            style={generalStyles.textInput}
          />
          <TouchableOpacity
            style={generalStyles.button}
            onPress={handleCreatePost}
          >
            <Text style={generalStyles.buttonText}>Create Post</Text>
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
        {posts.map((post) => (
          <View key={post.id} style={styles.textContainer}>
            <Link href={`/post/comment/${post.id}`}>
              <Text style={styles.text}>{post.title}</Text>
            </Link>
            <TextInput
              value={editTitle[post.id]}
              onChangeText={(text) =>
                setEditTitle((prev) => ({ ...prev, [post.id]: text }))
              }
              placeholder="Enter new title"
              style={generalStyles.textInput}
            />
            <TextInput
              value={editBody[post.id]}
              onChangeText={(text) =>
                setEditBody((prev) => ({ ...prev, [post.id]: text }))
              }
              placeholder="Enter new body"
              style={generalStyles.textInput}
            />
            <TouchableOpacity
              style={[generalStyles.button, generalStyles.updateButton]}
              onPress={() => handleUpdatePost(post.id)}
            >
              <Text style={generalStyles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[generalStyles.button, generalStyles.deleteButton]}
              onPress={() => handleDeletePost(post.id)}
            >
              <Text style={generalStyles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostPage;
