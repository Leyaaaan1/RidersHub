import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import utilities from "../styles/utilities";

const CreateRide = ({ route, navigation }) => {
    const { token, username } = route.params;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreateRide = async () => {
        if (!title || !location || !date) {
            Alert.alert("Error", "Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://192.168.1.51:8080/rides/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    location,
                    date: date.toISOString(),
                })
            });

            if (response.ok) {
                Alert.alert("Success", "Ride created successfully");
                navigation.goBack();
            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.message || "Failed to create ride");
            }
        } catch (error) {
            console.error("Error creating ride:", error);
            Alert.alert("Error", "Network error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={utilities.container}>
            <View style={{ padding: 20 }}>
                <Text style={utilities.title}>Create New Ride</Text>

                <Text style={utilities.label}>Title*</Text>
                <TextInput
                    style={utilities.textBox}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ride title"
                />

                <Text style={utilities.label}>Description</Text>
                <TextInput
                    style={[utilities.textBox, { height: 100 }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe your ride"
                    multiline
                />

                <Text style={utilities.label}>Location*</Text>
                <TextInput
                    style={utilities.textBox}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Meeting point"
                />

                <Text style={utilities.label}>Date and Time*</Text>



                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity
                        style={utilities.button}
                        onPress={handleCreateRide}
                        disabled={loading}
                    >
                        <Text style={utilities.buttonText}>
                            {loading ? "Creating..." : "Create Ride"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[utilities.button, { backgroundColor: '#888' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={utilities.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default CreateRide;