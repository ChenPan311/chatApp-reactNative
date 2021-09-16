import React, { useLayoutEffect, useEffect, useState, useCallback } from 'react'
import { View, Text, Touchable } from 'react-native'
import { auth, db } from '../firebase'
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';

const ChatsScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                    user: doc.data().user
                }))
            ))
        return unsubscribe;
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            text,
            createdAt,
            user
        } = messages[0];
        db.collection('chats').add({
            _id,
            text,
            createdAt,
            user
        });
    }, [])

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
    }, [])
    const signOut = () => {
        auth.signOut().then(() => {
            // Sign-out successful.
            navigation.replace("Login");
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name: auth?.currentUser?.displayName,
                avatar: auth?.currentUser?.photoURL
            }}
            renderBubble={props => {
                return (
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            left: {
                                backgroundColor: '#83c5be',
                            },
                            right: {
                                backgroundColor: '#2a9d8f',
                            }
                        }}
                    />
                );
            }}
            renderSend={props => {
                return (
                    <Send {...props} textStyle={{ color: '#2a9d8f' }} label={'Send'} />
                )
            }}
        />
    )
}

export default ChatsScreen
