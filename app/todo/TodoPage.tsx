import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { generalStyles } from "../generalStyle";
import { Picker } from "@react-native-picker/picker";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface User {
  id: number;
  name: string;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");
  const [editTodoTitle, setEditTodoTitle] = useState<{ [key: number]: string }>(
    {}
  );
  const [editTodoCompleted, setEditTodoCompleted] = useState<{
    [key: number]: boolean;
  }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "all">("all");
  const [lastUsedId, setLastUsedId] = useState<number>(200);

  useEffect(() => {
    fetchAllTodos();
    fetchUsers();
  }, [selectedUserId]);

  const fetchAllTodos = async () => {
    let url = "https://jsonplaceholder.typicode.com/todos";

    if (selectedUserId !== "all") {
      url += `?userId=${selectedUserId}`;
    }

    try {
      const todosResponse = await fetch(url);
      if (todosResponse.ok) {
        const todosData: Todo[] = await todosResponse.json();
        setTodos(todosData);
        const initialTitles = todosData.reduce((acc, todo) => {
          acc[todo.id] = todo.title;
          return acc;
        }, {} as { [key: number]: string });
        setEditTodoTitle(initialTitles);
        const initialCompleted = todosData.reduce((acc, todo) => {
          acc[todo.id] = todo.completed;
          return acc;
        }, {} as { [key: number]: boolean });
        setEditTodoCompleted(initialCompleted);
      } else {
        console.error("Failed to fetch todos");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (response.ok) {
        const data: User[] = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleCreateTodo = async () => {
    if (!newTodoTitle.trim()) {
      Alert.alert("Error", "Todo title cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 1,
            title: newTodoTitle,
            completed: false,
          }),
        }
      );

      if (response.ok) {
        const newTodo: Todo = await response.json();
        setTodos((prevTodos) => [newTodo, ...prevTodos]);
        setEditTodoTitle((prevTitles) => ({
          ...prevTitles,
          [newTodo.id]: newTodo.title,
        }));
        setEditTodoCompleted((prevCompleted) => ({
          ...prevCompleted,
          [newTodo.id]: newTodo.completed,
        }));
        setNewTodoTitle("");
        const uniqueId = lastUsedId + 1;
        newTodo.id = uniqueId;
        setLastUsedId(uniqueId);
        Alert.alert("Success", "Todo created successfully!");
      } else {
        console.error("Failed to create todo");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleUpdateTodo = async (todoId: number) => {
    const updatedTitle = editTodoTitle[todoId];

    if (!updatedTitle.trim()) {
      Alert.alert("Error", "Todo title cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: updatedTitle }),
        }
      );

      if (response.ok) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === todoId ? { ...todo, title: updatedTitle } : todo
          )
        );
        setEditTodoTitle((prevTitles) => ({
          ...prevTitles,
          [todoId]: updatedTitle,
        }));
        Alert.alert("Success", "Todo updated successfully!");
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleToggleTodo = async (todoId: number) => {
    const updatedCompleted = !editTodoCompleted[todoId];

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: updatedCompleted }),
        }
      );

      if (response.ok) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === todoId ? { ...todo, completed: updatedCompleted } : todo
          )
        );
        setEditTodoCompleted((prevCompleted) => ({
          ...prevCompleted,
          [todoId]: updatedCompleted,
        }));
        Alert.alert("Success", "Todo updated successfully!");
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
        Alert.alert("Success", "Todo deleted successfully!");
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <SafeAreaView style={generalStyles.safeAreaView}>
      <ScrollView>
        <View style={generalStyles.textContainer}>
          <TextInput
            value={newTodoTitle}
            onChangeText={setNewTodoTitle}
            placeholder="Enter new todo title"
            style={generalStyles.textInput}
          />
          <TouchableOpacity
            style={[generalStyles.button]}
            onPress={handleCreateTodo}
          >
            <Text style={generalStyles.buttonText}>Create Todo</Text>
          </TouchableOpacity>
        </View>
        <View style={generalStyles.textContainer}>
          <Text>Select User:</Text>
          <Picker
            selectedValue={selectedUserId}
            onValueChange={(itemValue) =>
              setSelectedUserId(itemValue as number | "all")
            }
          >
            <Picker.Item label="All Users" value="all" />
            {users.map((user) => (
              <Picker.Item key={user.id} label={user.name} value={user.id} />
            ))}
          </Picker>
        </View>
        {todos.map((todo) => (
          <View key={todo.id} style={generalStyles.textContainer}>
            <Text style={generalStyles.titleText}>{todo.title}</Text>
            <TouchableOpacity
              style={[
                generalStyles.button,
                generalStyles.updateButton,
                { backgroundColor: todo.completed ? "green" : "red" },
              ]}
              onPress={() => handleToggleTodo(todo.id)}
            >
              <Text style={generalStyles.buttonText}>
                {todo.completed ? "Completed" : "Not Completed"}
              </Text>
            </TouchableOpacity>
            <TextInput
              value={editTodoTitle[todo.id]}
              onChangeText={(text) =>
                setEditTodoTitle((prev) => ({ ...prev, [todo.id]: text }))
              }
              placeholder="Enter new title"
              style={generalStyles.textInput}
            />
            <TouchableOpacity
              style={[generalStyles.button, generalStyles.updateButton]}
              onPress={() => handleUpdateTodo(todo.id)}
            >
              <Text style={generalStyles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[generalStyles.button, generalStyles.deleteButton]}
              onPress={() => handleDeleteTodo(todo.id)}
            >
              <Text style={generalStyles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TodoPage;
