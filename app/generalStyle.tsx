import { StyleSheet } from "react-native";

export const generalStyles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#007bff",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    marginTop: 5,
  },
  updateButton: {
    backgroundColor: "#28a745",
    marginTop: 5,
  },
  safeAreaView: {
    flex: 1,
    margin: 20,
  },
  textContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
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
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});
