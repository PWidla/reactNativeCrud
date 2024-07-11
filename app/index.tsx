import { Link } from "expo-router";
import { View } from "react-native";
import { mainWindowStyle } from "./users/mainWindowStyle";

const HomePage = () => {
  return (
    <View style={mainWindowStyle.menuHomePage}>
      <Link href="/album/AlbumPage" style={mainWindowStyle.menuLink}>
        Albums
      </Link>
      <Link href="/post/PostPage" style={mainWindowStyle.menuLink}>
        Posts
      </Link>
      <Link href="/user/UserPage" style={mainWindowStyle.menuLink}>
        Users
      </Link>
      <Link href="/todo/TodoPage" style={mainWindowStyle.menuLink}>
        Todos
      </Link>
    </View>
  );
};

export default HomePage;
