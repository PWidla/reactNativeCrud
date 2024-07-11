import { StyleSheet, Dimensions, StatusBar } from "react-native";

const windowWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    margin: 20,
  },
  textContainer: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 20,
  },
  commentContainer: {
    marginBottom: 10,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  commentText: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});
