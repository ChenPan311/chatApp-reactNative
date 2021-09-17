import React, { useLayoutEffect, useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import { auth, db } from '../firebase'
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { removeDots } from '../Utils/Utils';

const ChatsScreen = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const { User } = route.params;
    const user1 = removeDots(auth?.currentUser?.email);
    const user2 = removeDots(User._id);
    let chatId = "";

    const chatRef = db.collection("Chats").where(user1, "==", true)
        .where(user2, "==", true);

    useLayoutEffect(() => {
        chatRef.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    chatId = doc.id;
                    db.collection("Chats").doc(chatId).collection('messages').orderBy('createdAt', 'desc')
                        .onSnapshot(snapshot => {
                            if (snapshot) {
                                setMessages(
                                    snapshot.docs.map(doc => ({
                                        _id: doc.data()._id,
                                        text: doc.data().text,
                                        createdAt: doc.data().createdAt.toDate(),
                                        user: doc.data().user
                                    }))
                                )
                            } else {
                                console.log("In Snapshot not Exist");
                            }
                        })
                });
            })
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            text,
            createdAt,
            user
        } = messages[0];
        if (chatId === "") {
            console.log("Not Exist")
            var ref = db.collection("Chats").doc().set({
                [user1]: true,
                [user2]: true,
            }).then(() => {
                chatId = ref.key;
            }).then(() => {
                db.collection(`Chats/${chatId}/messages`).add({
                    _id,
                    text,
                    createdAt,
                    user
                });
            });
        } else {
            db.collection("Chats").doc(chatId).collection('messages').add({
                _id,
                text,
                createdAt,
                user
            });
        }
    }, [])

    const goBack = () => {
        navigation.goBack();
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat With ' + User.name,
            headerLeft: () => (
                <View style={{
                    marginLeft: 20
                }}>
                    <Avatar rounded source={{ uri: User.avatar }} />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 20
                }} onPress={goBack}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
            )
        })
    }, [])

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
