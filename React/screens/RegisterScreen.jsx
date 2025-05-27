



import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import global from "../styles/global";
import colors from "../styles/colors";

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [riderType, setRiderType] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://192.168.1.51:8080/riders/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, riderType }),
            });
            const result = await response.json();
            Alert.alert(result.message || (response.ok ? 'Registration successful' : 'Registration failed'));
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"


            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                placeholder="Rider Type"
                value={riderType}
                onChangeText={setRiderType}
            />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

export default RegisterScreen;



