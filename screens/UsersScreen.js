import React, { useLayoutEffect, useEffect, useState, useCallback } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { Avatar, ListItem, useTheme } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../firebase'

const Item = ({ item, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <ListItem>
                <Avatar rounded
                    source={{ uri: item.avatar }}
                />
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </TouchableOpacity>
    );
};

const UsersScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);

    const renderItem = ({ item }) => {
        return (
            <Item
                item={item}
                onPress={() => onClickUser(item)}
            />
        );
    };


    const onClickUser = (user) => {
        navigation.navigate('Chat', { User: user })
    }

    const signOut = () => {
        auth.signOut().then(() => {
            // Sign-out successful.
            navigation.replace("Login");
        }).catch((error) => {
            // An error happened.
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{
                    marginLeft: 20
                }}>
                    <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 20
                }} onPress={signOut}>
                    <AntDesign name="logout" size={24} color="black" />
                </TouchableOpacity>
            )
        })
    }, []);

    useLayoutEffect(() => {
        const unsubscribe = db.collection('Users')
            .onSnapshot(snapshot => setUsers(
                snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    name: doc.data().name,
                    avatar: doc.data().avatar,
                }))
            ))
        return unsubscribe;
    }, [])

    return (
        <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id}
        />
    )
};

export default UsersScreen
