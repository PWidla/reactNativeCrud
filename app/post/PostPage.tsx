import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { styles } from "../album/photo/style";
import { generalStyles } from "../generalStyle";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostBody, setNewPostBody] = useState<string>("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // States to hold temporary values for updating posts
  const [editTitle, setEditTitle] = useState<{ [key: number]: string }>({});
  const [editBody, setEditBody] = useState<{ [key: number]: string }>({});

  const fetchAllData = async () => {
    try {
      const postsResponse = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (postsResponse.ok) {
        const newPosts: Post[] = await postsResponse.json();
        setPosts(newPosts);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

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
    const postToUpdate = posts.find((post) => post.id === postId);
    if (!postToUpdate) {
      console.error(`Post with id ${postId} not found`);
      return;
    }

    const updatedTitle = editTitle[postId]?.trim() || postToUpdate.title;
    const updatedBody = editBody[postId]?.trim() || postToUpdate.body;

    if (!updatedTitle || !updatedBody) {
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
        setEditTitle((prev) => ({ ...prev, [postId]: "" }));
        setEditBody((prev) => ({ ...prev, [postId]: "" }));
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

  const handleSelectPost = (postId: number) => {
    setSelectedPostId(postId);
    const postToUpdate = posts.find((post) => post.id === postId);
    if (postToUpdate) {
      setEditTitle((prev) => ({ ...prev, [postId]: postToUpdate.title }));
      setEditBody((prev) => ({ ...prev, [postId]: postToUpdate.body }));
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
        {posts.map((post) => (
          <View key={post.id} style={styles.textContainer}>
            <Link href={`/post/comment/${post.id}`}>
              <Text style={styles.text}>{post.title}</Text>
            </Link>
            <TextInput
              value={
                selectedPostId === post.id
                  ? editTitle[post.id] ?? post.title
                  : post.title
              }
              onChangeText={(text) =>
                setEditTitle((prev) => ({ ...prev, [post.id]: text }))
              }
              placeholder="Enter new title"
              style={generalStyles.textInput}
            />
            <TextInput
              value={
                selectedPostId === post.id
                  ? editBody[post.id] ?? post.body
                  : post.body
              }
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
            <TouchableOpacity
              style={generalStyles.button}
              onPress={() => handleSelectPost(post.id)}
            >
              <Text style={generalStyles.buttonText}>Select</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostPage;
