import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

export const mainWindowStyle = StyleSheet.create({
  menuHomePage: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: windowWidth,
    paddingVertical: 50,
    backgroundColor: "#fff",
  },
  menuLink: {
    width: "80%",
    fontSize: 20,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#b38000",
    color: "#fff",
    textAlign: "center",
    borderRadius: 10,
    textDecorationLine: "none",
  },
});
