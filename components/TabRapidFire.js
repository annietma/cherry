import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Alert, Pressable, SafeAreaView, TextInput, Keyboard, StatusBar } from 'react-native';
import { useNavigationState, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Progress from 'react-native-progress';
import { CategoriesComponent, QuestionComponent } from './TabHome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

import { imageRender, ContactList } from './Contacts';
import { regFont, blurIntensity, RegBackground, RegBlurView, BlurPressable, notImplemented, SendButtons } from './Styles';
import { askedCard } from './TabQuestions';
import { ScrollView } from 'react-native-gesture-handler';

export default function RapidFire(props) {
    const RFStack = createStackNavigator();
    const navigation = useNavigation();

    var contactsOnline = [];
    for (var i = 0; i < props.data.length; i++) {
        if (props.data[i].online === true) {
            contactsOnline.push(props.data[i])
        }
    }

    function RapidFireDefault() {
        return (
            <RegBackground shade={'dark'}>
                <BlurView intensity={blurIntensity} tint='dark'
                    style={styles.blurCard}>
                    <Text style={{ height: 30, marginTop: 20, alignSelf: 'center', fontFamily: regFont, fontSize: 18, color: 'white' }} >Contacts Online</Text>
                    <ContactList data={contactsOnline}
                        nameStyle={{ fontFamily: regFont, fontSize: 16, marginLeft: 30, color: 'white' }}
                        onPressContact="ConfirmRequest" />
                </BlurView>
            </RegBackground>
        )
    }

    function ConfirmRequest({ route }) {
        return (
            <RegBackground shade={'dark'}>
                <BlurView intensity={blurIntensity} tint='dark' style={styles.blurCard}>
                    <Text style={styles.blurCardText} >Send a Rapid Fire Session request to</Text>
                    {imageRender(route.params, 80)}
                    <Text style={[styles.blurCardText, { marginTop: 20 }]} >{route.params.firstName} {route.params.lastName}?</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
                        <Pressable onPress={() => navigation.navigate("RapidFireDefault")}>
                            <View style={[styles.send, { marginTop: 20, marginRight: 0, width: 100 }]}>
                                <Text style={styles.sendText}>No</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate("SendRequest", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online })}>
                            <View style={[styles.send, { marginTop: 20, marginRight: 0, width: 100 }]}>
                                <Text style={styles.sendText}>Yes</Text>
                            </View>
                        </Pressable>
                    </View>
                </BlurView>
            </RegBackground>
        )
    }

    function SendRequest({ route }) {

        var [progress, setProgress] = useState(0);
        var [canceled, setCanceled] = useState(false);
        var [accepted, setAccepted] = useState(false);
        var timeProgress = setTimeout(() => setProgress((prev) => prev + 0.01), 10);
        if (progress >= 1.2 && canceled === false) {
            if (!accepted) setAccepted(true);
            clearTimeout(timeProgress);
        }

        var onPress = () => navigation.navigate("RFCategories", route.params);
        if (accepted === false) {
            onPress = () => canceled === false ? setCanceled(true) : navigation.navigate("RapidFireDefault");
        }

        var buttonText = 'Start Session';
        if (accepted === false) {
            buttonText = canceled === false ? 'Cancel Request' : 'Back to Start';
        }

        return (
            <RegBackground shade={'dark'}>
                <BlurView intensity={blurIntensity} tint='dark'
                    style={styles.blurCard}>
                    <Text style={styles.blurCardText} >{(canceled === false && accepted === false) ? 'Sending a Rapid Fire Session' : 'Your'} request to</Text>
                    {imageRender(route.params, 80)}
                    <Text style={[styles.blurCardText, { marginTop: 20 }]} >{route.params.firstName} {route.params.lastName}{canceled === true && ' was cancelled'}{canceled === false && accepted === true && ' was accepted!'}</Text>
                    {canceled === false && <Progress.Bar progress={progress} style={{ marginTop: 20 }} height={6} width={200} color={'#D63B70'}></Progress.Bar>}
                    <Pressable style={{ alignSelf: 'center' }} onPress={onPress}>
                        <View style={[styles.send, { marginTop: 60, width: 200 }]}>
                            <Text style={styles.sendText}>{buttonText}</Text>
                        </View>
                    </Pressable>
                </BlurView>
            </RegBackground>
        )
    }

    function RFSession(props) {
        var [timeLeft, setTimeLeft] = useState(1);
        var timerSession = setTimeout(() => setTimeLeft((prev) => prev - 0.01), 1000);
        if (timeLeft <= 0) {
            clearTimeout(timerSession);
        }
        return (
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: '#430D1E' }}>
                <View style={{ width: '90%', alignSelf: 'center', justifyContent: 'space-evenly', height: '85%', }}>
                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={{ fontFamily: regFont, fontSize: 12, color: 'white', }}>Rapid Fire w/  </Text>
                            {imageRender(props, 20)}
                            <Text style={{ fontFamily: regFont, fontSize: 12, color: 'white', }}>  {props.firstName} {props.lastName}</Text>
                        </View>
                        <Pressable style={{}} onPress={() => {
                            Alert.alert(
                                "End Session",
                                "End Rapid Fire Session with " + props.firstName + " " + props.lastName + "?",
                                [{ text: "No" }, { text: "Yes", onPress: () => navigation.navigate("RFEnd", props) }]
                            );
                        }}>
                            <Text style={{ fontFamily: regFont, fontSize: 12, color: 'white', }}>End Session</Text>
                        </Pressable>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: regFont, fontSize: 16, color: 'white', }}>Time left in this part:   </Text>
                        <Progress.Pie progress={timeLeft} size={40} color={'white'}></Progress.Pie>
                    </View>
                </View>
            </View>
        )
    }

    function RFCategories({ route }) {
        return (
            <RegBackground shade={'dark'}>
                <View style={{ marginTop: 100 }}></View>
                <CategoriesComponent data={route.params} goToScreen={"RFQuestion"} />
                {RFSession(route.params)}
            </RegBackground>
        )
    }

    function RFQuestion({ route }) {
        return (
            <RegBackground shade={'dark'}>
                <View style={{ marginTop: 60 }}></View>
                <QuestionComponent data={route.params} goToScreen={"RFWait"} afterSentText={"Next"} />
                {RFSession(route.params)}
            </RegBackground>
        )
    }

    function RFWait({ route }) {
        var timeAlloted = 1000;
        var [timeLeft, setTimeLeft] = useState(1);
        var timerWait = setTimeout(() => setTimeLeft((prev) => prev - 0.01), timeAlloted);
        var viewResponse = <></>;
        if (timeLeft <= 0.3) {
            clearTimeout(timerWait);
            viewResponse = <Pressable onPress={() => navigation.navigate("RFViewResponse", route.params,)}>
                <View style={[styles.send, { marginTop: 30, marginRight: 0, width: 200 }]}>
                    <Text style={styles.sendText}>View Response</Text>
                </View>
            </Pressable>
        }

        return (
            <RegBackground shade={'dark'}>
                <BlurView intensity={blurIntensity} tint='dark' style={[styles.blurCard, { height: '80%' }]}>
                    <Text style={styles.blurCardText} >Waiting for</Text>
                    {imageRender(route.params, 80)}
                    <Text style={[styles.blurCardText, { marginTop: 20 }]} >{route.params.firstName} {route.params.lastName}'s {route.params.screen === "Question" ? "response" : "question"}</Text>
                    <Text style={[styles.blurCardText, { marginTop: 20 }]} >Time left:</Text>
                    <Progress.Pie progress={timeLeft} size={120} color={'white'}></Progress.Pie>
                    {viewResponse}
                </BlurView>
                {RFSession(route.params)}
            </RegBackground>
        )
    }

    function RFViewResponse({ route }) {
        var responseHeight = 150;
        var [progress, setProgress] = useState(0);
        var timerViewRF = useRef(null);
        var [paused, setPaused] = useState(false);
        var [playIcon, setPlayIcon] = useState(<Icon name='play' size={40}></Icon>)
        useEffect(() => {
            if (progress >= 1) {
                setPaused(true);
                setPlayIcon(<Icon name='play' size={40}></Icon>);
                clearTimeout(timerViewRF.current);
                setProgress(0);
            }
        }, [progress]);
        function listen() {
            function fillUp() {
                setProgress((prev) => prev + 0.01);
                timerViewRF.current = setTimeout(fillUp, 100);
            }
            if (paused) {
                setPaused(false);
                setPlayIcon(<Icon name='pause' size={40}></Icon>);
                fillUp();
            } else {
                setPaused(true);
                setPlayIcon(<Icon name='play' size={40}></Icon>);
                clearTimeout(timerViewRF.current);
            }
        }
        return (
            <RegBackground shade={'dark'}>
                {askedCard(route.params, false, true, route.params.questionText)}
                <RegBlurView style={{ marginTop: 20, justifyContent: 'flex-start', height: responseHeight }}>
                    <View style={styles.questionCardTopBar}>
                        {imageRender(route.params)}
                        <Text style={{ fontFamily: regFont, fontSize: 16 }}>  {route.params.firstName} responded:</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 60, alignItems: 'center' }}>
                        <Pressable onPress={listen}>
                            {playIcon}
                        </Pressable>
                        <Progress.Bar progress={progress} style={{ marginLeft: 15 }} height={6} width={200} color={'black'}></Progress.Bar>
                    </View>
                </RegBlurView>
                <Pressable style={{ alignSelf: 'center' }} onPress={() => navigation.navigate("RFViewQuestion", route.params)}>
                    <View style={[styles.send, { marginTop: 60, width: 200 }]}>
                        <Text style={styles.sendText}>Next</Text>
                    </View>
                </Pressable>
                {RFSession(route.params)}
            </RegBackground>
        )
    }

    function RFViewQuestion({ route }) {
        return (
            <RegBackground shade={'dark'}>
                {askedCard(route.params, true, false, "What's a picture that made you smile this week?")}
                <Text style={{ marginLeft: '5%', fontSize: 18, fontFamily: regFont, color: 'white', marginTop: 30, }}>Respond with:</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center', marginTop: 10, }}>
                    <BlurPressable text={'🏙'} textStyle={{ fontSize: 35 }} style={{ height: 75, width: 75 }}
                        onPress={() => navigation.navigate("RFPhotoRespond", route.params)} />
                </View>
                {RFSession(route.params)}
            </RegBackground>
        )
    }

    function RFPhotoRespond({ route }) {
        const [image, setImage] = useState(null);
        const takePicture = async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                alert("The app was denied camera access");
                return;
            }
            const result = await ImagePicker.launchCameraAsync();
            setImage(result.uri);
        };
        const pickImage = async () => {
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                setImage(result.uri);
            }
        };
        return (

            <RegBackground shade={'dark'}>
                <ScrollView style={{ height: '100%' }}>
                    {askedCard(route.params, false, false, "What's a picture that made you smile this week?")}
                    {image ? <>
                        <Image source={{ uri: image }} style={[styles.questionCard, { width: '90%', borderWidth: 1, borderColor: 'white', marginTop: 20 }]} />
                        <SendButtons screen={'PhotoRespond'} textInput={false} afterSentText={'Ask ' + route.params.firstName + ' a question'}
                            onPressAfterSent={() => navigation.navigate("RFCategories", route.params)} />
                    </>
                        : <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '90%', alignSelf: 'center' }}>
                            <BlurPressable style={{ width: 165, height: 80, marginTop: 20, flexDirection: 'row' }} onPress={takePicture}>
                                <Icon name='camera' size={30} />
                                <Text style={{ fontFamily: regFont, fontSize: 18 }}> Camera</Text>
                            </BlurPressable>
                            <BlurPressable style={{ width: 165, height: 80, marginTop: 20, flexDirection: 'row' }} onPress={pickImage}>
                                <Icon name='upload' size={30} />
                                <Text style={{ fontFamily: regFont, fontSize: 18 }}> Photo Album</Text>
                            </BlurPressable>
                        </View>}
                </ScrollView>
                {RFSession(route.params)}
            </RegBackground>

        )
    }

    function RFEnd({ route }) {
        return (
            <RegBackground shade={'dark'}>
                <BlurView intensity={blurIntensity} tint='dark' style={[styles.blurCard, { height: '80%' }]}>
                    <Text style={styles.blurCardText} >You finished a Rapid Fire Session with</Text>
                    {imageRender(route.params, 80)}
                    <Text style={[styles.blurCardText, { marginTop: 20 }]} >{route.params.firstName} {route.params.lastName}</Text>
                    <View style={{ marginTop: 0, borderTopWidth: 1, borderColor: 'white', width: '80%' }}></View>
                    <Text style={[styles.blurCardText, { marginTop: 20, fontSize: 20 }]} >Time Elapsed: 10:36</Text>
                    <Text style={[styles.blurCardText, { marginTop: 0, fontSize: 20 }]} >Questions Answered: 17</Text>
                    <Pressable style={{ alignSelf: 'center' }} onPress={() => navigation.navigate("RapidFireDefault")}>
                        <View style={[styles.send, { marginTop: 40, width: 220 }]}>
                            <Text style={styles.sendText}>Start another session</Text>
                        </View>
                    </Pressable>
                    <Pressable style={{ alignSelf: 'center' }} onPress={() => navigation.navigate("HomeDefault")}>
                        <View style={[styles.send, { marginTop: 20, width: 220 }]}>
                            <Text style={styles.sendText}>Go to Home</Text>
                        </View>
                    </Pressable>
                </BlurView>
            </RegBackground>
        )
    }

    return (
        <RFStack.Navigator screenOptions={{
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
            <RFStack.Screen options={{ headerTitle: "Start a Rapid Fire Session", headerTitleStyle: styles.headerTitleStyle }} name="RapidFireDefault" component={RapidFireDefault} />
            <RFStack.Screen options={{ headerShown: false, }} name="ConfirmRequest" component={ConfirmRequest} />
            <RFStack.Screen options={{ headerShown: false, }} name="SendRequest" component={SendRequest} />
            <RFStack.Screen options={{ headerLeft: null, headerTitle: "Choose Category", headerTitleStyle: styles.headerTitleStyle }} name="RFCategories" component={RFCategories} />
            <RFStack.Screen options={{ headerTitle: "Send Question", headerTitleStyle: styles.headerTitleStyle }} name="RFQuestion" component={RFQuestion} />
            <RFStack.Screen options={{ headerShown: false, }} name="RFWait" component={RFWait} />
            <RFStack.Screen options={{ headerShown: false, }} name="RFViewResponse" component={RFViewResponse} />
            <RFStack.Screen options={{ headerShown: false, }} name="RFViewQuestion" component={RFViewQuestion} />
            <RFStack.Screen options={{ headerShown: false, }} name="RFPhotoRespond" component={RFPhotoRespond} />
            <RFStack.Screen options={{ headerShown: false, }} name="RFEnd" component={RFEnd} />
        </RFStack.Navigator>
    )
}

const styles = StyleSheet.create({
    headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 24 },
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
    },
    sendText: {
        fontFamily: regFont,
        fontSize: 18,
        color: 'white',
    },
    blurCard: {
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: '90%',
        height: '88%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 25,
        marginTop: 70,
        alignSelf: 'center'
    },
    blurCardText: {
        textAlign: 'center',
        width: '70%',
        alignSelf: 'center',
        fontFamily: regFont,
        fontSize: 22,
        color: 'white',
        marginBottom: 20
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
    },
});