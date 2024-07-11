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
import { generalStyles } from "../../generalStyle";
import { styles } from "../style";

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
  const [newCommentName, setNewCommentName] = useState<string>("");
  const [editCommentBodies, setEditCommentBodies] = useState<{
    [key: number]: string;
  }>({});
  const [editCommentNames, setEditCommentNames] = useState<{
    [key: number]: string;
  }>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lastUsedId, setLastUsedId] = useState<number>(500);

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
        const initialCommentBodies = commentsData.reduce((acc, comment) => {
          acc[comment.id] = comment.body;
          return acc;
        }, {} as { [key: number]: string });
        setEditCommentBodies(initialCommentBodies);

        const initialCommentNames = commentsData.reduce((acc, comment) => {
          acc[comment.id] = comment.name;
          return acc;
        }, {} as { [key: number]: string });
        setEditCommentNames(initialCommentNames);
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

  const handleCreateComment = () => {
    if (!newCommentBody.trim() || !newCommentName.trim()) {
      Alert.alert("Error", "Comment name and body cannot be empty!");
      return;
    }

    if (comments.some((comment) => comment.name === newCommentName)) {
      Alert.alert("Error", "Comment name must be unique!");
      return;
    }

    const uniqueId = lastUsedId + 1;

    const newComment: Comment = {
      postId: Number(id),
      id: uniqueId,
      name: newCommentName,
      email: "user@example.com",
      body: newCommentBody,
    };

    setComments((prevComments) => [newComment, ...prevComments]);
    setEditCommentBodies((prevBodies) => ({
      ...prevBodies,
      [uniqueId]: newCommentBody,
    }));

    setEditCommentNames((prevNames) => ({
      ...prevNames,
      [uniqueId]: newCommentName,
    }));

    setNewCommentBody("");
    setNewCommentName("");
    setLastUsedId(uniqueId);

    Alert.alert("Success", "Comment created successfully!");
  };

  const handleUpdateComment = (commentId: number) => {
    const updatedBody = editCommentBodies[commentId];
    const updatedName = editCommentNames[commentId];

    if (!updatedBody.trim() || !updatedName.trim()) {
      Alert.alert("Error", "Comment body and name cannot be empty!");
      return;
    }

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, body: updatedBody, name: updatedName }
          : comment
      )
    );
    setEditingCommentId(null);
    Alert.alert("Success", "Comment updated successfully!");
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
    setEditingCommentId(null);
    Alert.alert("Success", "Comment deleted successfully!");
  };

  const handleEditComment = (commentId: number) => {
    setEditingCommentId(commentId === editingCommentId ? null : commentId);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        {post && (
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{post.title}</Text>
            <Text style={styles.bodyText}>{post.body}</Text>
            <TextInput
              value={newCommentName}
              onChangeText={setNewCommentName}
              placeholder="Enter new comment name"
              style={generalStyles.textInput}
            />
            <TextInput
              value={newCommentBody}
              onChangeText={setNewCommentBody}
              placeholder="Enter new comment body"
              style={generalStyles.textInput}
            />
            <TouchableOpacity
              style={generalStyles.button}
              onPress={handleCreateComment}
            >
              <Text style={generalStyles.buttonText}>Add Comment</Text>
            </TouchableOpacity>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                {editingCommentId === comment.id ? (
                  <>
                    <Text>Name</Text>
                    <TextInput
                      value={editCommentNames[comment.id]}
                      onChangeText={(text) =>
                        setEditCommentNames((prev) => ({
                          ...prev,
                          [comment.id]: text,
                        }))
                      }
                      placeholder="Enter new comment name"
                      style={generalStyles.textInput}
                    />
                    <Text>Body</Text>
                    <TextInput
                      value={editCommentBodies[comment.id]}
                      onChangeText={(text) =>
                        setEditCommentBodies((prev) => ({
                          ...prev,
                          [comment.id]: text,
                        }))
                      }
                      placeholder="Enter new comment body"
                      style={generalStyles.textInput}
                    />
                    <TouchableOpacity
                      style={[generalStyles.button, generalStyles.updateButton]}
                      onPress={() => handleUpdateComment(comment.id)}
                    >
                      <Text style={generalStyles.buttonText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[generalStyles.button, generalStyles.deleteButton]}
                      onPress={() => handleDeleteComment(comment.id)}
                    >
                      <Text style={generalStyles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleEditComment(comment.id)}
                  >
                    <Text style={styles.commentText}>{comment.name}</Text>
                    <Text style={styles.commentText}>{comment.body}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetailsPage;
