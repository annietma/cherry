import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, SafeAreaView, Alert, TextInput, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SMS from 'expo-sms';
import ViewShot from "react-native-view-shot";
import * as Progress from 'react-native-progress';

import { imageRender, ContactList } from './Contacts';
import { regFont, blurIntensity, RegBackground, RegBlurView, BlurPressable, notImplemented, SendButtons } from './Styles';
import { askedCard } from './TabQuestions';

export default function Responses(props) {
    const ResponsesStack = createStackNavigator();
    const navigation = useNavigation();

    var contactsWithResponses = [];
    var j = 0;
    for (var i = 0; i < 4; i++) {
        contactsWithResponses.push(props.data[j]);
        j += Math.floor(props.data.length / 4);
    }

    function ResponsesDefault() {
        return (
            <RegBackground>
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
            </RegBackground>
        )
    }

    function ViewResponse({ route }) {
        var response = <Text style={{ fontFamily: regFont, textAlign: 'center', width: '80%', fontSize: 18, lineHeight: 30, marginTop: 80 }}>{route.params.response.response}</Text>;
        var responseHeight = 240;
        if (route.params.response.responseType === 'image' || route.params.response.responseType === 'drawing') {
            response = <Image style={{ height: route.params.response.responseType === 'image' ? 200 : 260, width: '95%', borderRadius: 20, resizeMode: 'cover', marginTop: 60 }} source={route.params.response.response} />
            responseHeight = route.params.response.responseType === 'image' ? 280 : 340;
        }
        if (route.params.response.responseType === 'audio') {
            responseHeight = 150;
            var [progress, setProgress] = useState(0);
            var timerView = useRef(null);
            var [paused, setPaused] = useState(false);
            var [playIcon, setPlayIcon] = useState(<Icon name='play' size={40}></Icon>)
            useEffect(() => {
                if (progress >= 1) {
                    setPaused(true);
                    setPlayIcon(<Icon name='play' size={40}></Icon>);
                    clearTimeout(timerView.current);
                    setProgress(0);
                }
            }, [progress]);
            function listen() {
                function fillUp() {
                    setProgress((prev) => prev + 0.01);
                    timerView.current = setTimeout(fillUp, 100);
                }
                if (paused) {
                    setPaused(false);
                    setPlayIcon(<Icon name='pause' size={40}></Icon>);
                    fillUp();
                } else {
                    setPaused(true);
                    setPlayIcon(<Icon name='play' size={40}></Icon>);
                    clearTimeout(timerView.current);
                }
            }
            response = <View style={{ flexDirection: 'row', marginTop: 60, alignItems: 'center' }}>
                <Pressable onPress={listen}>
                    {playIcon}
                </Pressable>
                <Progress.Bar progress={progress} style={{ marginLeft: 15 }} height={6} width={200} color={'black'}></Progress.Bar>
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
                    "Not available on iOS Simulator",
                    "Please view the demo using Expo Go on your iPhone to use the Reply with SMS feature.",
                    [{ text: "OK" }]
                );
            }
        }

        return (
            <ViewShot ref={screenshot} options={{ format: "jpg", quality: 0.9 }}>
                <RegBackground>
                    {askedCard(route.params, false, true, route.params.response.answered)}
                    <RegBlurView style={{ justifyContent: 'flex-start', marginTop: 20, height: responseHeight }}>
                        <View style={styles.questionCardTopBar}>
                            {imageRender(route.params)}
                            <Text style={{ fontFamily: regFont, fontSize: 16 }}>  {route.params.firstName} responded:</Text>
                        </View>
                        {response}
                    </RegBlurView>
                    <BlurPressable onPress={shareResponse} style={{ marginTop: 20, height: 50, width: 80, alignSelf: 'flex-end', marginRight: 20 }}>
                        <Icon name='share' size={30} />
                    </BlurPressable>
                </RegBackground>
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
    questionCardTopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        left: 10,
    },
});