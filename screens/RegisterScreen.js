import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { auth } from '../firebase';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [imageURL, setimageURL] = useState("");
    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                user.updateProfile({
                    displayName: name,
                    photoURL: imageURL ? imageURL : "https://www.minervastrategies.com/wp-content/uploads/2016/03/default-avatar.jpg"
                }).then(() => {
                    //update successful
                    alert('Register Successful');
                }).catch(() => {
                    // error
                });
                // ...
            })
            .catch((error) => {
                var errorMessage = error.message;
                alert(errorMessage);
            });
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder="Enter Name"
                label="Name"
                leftIcon={{ type: 'material', name: 'badge' }}
                value={name}
                onChangeText={text => setName(text)} />

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

            <Input
                placeholder="Enter Image URL"
                label="Image Url"
                leftIcon={{ type: 'material', name: 'face' }}
                value={imageURL}
                onChangeText={text => setimageURL(text)} />

            <Button title="Register" buttonStyle={styles.button} onPress={register} />

        </View>
    )
}

export default RegisterScreen
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
    }
});
