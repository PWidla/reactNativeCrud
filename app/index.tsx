import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const HomePage = () => {
  return (
    <View>
      <Link href="/album/AlbumPage">Albums</Link>
      <Link href="/post/PostPage">Posts</Link>
      <Link href="/user/UserPage">Users</Link>
    </View>
  );
};

export default HomePage;
