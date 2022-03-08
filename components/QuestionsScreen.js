import React, { useEffect, useState, useRef } from 'react';
import { TabRouter, CancelButton } from 'react-navigation';
import { Animated, Circle, StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Pressable, SafeAreaView, TextInput, Keyboard, TouchableWithoutFeedback, Button, StatusBar } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Contacts from 'expo-contacts';
import ContactList from './Contacts';
import Sketch from 'react-native-sketch';
import { useFonts, PlayfairDisplay_800ExtraBold_Italic, } from '@expo-google-fonts/playfair-display';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600Semibold } from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

var regFont = 'Nunito_500Medium';
var gradient = ['#ff4a86', '#fe9a55', '#fec759'];
var locations = [0.2, 0.8, 1];



export default function Questions(props) {
    const QuestionsStack = createStackNavigator();
    const navigation = useNavigation();

    var contactsWithQuestions = [];
    var j = 0;
    for (var i = 0; i < 6; i++) {
        contactsWithQuestions.push(props.data[j]);
        j += Math.floor(props.data.length / 6);
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

    function QuestionsDefault() {
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView >
                    <View style={{ marginTop: 60 }}>
                        <ContactList
                            data={contactsWithQuestions}
                            contactStyle={styles.contact}
                            nameStyle={{ fontFamily: regFont, fontSize: 16, marginLeft: 30, color: 'white' }}
                            onPressContact="ViewQuestion"
                            showQuestion={true}
                        />
                    </View>
                </SafeAreaView>
            </LinearGradient>
        )
    }

    function ViewQuestion({ route }) {
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView>
                    <BlurView intensity={75} tint="light" style={[styles.question, { marginTop: 80, flexShrink: 1 }]}>
                        <View style={styles.questionCardTopBar}>
                            {imageRender(route.params)}
                            <Text style={{ fontFamily: regFont, fontSize: 16 }}>  {route.params.firstName} asked:</Text>
                        </View>
                        <Text style={styles.questionText}>{route.params.question}</Text>
                    </BlurView>
                    <Text style={{ marginLeft: '5%', fontSize: 18, fontFamily: regFont, color: 'white', marginTop: 30, }}>Respond with:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center', marginTop: 10, }}>
                        <Pressable onPress={() => navigation.navigate("TextRespond", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online, question: route.params.question })}>
                            {({ pressed }) => (
                                <BlurView intensity={75} tint="light" style={[styles.respondButton, { backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                                    <Text style={{ fontSize: 35 }}>✏</Text>
                                </BlurView>
                            )}
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate("DrawingRespond", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online, question: route.params.question })}>
                            {({ pressed }) => (
                                <BlurView intensity={75} tint="light" style={[styles.respondButton, { backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                                    <Text style={{ fontSize: 35 }}>🎨</Text>
                                </BlurView>
                            )}
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate("PhotoRespond", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online, question: route.params.question })}>
                            {({ pressed }) => (
                                <BlurView intensity={75} tint="light" style={[styles.respondButton, { backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                                    <Text style={{ fontSize: 35 }}>🏙</Text>
                                </BlurView>
                            )}
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate("AudioRespond", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online, question: route.params.question })}>
                            {({ pressed }) => (
                                <BlurView intensity={75} tint="light" style={[styles.respondButton, { backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                                    <Text style={{ fontSize: 35 }}>🎙</Text>
                                </BlurView>
                            )}
                        </Pressable>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        )
    }

    function TextRespond({ route }) {
        const [text, onChangeText] = React.useState("");
        var textLength = text.length;
        var [sendButton, setSendButton] = useState("Send →");
        var [border, setBorder] = useState(true);
        var [lowerButtons, setLowerButtons] = useState(<View></View>);

        function renderSendButton(buttonText, border) {
            if (buttonText === "Sent!") {
                return (
                    <View style={[styles.send, { borderWidth: border ? 1 : 0 }]}>
                        <Text style={styles.sendText}>{buttonText}</Text>
                    </View>
                )
            }
            return (
                <Pressable onPress={text.length > 0 ? () => { setSendButton("Send?"); setLowerButtons(renderConfirm); setBorder(false) } : () => { }}>
                    <View style={[styles.send, { borderWidth: border ? 1 : 0, borderColor: text.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.5)' }]}>
                        <Text style={[styles.sendText, { color: text.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.5)' }]}>{buttonText}</Text>
                    </View>
                </Pressable>
            )
        }
        var renderConfirm = <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
            <Pressable onPress={() => { setSendButton("Send →"); setLowerButtons(<View></View>); setBorder(true) }}>
                <View style={[styles.send, { marginTop: 20, marginRight: 0, width: 120 }]}>
                    <Text style={styles.sendText}>NO</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => { setSendButton("Sent!"); setLowerButtons(renderSent) }}>
                <View style={[styles.send, { marginTop: 20, marginRight: 0, width: 120 }]}>
                    <Text style={styles.sendText}>YES</Text>
                </View>
            </Pressable>
        </View>;
        var renderSent = <><Pressable onPress={() => navigation.navigate("QuestionsDefault", { data: props.data })}>
            <View style={[styles.send, { marginTop: 20 }]}>
                <Text style={styles.sendText}>Back to Questions</Text>
            </View>
        </Pressable></>;

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                    <SafeAreaView>
                        <BlurView intensity={75} tint="light" style={[styles.question, { marginTop: 80, height: 150, justifyContent: 'flex-start' }]}>
                            <View style={[styles.questionCardTopBar, { position: 'relative' }]}>
                                {imageRender(route.params)}
                                <Text style={{ fontFamily: regFont, fontSize: 16 }}>  {route.params.firstName} asked:</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, width: '90%', alignSelf: 'center', }}>
                                <Text style={[styles.questionText, { fontSize: 18, lineHeight: 28 }]}>{route.params.question}</Text>
                            </View>
                        </BlurView>
                        <View>
                            <BlurView intensity={75} tint="light" style={[styles.question, { height: 300, marginTop: 20, justifyContent: 'flex-start' }]}>
                                <View style={[styles.questionCardTopBar, { position: 'relative' }]}>
                                    <Image style={styles.image} source={require('../assets/monalisa.jpeg')} />
                                    <Text style={{ fontFamily: regFont, fontSize: 16 }}>  Your response:</Text>
                                </View>
                                <View style={{ width: '85%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', height: '70%', marginTop: 20, }}>
                                    <TextInput
                                        value={text}
                                        onChangeText={onChangeText}
                                        placeholder="Type here"
                                        style={{ fontSize: 18, fontFamily: regFont, width: '100%', height: '100%' }}
                                        maxLength={300}
                                        multiline={true} />
                                </View>
                                <Text style={{ alignSelf: 'flex-end', marginTop: 8, right: 15, fontFamily: regFont, fontSize: 14 }}>{textLength}/300</Text>
                            </BlurView>
                        </View>
                        {renderSendButton(sendButton, border)}
                        {lowerButtons}
                    </SafeAreaView >
                </LinearGradient>
            </TouchableWithoutFeedback>
        )
    }


    function DrawingRespond({ route }) {
        var [sendButton, setSendButton] = useState("Send →");
        var [border, setBorder] = useState(true);
        var [lowerButtons, setLowerButtons] = useState(<View></View>);

        function renderSendButton(buttonText, border) {
            if (buttonText === "Sent!") {
                return (
                    <View style={[styles.send, { borderWidth: border ? 1 : 0 }]}>
                        <Text style={styles.sendText}>{buttonText}</Text>
                    </View>
                )
            }
            return (
                <Pressable onPress={text.length > 0 ? () => { setSendButton("Send?"); setLowerButtons(renderConfirm); setBorder(false) } : () => { }}>
                    <View style={[styles.send, { borderWidth: border ? 1 : 0, borderColor: text.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.5)' }]}>
                        <Text style={[styles.sendText, { color: text.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.5)' }]}>{buttonText}</Text>
                    </View>
                </Pressable>
            )
        }
        var renderConfirm = <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
            <Pressable onPress={() => { setSendButton("Send →"); setLowerButtons(<View></View>); setBorder(true) }}>
                <View style={[styles.send, { marginTop: 20, marginRight: 0, width: 120 }]}>
                    <Text style={styles.sendText}>NO</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => { setSendButton("Sent!"); setLowerButtons(renderSent) }}>
                <View style={[styles.send, { marginTop: 20, marginRight: 0, width: 120 }]}>
                    <Text style={styles.sendText}>YES</Text>
                </View>
            </Pressable>
        </View>;
        var renderSent = <><Pressable onPress={() => navigation.navigate("QuestionsDefault", { data: props.data })}>
            <View style={[styles.send, { marginTop: 20 }]}>
                <Text style={styles.sendText}>Back to Questions</Text>
            </View>
        </Pressable></>;

        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView>
                    <BlurView intensity={75} tint="light" style={[styles.question, { marginTop: 80, height: 150, justifyContent: 'flex-start' }]}>
                        <View style={[styles.questionCardTopBar, { position: 'relative' }]}>
                            {imageRender(route.params)}
                            <Text style={{ fontFamily: regFont, fontSize: 16 }}>  {route.params.firstName} asked:</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, width: '90%', alignSelf: 'center', }}>
                            <Text style={[styles.questionText, { fontSize: 18, lineHeight: 28 }]}>{route.params.question}</Text>
                        </View>
                    </BlurView>
                    <View style={[styles.questionCard, { height: 350, marginTop: 20, }]}>
                    </View>
                </SafeAreaView >
            </LinearGradient>
        )
    }

    function PhotoRespond({ route }) {
        const takePicture = async () => {
            const [status, requestPermission] = ImagePicker.useCameraPermissions();
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                setImage(result.uri);
            }
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

        var [sendButton, setSendButton] = useState("Send →");
        var [border, setBorder] = useState(true);
        var [lowerButtons, setLowerButtons] = useState(<View></View>);

        function renderSendButton(buttonText, border) {
            if (buttonText === "Sent!") {
                return (
                    <View style={[styles.send, { borderWidth: 0, marginBottom: border ? 30 : 0 }]}>
                        <Text style={styles.sendText}>{buttonText}</Text>
                    </View>
                )
            }
            return (
                <Pressable onPress={() => { setSendButton("Send?"); setLowerButtons(renderConfirm); setBorder(false) }}>
                    <View style={[styles.send, { borderWidth: border ? 1 : 0, marginBottom: border ? 20 : 0 }]}>
                        <Text style={[styles.sendText]}>{buttonText}</Text>
                    </View>
                </Pressable>
            )
        }
        var renderConfirm = <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
            <Pressable onPress={() => { setSendButton("Send →"); setLowerButtons(<View></View>); setBorder(true) }}>
                <View style={[styles.send, { marginTop: 20, marginBottom: 20, marginRight: 0, width: 120 }]}>
                    <Text style={styles.sendText}>NO</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => { setSendButton("Sent!"); setLowerButtons(renderSent) }}>
                <View style={[styles.send, { marginTop: 20, marginBottom: 20, marginRight: 0, width: 120 }]}>
                    <Text style={styles.sendText}>YES</Text>
                </View>
            </Pressable>
        </View>;
        var renderSent = <><Pressable onPress={() => navigation.navigate("QuestionsDefault", { data: props.data })}>
            <View style={[styles.send, { marginTop: 20, marginBottom: 20 }]}>
                <Text style={styles.sendText}>Back to Questions</Text>
            </View>
        </Pressable></>;

        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView>
                    <ScrollView>
                        <BlurView intensity={75} tint="light" style={[styles.question, { marginTop: 80, height: 150, justifyContent: 'flex-start' }]}>
                            <View style={[styles.questionCardTopBar, { position: 'relative' }]}>
                                {imageRender(route.params)}
                                <Text style={{ fontFamily: regFont, fontSize: 16 }}>  {route.params.firstName} asked:</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, width: '90%', alignSelf: 'center', }}>
                                <Text style={[styles.questionText, { fontSize: 18, lineHeight: 28 }]}>{route.params.question}</Text>
                            </View>
                        </BlurView>
                        {image ? <>
                            <Image source={{ uri: image }} style={[styles.questionCard, { width: '90%', borderWidth: 1, borderColor: 'white', marginTop: 20 }]} />
                            {renderSendButton(sendButton, border)}
                            {lowerButtons}
                        </>
                            : <View style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                                <BlurView intensity={75} tint="light" style={[styles.question, { width: 165, height: 80, marginTop: 20 }]}>
                                    <Pressable onPress={takePicture} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name='camera' size={30} />
                                        <Text style={{ fontFamily: regFont, fontSize: 18 }}> Camera</Text>
                                    </Pressable>
                                </BlurView>
                                <BlurView intensity={75} tint="light" style={[styles.question, { width: 165, height: 80, marginTop: 20 }]}>
                                    <Pressable onPress={pickImage} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name='upload' size={30} />
                                        <Text style={{ fontFamily: regFont, fontSize: 18 }}> Photo Album</Text>
                                    </Pressable>
                                </BlurView>
                            </View>}
                    </ScrollView>
                </SafeAreaView >
            </LinearGradient>
        )
    }

    function AudioRespond({ route }) {
        const animation = new Animated.Value(0);
        const inputRange = [0, 1];
        const outputRange = [1, 0.8];
        const scale = animation.interpolate({ inputRange, outputRange });
        var timer = useRef(null);
        var [fill, setFill] = useState(0);
        var [paused, setPaused] = useState(false);
        var [memoDone, setMemoDone] = useState(false);
        var [recordIcon, setRecordIcon] = useState(<Icon name='microphone' size={40} />)

        useEffect(() => {
            if (fill >= 100) {
                setMemoDone(true);
                setRecordIcon(<Icon name='microphone' size={40} />);
                clearTimeout(timer.current);
            }
        }, [fill]);

        function onPressInMic() {
            function fillUp() {
                setFill((prevValue) => prevValue + 1);
                timer.current = setTimeout(fillUp, 100);
            }
            setPaused(false);
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
            clearTimeout(timer.current);
            setPaused(true);
            setRecordIcon(<Icon name='microphone' size={40} />);
        };

        var [sendButton, setSendButton] = useState("Send →");
        var [border, setBorder] = useState(true);
        var [lowerButtons, setLowerButtons] = useState(<View></View>);

        function renderSendButton(buttonText, border) {
            if (buttonText === "Sent!") {
                return (
                    <View style={[styles.send, { borderWidth: 0, marginBottom: border ? 30 : 0 }]}>
                        <Text style={styles.sendText}>{buttonText}</Text>
                    </View>
                )
            }
            if (buttonText === "Send?") {
                return (
                    <Pressable onPress={() => { setSendButton("Send?"); setLowerButtons(renderConfirm); setBorder(false) }}>
                        <View style={[styles.send, { borderWidth: border ? 1 : 0, marginBottom: border ? 20 : 0 }]}>
                            <Text style={[styles.sendText]}>{buttonText}</Text>
                        </View>
                    </Pressable>
                )
            }
            return (
                <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
                    <Pressable onPress={() => { setFill(0); setPaused(false); setMemoDone(false) }}>
                        <View style={[styles.send, { marginTop: 20, marginBottom: 20, marginRight: 0, width: 120 }]}>
                            <Text style={styles.sendText}>Re-record</Text>
                        </View>
                    </Pressable>
                    <Pressable onPress={() => { setSendButton("Send?"); setLowerButtons(renderConfirm); setBorder(false) }}>
                        <View style={[styles.send, { marginTop: 20, marginBottom: 20, marginRight: 0, width: 120 }]}>
                            <Text style={styles.sendText}>Send →</Text>
                        </View>
                    </Pressable>
                </View>
            )
        }

        var renderConfirm = <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
            <Pressable onPress={() => { setSendButton("Send →"); setLowerButtons(<View></View>); setBorder(true) }}>
                <View style={[styles.send, { marginTop: 20, marginBottom: 20, marginRight: 0, width: 120 }]}>
                    <Text style={styles.sendText}>NO</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => { setSendButton("Sent!"); setLowerButtons(renderSent) }}>
                <View style={[styles.send, { marginTop: 20, marginBottom: 20, marginRight: 0, width: 120 }]}>
                    <Text style={styles.sendText}>YES</Text>
                </View>
            </Pressable>
        </View>;
        var renderSent = <><Pressable onPress={() => navigation.navigate("QuestionsDefault", { data: props.data })}>
            <View style={[styles.send, { marginTop: 20, marginBottom: 20 }]}>
                <Text style={styles.sendText}>Back to Questions</Text>
            </View>
        </Pressable></>;

        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView>
                    <BlurView intensity={75} tint="light" style={[styles.question, { marginTop: 80, height: 150, justifyContent: 'flex-start' }]}>
                        <View style={[styles.questionCardTopBar, { position: 'relative' }]}>
                            {imageRender(route.params)}
                            <Text style={{ fontFamily: regFont, fontSize: 16 }}>  {route.params.firstName} asked:</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, width: '90%', alignSelf: 'center', }}>
                            <Text style={[styles.questionText, { fontSize: 18, lineHeight: 28 }]}>{route.params.question}</Text>
                        </View>
                    </BlurView>
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
                    {(paused === true || memoDone === true) && renderSendButton(sendButton, border)}
                    {(paused === true || memoDone === true) && lowerButtons}
                </SafeAreaView >
            </LinearGradient >
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