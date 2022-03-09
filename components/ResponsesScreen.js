import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, SafeAreaView, Alert, TextInput, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ContactList from './Contacts';
import { useFonts, PlayfairDisplay_800ExtraBold_Italic, } from '@expo-google-fonts/playfair-display';
import { Nunito_400Regular, Nunito_500Medium } from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
var regFont = 'Nunito_500Medium';
var gradient = ['#ff4a86', '#fe9a55', '#fec759'];
var locations = [0.2, 0.8, 1];
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SMS from 'expo-sms';
import ViewShot from "react-native-view-shot";





export default function Responses(props) {
    const ResponsesStack = createStackNavigator();
    const navigation = useNavigation();

    var contactsWithResponses = [];
    var j = 0;
    for (var i = 0; i < 4; i++) {
        contactsWithResponses.push(props.data[j]);
        j += Math.floor(props.data.length / 4);
    }

    function imageRender(contact) {
        if (contact.imageAvailable) {
            return <View style={styles.image}>
                <Image style={styles.image} source={contact.image} />
                {contact.online ? <View style={{ height: 9, width: 9, borderRadius: 12, backgroundColor: 'limegreen', position: 'absolute', right: 0, bottom: 0 }}></View> : <View></View>}
            </View>
        }
        else {
            return <View style={styles.image}>
                <Text style={styles.initials}>{contact.firstName ? contact.firstName[0] : ""}{contact.lastName ? contact.lastName[0] : ""}</Text>
                {contact.online ? <View style={{ height: 9, width: 9, borderRadius: 12, backgroundColor: 'limegreen', position: 'absolute', right: 0, bottom: 0 }}></View> : <View></View>}
            </View>;
        }
    }

    function ResponsesDefault() {
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView >
                    <View style={{ marginTop: 60 }}>
                        <ContactList
                            data={contactsWithResponses}
                            contactStyle={styles.contact}
                            nameStyle={{ fontFamily: regFont, fontSize: 16, marginLeft: 30, color: 'white' }}
                            onPressContact="ViewResponse"
                            showQuestionAnswered={true}
                            showResponse={true}
                        />
                    </View>
                </SafeAreaView>
            </LinearGradient>
        )
    }

    function ViewResponse({ route }) {
        var response = <Text style={[styles.questionText, { fontSize: 18, lineHeight: 30, marginTop: 80 }]}>{route.params.response.response}</Text>;
        var responseHeight = 240;
        if (route.params.response.responseType === 'image' || route.params.response.responseType === 'drawing') {
            response = <Image style={{ height: route.params.response.responseType === 'image' ? 200 : 260, width: '95%', borderRadius: 20, resizeMode: 'cover', marginTop: 60 }} source={route.params.response.response} />
            responseHeight = route.params.response.responseType === 'image' ? 280 : 340;
        }
        if (route.params.response.responseType === 'audio') {
            responseHeight = 150;
            response = <View style={{ flexDirection: 'row', marginTop: 60 }}>
                <Icon name='play' size={40}></Icon>

            </View>
        }




        var screenshot = React.useRef();
        var shareResponse = async () => {
            const isAvailable = await SMS.isAvailableAsync();
            if (isAvailable) {
                screenshot.current.capture().then((uri) => {
                    console.log(uri);
                    const { result } = SMS.sendSMSAsync(
                        [route.params.phone],
                        '',
                        {
                            attachments: {
                                uri: 'file://' + uri,
                                mimeType: 'image/png',
                                filename: uri.substring(uri.lastIndexOf('/') + 1),
                            }
                        }
                    );
                }),
                    (error) => Alert.alert(
                        "Reply with SMS failed",
                        "Please try again",
                        [{ text: "OK" }]
                    );
            } else {
                Alert.alert(
                    "Not available on IOS Simulator",
                    "Please view the demo using Expo Go on your iPhone to use the Reply with SMS feature.",
                    [{ text: "OK" }]
                );
            }
        }


        return (
            <ViewShot ref={screenshot} options={{ format: "jpg", quality: 0.9 }}>
                <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                    <SafeAreaView>

                        <BlurView intensity={75} tint="light" style={[styles.question, { marginTop: 80, height: 150, justifyContent: 'flex-start' }]}>
                            <View style={[styles.questionCardTopBar, { position: 'relative' }]}>
                                <Image style={styles.image} source={require('../assets/monalisa.jpeg')} />
                                <Text style={{ fontFamily: regFont, fontSize: 16 }}>  You asked:</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, width: '90%', alignSelf: 'center', }}>
                                <Text style={[styles.questionText, { fontSize: 18, lineHeight: 28 }]}>{route.params.response.answered}</Text>
                            </View>
                        </BlurView>
                        <BlurView intensity={75} tint="light" style={[styles.question, { justifyContent: 'flex-start', marginTop: 20, height: responseHeight }]}>
                            <View style={styles.questionCardTopBar}>
                                {imageRender(route.params)}
                                <Text style={{ fontFamily: regFont, fontSize: 16 }}>  {route.params.firstName} responded:</Text>
                            </View>
                            {response}
                        </BlurView>
                        <Pressable onPress={shareResponse}>
                            <BlurView intensity={75} tint="light" style={{ marginTop: 20, height: 50, width: 80, borderRadius: 20, borderWidth: 1, borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.35)', overflow: 'hidden', alignSelf: 'flex-end', marginRight: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name='share' size={30} />
                            </BlurView>
                        </Pressable>
                    </SafeAreaView>
                </LinearGradient>
            </ViewShot>
        )
    }

    return (
        <ResponsesStack.Navigator screenOptions={{
            headerBackTitle: " ",
            headerTitle: " ",
            headerTransparent: true,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: 'white',
            },
            cardStyle: {
                backgroundColor: 'white'
            },
            animationEnabled: false,
        }}>
            <ResponsesStack.Screen options={{ headerTitle: "Today's Responses", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 24 } }} name="ResponsesDefault" component={ResponsesDefault} />
            <ResponsesStack.Screen options={{}} name="ViewResponse" component={ViewResponse} />

        </ResponsesStack.Navigator>
    )
}

const styles = StyleSheet.create({
    contact: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
        marginRight: 30,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: 'white'
    },
    questionsTitle: {
        fontFamily: 'Helvetica Neue',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 50,
        marginTop: 30,
    },
    questionCard: {
        height: 400,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 20,
        marginTop: 50,
        justifyContent: 'center',
        backgroundColor: 'lightgray',
    },
    questionCardTopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        left: 10,
        alignSelf: 'stretch',
    },
    questionCardContactImage: {
        marginLeft: 10,
    },
    questionCardContact: {
        fontFamily: 'Helvetica Neue',
        fontSize: 14,
        marginLeft: 10,
    },
    questionText: {
        fontFamily: regFont,
        fontSize: 25,
        textAlign: 'center',
        width: '80%',
        alignSelf: 'center',
    },
    respondButton: {
        backgroundColor: 'lightgray',
        height: 75,
        width: 75,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'white'
    },
    question: {
        height: 400,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        marginTop: 60,
    },
    questionText: {
        fontFamily: regFont,
        fontSize: 25,
        lineHeight: 40,
        textAlign: 'center',
        width: '80%',
    },
    image: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white'
    },
    send: {
        height: 45,
        width: '70%',
        alignSelf: 'center',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderColor: 'white',
        borderWidth: 1,
        marginTop: 20,
    },
    sendText: {
        fontFamily: regFont,
        fontSize: 18,
        color: 'white',
    },
});