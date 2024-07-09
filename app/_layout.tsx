import React from "react";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home page",
        }}
      />
      {/* <Stack.Screen
        name="users/[id]"
        options={{
          headerTitle: "User page",
        }}
      /> */}
      <Stack.Screen
        name="album/AlbumPage"
        options={{
          headerTitle: "Albums page",
        }}
      />
      <Stack.Screen
        name="post/PostPage"
        options={{
          headerTitle: "Posts page",
        }}
      />
      <Stack.Screen
        name="user/UserPage"
        options={{
          headerTitle: "Users page",
        }}
      />
      <Stack.Screen
        name="album/photo/[id]"
        options={{
          headerTitle: "Photos page",
        }}
      />
      <Stack.Screen
        name="album/photo/photoDetails/[id]"
        options={{
          headerTitle: "Photo details",
        }}
      />
      <Stack.Screen
        name="post/comment/[id]"
        options={{
          headerTitle: "Comments",
        }}
      />
    </Stack>
  );
};

export default RootLayout;
