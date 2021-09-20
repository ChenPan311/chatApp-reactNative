import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { auth, db } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const signIn = () => {
        setLoading(true);
        auth.signInWithEmailAndPassword(email, password)
            .then(() => setLoading(false))
            .catch((error) => {
                var errorMessage = error.message;
                setLoading(false);
                alert(errorMessage);
            });
    }

    const updateOnline = (user) => {
        db.collection("Users").doc(user.email).update({ online: true })
            .catch((error) => console.error("Error updating document: ", error));
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                updateOnline(user);
                navigation.replace('Users');
            }
        });
        return () => unsubscribe;
    }, [])
    return (
        <ImageBackground source={require('../assets/background.png')} style={{ flex: 1 }} resizeMode="cover">
            <View style={styles.container}>
                <Input
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

                <ActivityIndicator
                    size="large"
                    color="#2a9d8f"
                    animating={loading}
                />

                <Button title="Sign In" buttonStyle={styles.button}
                    onPress={signIn} />

                <Button title="Register" buttonStyle={styles.button}
                    onPress={() => navigation.navigate('Register')} />

            </View>
        </ImageBackground>
    )
}

export default LoginScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 15
    },
    button: {
        width: 200,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: '#2a9d8f',
    },
});
