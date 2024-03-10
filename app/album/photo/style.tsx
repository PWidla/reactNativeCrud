import { StyleSheet, Dimensions, StatusBar } from "react-native";

const windowWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: "#e0e0e0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    width: windowWidth,
  },
  safeAreaView: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  picture: {
    width: 150,
    height: 150,
  },
  pictureContainer: {
    width: windowWidth,
    alignItems: "center",
  },
});
