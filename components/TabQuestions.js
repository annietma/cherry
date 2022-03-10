import React, { useEffect, useState, useRef } from 'react';
import { Animated, Circle, StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Pressable, SafeAreaView, TextInput, Keyboard, TouchableWithoutFeedback, Button, StatusBar, ListViewComponent } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Progress from 'react-native-progress';
import { imageRender, ContactList } from './Contacts';
import { regFont, blurIntensity, RegBackground, RegBlurView, BlurPressable, notImplemented, SendButtons } from './Styles';

export function askedCard(props, big = false, you = false, question) {
    return (
        <RegBlurView style={{ marginTop: 80, height: big ? 350 : 150, justifyContent: 'flex-start' }}>
            <View style={styles.questionCardTopBar}>
                {imageRender(props, 30, you)}
                <Text style={{ fontFamily: regFont, fontSize: 16 }}>  {you ? "You" : props.firstName} asked:</Text>
            </View>
            <View style={{ justifyContent: 'center', height: '100%', width: '100%', alignSelf: 'center', }}>
                <Text style={{ fontSize: big ? 25 : 18, lineHeight: big ? 40 : 28, marginTop: 15, fontFamily: regFont, textAlign: 'center', width: '75%', alignSelf: 'center' }}>{question ? question : props.question}</Text>
            </View>
        </RegBlurView>
    )
}

export default function Questions(props) {
    const QuestionsStack = createStackNavigator();
    const navigation = useNavigation();

    var contactsWithQuestions = [];
    var j = 0;
    for (var i = 0; i < 6; i++) {
        contactsWithQuestions.push(props.data[j]);
        j += Math.floor(props.data.length / 6);
    }

    function QuestionsDefault() {
        return (
            <RegBackground>
                <View style={{ marginTop: 60 }}>
                    <ContactList
                        data={contactsWithQuestions}
                        contactStyle={styles.contact}
                        nameStyle={{ fontFamily: regFont, fontSize: 16, marginLeft: 30, color: 'white' }}
                        onPressContact="ViewQuestion"
                        showQuestion={true}
                    />
                </View>
            </RegBackground>
        )
    }

    function ViewQuestion({ route }) {
        return (
            <RegBackground>
                {askedCard(route.params, true)}
                <Text style={{ marginLeft: '5%', fontSize: 18, fontFamily: regFont, color: 'white', marginTop: 30, }}>Respond with:</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center', marginTop: 10, }}>
                    <BlurPressable text={'✏'} textStyle={{ fontSize: 35 }} style={{ height: 75, width: 75 }}
                        onPress={() => navigation.navigate("TextRespond", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online, question: route.params.question })} />
                    <BlurPressable text={'🎨'} textStyle={{ fontSize: 35 }} style={{ height: 75, width: 75 }}
                        onPress={() => navigation.navigate("DrawingRespond", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online, question: route.params.question })} />
                    <BlurPressable text={'🏙'} textStyle={{ fontSize: 35 }} style={{ height: 75, width: 75 }}
                        onPress={() => navigation.navigate("PhotoRespond", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online, question: route.params.question })} />
                    <BlurPressable text={'🎙'} textStyle={{ fontSize: 35 }} style={{ height: 75, width: 75 }}
                        onPress={() => navigation.navigate("AudioRespond", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online, question: route.params.question })} />
                </View>
            </RegBackground>
        )
    }

    function TextRespond({ route }) {
        const [text, onChangeText] = React.useState("");
        var textLength = text.length;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <RegBackground>
                    {askedCard(route.params)}
                    <RegBlurView style={{ height: 300, marginTop: 20 }}>
                        <View style={styles.questionCardTopBar}>
                            {imageRender(route.params, 30, true)}
                            <Text style={{ fontFamily: regFont, fontSize: 16 }}>  Your response:</Text>
                        </View>
                        <View style={{ width: '85%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', height: '70%', marginTop: 40, }}>
                            <TextInput
                                value={text}
                                onChangeText={onChangeText}
                                placeholder="Type here"
                                style={{ fontSize: 18, fontFamily: regFont, width: '100%', height: '100%' }}
                                maxLength={300}
                                multiline={true} />
                        </View>
                        <Text style={{ alignSelf: 'flex-end', marginTop: 8, right: 15, fontFamily: regFont, fontSize: 14 }}>{textLength}/300</Text>
                    </RegBlurView>
                    <SendButtons screen={'TextRespond'} textInput={true} textLength={textLength}
                        afterSentText={'Back to Questions'}
                        onPressAfterSent={() => navigation.navigate("QuestionsDefault", { data: props.data })} />
                </RegBackground>
            </TouchableWithoutFeedback>
        )
    }

    function DrawingRespond({ route }) {
        return (
            <RegBackground>
                {askedCard(route.params)}
                <View style={[styles.questionCard, { height: 350, marginTop: 20, }]}>
                </View>
            </RegBackground>
        )
    }

    function PhotoRespond({ route }) {
        const takePicture = async () => {
            notImplemented();
        };

        const [image, setImage] = useState(null);
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
            <RegBackground>
                <ScrollView>
                    {askedCard(route.params)}
                    {image ? <>
                        <Image source={{ uri: image }} style={[styles.questionCard, { width: '90%', borderWidth: 1, borderColor: 'white', marginTop: 20 }]} />
                        <SendButtons screen={'PhotoRespond'} textInput={false} afterSentText={'Back to Questions'}
                            onPressAfterSent={() => navigation.navigate("QuestionsDefault", { data: props.data })} />
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
            </RegBackground>
        )
    }

    function AudioRespond({ route }) {
        const animation = new Animated.Value(0);
        const inputRange = [0, 1];
        const outputRange = [1, 0.8];
        const scale = animation.interpolate({ inputRange, outputRange });
        var timerRecord = useRef(null);
        var [fill, setFill] = useState(0);
        var [paused, setPaused] = useState(false);
        var [memoDone, setMemoDone] = useState(false);
        var [recordIcon, setRecordIcon] = useState(<Icon name='microphone' size={40} />)

        useEffect(() => {
            if (fill >= 100) {
                setMemoDone(true);
                setRecordIcon(<Icon name='microphone' size={40} />);
                clearTimeout(timerRecord.current);
            }
        }, [fill]);
        function onPressInMic() {
            function fillUp() {
                setFill((prevValue) => prevValue + 1);
                timerRecord.current = setTimeout(fillUp, 100);
            }
            setPaused(false);
            setPausedListen(true);
            setProgress(0);
            clearTimeout(timerListen.current);
            setPlayIcon(<Icon name='play' color={'white'} size={40}></Icon>);
            setRecordIcon(<Icon name='microphone-outline' color='#ff4a86' size={40} />);
            fillUp();
            Animated.spring(animation, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        };
        const onPressOutMic = () => {
            Animated.spring(animation, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
            clearTimeout(timerRecord.current);
            setPaused(true);
            setRecordIcon(<Icon name='microphone' size={40} />);
        };

        var [progress, setProgress] = useState(0);
        var timerListen = useRef(null);
        var [pausedListen, setPausedListen] = useState(false);
        var [playIcon, setPlayIcon] = useState(<Icon name='play' color={'white'} size={40}></Icon>)
        useEffect(() => {
            if (progress >= 1) {
                setPausedListen(true);
                setPlayIcon(<Icon name='play' color={'white'} size={40}></Icon>);
                clearTimeout(timerListen.current);
                setProgress(0);
            }
        }, [progress]);
        function listen() {
            function fillUp() {
                setProgress((prev) => prev + 0.01);
                timerListen.current = setTimeout(fillUp, fill / 100);
            }
            if (pausedListen) {
                setPausedListen(false);
                setPlayIcon(<Icon name='pause' color={'white'} size={40}></Icon>);
                fillUp();
            } else {
                setPausedListen(true);
                setPlayIcon(<Icon name='play' color={'white'} size={40}></Icon>);
                clearTimeout(timerListen.current);
            }
        }
        return (
            <RegBackground>
                {askedCard(route.params)}
                <View style={{ marginTop: 60, justifyContent: 'center', alignItems: 'center', }}>
                    {fill > 0 && <AnimatedCircularProgress
                        style={{ position: 'absolute' }}
                        lineCap="round"
                        size={120}
                        width={5}
                        fill={fill}
                        tintColor='white'
                        backgroundColor='rgba(255, 255, 255, 0.35)'
                        borderRadius={10} />}
                    <Pressable onPressIn={onPressInMic} onPressOut={onPressOutMic}>
                        <Animated.View style={[{ transform: [{ scale }] }]}>
                            <BlurView intensity={75} tint="light" style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)', height: 90, width: 90, borderRadius: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                {recordIcon}
                            </BlurView>
                        </Animated.View>
                    </Pressable>
                </View>
                {paused === true && memoDone === false && <Text style={{ marginTop: 30, alignSelf: 'center', fontFamily: regFont, color: 'white' }}>Press mic to keep recording</Text>}
                {memoDone === true && <Text style={{ marginTop: 30, alignSelf: 'center', fontFamily: regFont, color: 'white' }}>Time limit met</Text>}
                {paused === true && <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', alignSelf: 'center' }}>
                    <Pressable onPress={listen}>
                        {playIcon}
                    </Pressable>
                    <Progress.Bar progress={progress} style={{ marginLeft: 15 }} height={6} width={200} color={'white'}></Progress.Bar>
                </View>}
                {(paused === true || memoDone === true) && <>
                    <Pressable style={styles.send} onPress={() => { setFill(0); setProgress(0); setPausedListen(true); setPaused(false); setMemoDone(false) }}>
                        <Text style={{ fontFamily: regFont, fontSize: 18, color: 'white', }}>Re-record</Text>
                    </Pressable><SendButtons screen={'AudioRespond'} textInput={false} afterSentText={'Back to Questions'}
                        onPressAfterSent={() => navigation.navigate("QuestionsDefault", { data: props.data })} />
                </>}
            </RegBackground>
        )
    }

    return (
        <QuestionsStack.Navigator screenOptions={{
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
            <QuestionsStack.Screen options={{ headerTitle: "Today's Questions", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 24 } }} name="QuestionsDefault" component={QuestionsDefault} />
            <QuestionsStack.Screen options={{}} name="ViewQuestion" component={ViewQuestion} />
            <QuestionsStack.Screen options={{}} name="TextRespond" component={TextRespond} />
            <QuestionsStack.Screen options={{}} name="DrawingRespond" component={DrawingRespond} />
            <QuestionsStack.Screen options={{}} name="PhotoRespond" component={PhotoRespond} />
            <QuestionsStack.Screen options={{}} name="AudioRespond" component={AudioRespond} />
        </QuestionsStack.Navigator>
    );
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
});