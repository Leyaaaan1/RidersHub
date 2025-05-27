
import {useState} from "react";
import {Alert, Button, Text, TextInput, View} from "react-native";
import global from "../styles/global";
import axios from "axios";


const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://192.168.1.51:8080/login', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                Alert.alert('Login Successful', 'Welcome back!');
            } else {
                Alert.alert('Login Failed', 'Invalid credentials.');
            }
        } catch (error) {
            Alert.alert("Login failed", "Please try again later.");
            console.error("Login error:", error);
        }
    };


    return (
        <View style={global.container}>
            <Text style={global.title}>Login</Text>

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};


export default RegisterScreen;


