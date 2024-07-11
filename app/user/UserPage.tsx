import React, { useState, useEffect } from "react";
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

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    name: "",
    username: "",
    email: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: "",
      },
    },
    phone: "",
    website: "",
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const validateUser = (user: User) => {
    const requiredFields = [
      "name",
      "username",
      "email",
      "address.street",
      "address.suite",
      "address.city",
      "address.zipcode",
      "phone",
      "website",
      "company.name",
      "company.catchPhrase",
      "company.bs",
    ];

    for (const field of requiredFields) {
      const fieldParts = field.split(".");
      let value = user as any;

      for (const part of fieldParts) {
        value = value[part];
      }

      if (!value) {
        return false;
      }
    }

    return true;
  };

  const handleCreateUser = async () => {
    if (!validateUser(newUser)) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        const createdUser: User = await response.json();
        setUsers((prevUsers) => [...prevUsers, createdUser]);
        setNewUser({
          id: 0,
          name: "",
          username: "",
          email: "",
          address: {
            street: "",
            suite: "",
            city: "",
            zipcode: "",
            geo: {
              lat: "",
              lng: "",
            },
          },
          phone: "",
          website: "",
          company: {
            name: "",
            catchPhrase: "",
            bs: "",
          },
        });
        Alert.alert("Success", "User created successfully!");
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    if (!validateUser(selectedUser)) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${selectedUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedUser),
        }
      );

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? selectedUser : user
          )
        );
        Alert.alert("Success", "User updated successfully!");
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setSelectedUser(null);
        Alert.alert("Success", "User deleted successfully!");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleInputChange = (
    field: keyof User | keyof Address | keyof Company,
    value: string
  ) => {
    if (!selectedUser) return;

    setSelectedUser({
      ...selectedUser,
      [field]: value,
    });
  };

  const handleAddressInputChange = (field: keyof Address, value: string) => {
    if (!selectedUser) return;

    setSelectedUser({
      ...selectedUser,
      address: {
        ...selectedUser.address,
        [field]: value,
      },
    });
  };

  const handleCompanyInputChange = (field: keyof Company, value: string) => {
    if (!selectedUser) return;

    setSelectedUser({
      ...selectedUser,
      company: {
        ...selectedUser.company,
        [field]: value,
      },
    });
  };

  return (
    <SafeAreaView style={generalStyles.safeAreaView}>
      <ScrollView>
        <View style={generalStyles.textContainer}>
          <Text>Create New User:</Text>
          <TextInput
            value={newUser.name}
            onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, name: text }))
            }
            placeholder="Enter Name"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.username}
            onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, username: text }))
            }
            placeholder="Enter Username"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.email}
            onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, email: text }))
            }
            placeholder="Enter Email"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.address.street}
            onChangeText={(text) =>
              setNewUser((prev) => ({
                ...prev,
                address: { ...prev.address, street: text },
              }))
            }
            placeholder="Enter Street"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.address.suite}
            onChangeText={(text) =>
              setNewUser((prev) => ({
                ...prev,
                address: { ...prev.address, suite: text },
              }))
            }
            placeholder="Enter Suite"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.address.city}
            onChangeText={(text) =>
              setNewUser((prev) => ({
                ...prev,
                address: { ...prev.address, city: text },
              }))
            }
            placeholder="Enter City"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.address.zipcode}
            onChangeText={(text) =>
              setNewUser((prev) => ({
                ...prev,
                address: { ...prev.address, zipcode: text },
              }))
            }
            placeholder="Enter Zipcode"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.phone}
            onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, phone: text }))
            }
            placeholder="Enter Phone"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.website}
            onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, website: text }))
            }
            placeholder="Enter Website"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.company.name}
            onChangeText={(text) =>
              setNewUser((prev) => ({
                ...prev,
                company: { ...prev.company, name: text },
              }))
            }
            placeholder="Enter Company Name"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.company.catchPhrase}
            onChangeText={(text) =>
              setNewUser((prev) => ({
                ...prev,
                company: { ...prev.company, catchPhrase: text },
              }))
            }
            placeholder="Enter Company Catch Phrase"
            style={generalStyles.textInput}
          />
          <TextInput
            value={newUser.company.bs}
            onChangeText={(text) =>
              setNewUser((prev) => ({
                ...prev,
                company: { ...prev.company, bs: text },
              }))
            }
            placeholder="Enter Company BS"
            style={generalStyles.textInput}
          />
          <TouchableOpacity
            style={[generalStyles.button]}
            onPress={handleCreateUser}
          >
            <Text style={generalStyles.buttonText}>Create User</Text>
          </TouchableOpacity>
        </View>

        {/* List of Users Section */}
        <View style={generalStyles.textContainer}>
          <Text>List of Users:</Text>
          {users.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={generalStyles.button}
              onPress={() => handleSelectUser(user)}
            >
              <Text style={generalStyles.buttonText}>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedUser && (
          <View style={generalStyles.textContainer}>
            <Text>Edit User Details:</Text>
            <TextInput
              value={selectedUser.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Enter Name"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.username}
              onChangeText={(text) => handleInputChange("username", text)}
              placeholder="Enter Username"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter Email"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.address.street}
              onChangeText={(text) => handleAddressInputChange("street", text)}
              placeholder="Enter Street"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.address.suite}
              onChangeText={(text) => handleAddressInputChange("suite", text)}
              placeholder="Enter Suite"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.address.city}
              onChangeText={(text) => handleAddressInputChange("city", text)}
              placeholder="Enter City"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.address.zipcode}
              onChangeText={(text) => handleAddressInputChange("zipcode", text)}
              placeholder="Enter Zipcode"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="Enter Phone"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.website}
              onChangeText={(text) => handleInputChange("website", text)}
              placeholder="Enter Website"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.company.name}
              onChangeText={(text) => handleCompanyInputChange("name", text)}
              placeholder="Enter Company Name"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.company.catchPhrase}
              onChangeText={(text) =>
                handleCompanyInputChange("catchPhrase", text)
              }
              placeholder="Enter Company Catch Phrase"
              style={generalStyles.textInput}
            />
            <TextInput
              value={selectedUser.company.bs}
              onChangeText={(text) => handleCompanyInputChange("bs", text)}
              placeholder="Enter Company BS"
              style={generalStyles.textInput}
            />
            <TouchableOpacity
              style={[generalStyles.button]}
              onPress={handleUpdateUser}
            >
              <Text style={generalStyles.buttonText}>Update User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[generalStyles.button, generalStyles.deleteButton]}
              onPress={() => handleDeleteUser(selectedUser.id)}
            >
              <Text style={generalStyles.buttonText}>Delete User</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserPage;
