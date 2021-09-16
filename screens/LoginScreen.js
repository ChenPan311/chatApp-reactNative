import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                var errorMessage = error.message;
                alert(errorMessage);
            });
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigation.replace('Chat');
            } else {
            }
        });
        return unsubscribe;
    }, [])
    return (
        <View style={styles.container}>
            <Input
                style={styles.input}
                placeholder="Enter Email"
                label="Email"
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={text => setEmail(text)} />

            <Input
                placeholder="Enter Password"
                label="Password"
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry />

            <Button title="Sign In" buttonStyle={styles.button}
                onPress={signIn} />

            <Button title="Register" buttonStyle={styles.button}
                onPress={() => navigation.navigate('Register')} />

        </View>
    )
}

export default LoginScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
    },
    button: {
        width: 200,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: '#2a9d8f'
    },
});
