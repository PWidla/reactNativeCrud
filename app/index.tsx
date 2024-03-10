import { Link } from "expo-router";
import { View } from "react-native";
import { styles } from "./album/photo/style";

const HomePage = () => {
  return (
    <View style={styles.menuHomePage}>
      <Link href="/album/AlbumPage" style={styles.menuLink}>
        Albums
      </Link>
      <Link href="/post/PostPage" style={styles.menuLink}>
        Posts
      </Link>
      <Link href="/user/UserPage" style={styles.menuLink}>
        Users
      </Link>
    </View>
  );
};

export default HomePage;
