import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const PhotoPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>photos for album {id}</Text>
    </View>
  );
};

export default PhotoPage;
