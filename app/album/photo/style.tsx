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
  allPicturesContainer: {
    width: windowWidth,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  pictureContainer: {
    marginBottom: 15,
  },
  menuHomePage: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    width: windowWidth,
    paddingVertical: 150,
    paddingHorizontal: 150,
  },
  menuLink: {
    width: "100%",
    fontSize: 30,
  },
});
