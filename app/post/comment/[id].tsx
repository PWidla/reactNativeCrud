import { useLocalSearchParams } from "expo-router";
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
import { styles } from "../../album/photo/style";
import { generalStyles } from "../../generalStyle";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const PostDetailsPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentBody, setNewCommentBody] = useState<string>("");
  const { id } = useLocalSearchParams<{ id: string }>();

  const fetchPostData = async () => {
    try {
      const postResponse = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      const commentsResponse = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}/comments`
      );

      if (postResponse.ok && commentsResponse.ok) {
        const postData: Post = await postResponse.json();
        const commentsData: Comment[] = await commentsResponse.json();

        setPost(postData);
        setComments(commentsData);
      } else {
        console.error("Failed to fetch post or comments");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, []);

  const handleCreateComment = async () => {
    if (!newCommentBody.trim()) {
      Alert.alert("Error", "Comment body cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: id,
            body: newCommentBody,
            name: "User",
            email: "user@example.com",
          }),
        }
      );

      if (response.ok) {
        const newComment: Comment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
        setNewCommentBody("");
        Alert.alert("Success", "Comment created successfully!");
      } else {
        console.error("Failed to create comment");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        {post && (
          <View style={styles.textContainer}>
            <Text style={styles.text}>{post.title}</Text>
            <Text style={styles.text}>{post.body}</Text>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.textContainer}>
                <Text style={styles.text}>{comment.body}</Text>
              </View>
            ))}
            <TextInput
              value={newCommentBody}
              onChangeText={setNewCommentBody}
              placeholder="Enter new comment"
              style={generalStyles.textInput}
            />
            <TouchableOpacity
              style={generalStyles.button}
              onPress={handleCreateComment}
            >
              <Text style={generalStyles.buttonText}>Add Comment</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetailsPage;
