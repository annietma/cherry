import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Alert, Pressable, SafeAreaView, TextInput, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { useNavigationState, useNavigation } from '@react-navigation/native';
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import ContactList from './Contacts';
import { useFonts, PlayfairDisplay_800ExtraBold_Italic, } from '@expo-google-fonts/playfair-display';
import { Nunito_400Regular, Nunito_500Medium } from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Progress from 'react-native-progress';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Circle, Pie } from 'react-native-svg';

var regFont = 'Nunito_500Medium';
var gradient = ['#791F3D', '#A92E57'];
var locations = [0.2, 1];

export default function RapidFire(props) {
    const RFStack = createStackNavigator();
    const navigation = useNavigation();

    var contactsOnline = [];
    for (var i = 0; i < props.data.length; i++) {
        if (props.data[i].online === true) {
            contactsOnline.push(props.data[i])
        }
    }

    function imageRender(contact, size = 30) {
        if (contact.imageAvailable) {
            return <View>
                <Image style={[styles.image, { height: size, width: size }]} source={contact.image} />
                {contact.online ? <View style={{ height: size * 0.25, width: size * 0.25, borderRadius: 12, backgroundColor: 'limegreen', position: 'absolute', right: 0, bottom: 0 }}></View> : <View></View>}
            </View>
        }
        else {
            return <View style={[styles.image, { height: size, width: size }]}>
                <Text style={{ fontFamily: regFont, fontSize: size * 0.3 }}>{contact.firstName ? contact.firstName[0] : ""}{contact.lastName ? contact.lastName[0] : ""}</Text>
                {contact.online ? <View style={{ height: size * 0.25, width: size * 0.25, borderRadius: 12, backgroundColor: 'limegreen', position: 'absolute', right: 0, bottom: 0 }}></View> : <View></View>}
            </View>;
        }
    }

    function RapidFireDefault() {
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: '100%' }}>
                <SafeAreaView >
                    <BlurView intensity={75} tint='dark'
                        style={{
                            overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '90%', height: '88%', justifyContent: 'center',
                            borderWidth: 1, borderColor: 'white', borderRadius: 25, marginTop: 70, alignSelf: 'center'
                        }}>
                        <Text style={{ height: 50, marginTop: 20, alignSelf: 'center', fontFamily: regFont, fontSize: 18, color: 'white' }} >Contacts Online</Text>
                        <ContactList data={contactsOnline}
                            nameStyle={{ fontFamily: regFont, fontSize: 16, marginLeft: 30, color: 'white' }}
                            onPressContact="ConfirmRequest" />
                    </BlurView>
                </SafeAreaView>
            </LinearGradient>
        )
    }

    function ConfirmRequest({ route }) {
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: '100%' }}>
                <SafeAreaView >
                    <BlurView intensity={75} tint='dark'
                        style={{
                            overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '90%', height: '88%', justifyContent: 'center', alignItems: 'center',
                            borderWidth: 1, borderColor: 'white', borderRadius: 25, marginTop: 70, alignSelf: 'center'
                        }}>
                        <Text style={{ textAlign: 'center', width: '70%', alignSelf: 'center', fontFamily: regFont, fontSize: 22, color: 'white', marginBottom: 20 }} >Send a Rapid Fire Session request to</Text>
                        {imageRender(route.params, 80)}
                        <Text style={{ textAlign: 'center', width: '70%', alignSelf: 'center', fontFamily: regFont, fontSize: 22, color: 'white', marginTop: 20, marginBottom: 20 }} >{route.params.firstName} {route.params.lastName}?</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
                            <Pressable onPress={() => navigation.navigate("RapidFireDefault")}>
                                <View style={[styles.send, { marginTop: 20, marginRight: 0, width: 100 }]}>
                                    <Text style={styles.sendText}>NO</Text>
                                </View>
                            </Pressable>
                            <Pressable onPress={() => navigation.navigate("RFCategories", { firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online })}>
                                <View style={[styles.send, { marginTop: 20, marginRight: 0, width: 100 }]}>
                                    <Text style={styles.sendText}>YES</Text>
                                </View>
                            </Pressable>
                        </View>
                    </BlurView>
                </SafeAreaView>
            </LinearGradient>
        )
    }

    function SendRequest({ route }) {

        var [progress, setProgress] = useState(0);
        var [canceled, setCanceled] = useState(false);
        var [accepted, setAccepted] = useState(false);
        var [loaded, setLoaded] = useState(0);
        useEffect(() => {
            var timer = setTimeout(() => setProgress((prev) => prev + 0.01), 10);
            if (progress >= 1) {
                if (loaded >= 1 && canceled === false) {
                    navigation.navigate("RFCategories");
                } else {
                    setLoaded((prev) => prev + 1);
                    clearTimeout(timer.current);
                    setAccepted(true);
                    setProgress(0);
                    timer = setTimeout(() => setProgress((prev) => prev + 0.01), 10);
                }
            }
            return () => clearTimeout(timer)
        }, [progress]);

        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: '100%' }}>
                <SafeAreaView >
                    <BlurView intensity={75} tint='dark'
                        style={{
                            overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '90%', height: '88%', justifyContent: 'center', alignItems: 'center',
                            borderWidth: 1, borderColor: 'white', borderRadius: 25, marginTop: 70, alignSelf: 'center'
                        }}>
                        <Text style={{ textAlign: 'center', width: '70%', alignSelf: 'center', fontFamily: regFont, fontSize: 22, color: 'white', marginBottom: 20 }} >{(canceled === false && accepted === false) ? 'Sending a Rapid Fire Session' : 'Your'} request to</Text>
                        {imageRender(route.params, 80)}
                        <Text style={{ textAlign: 'center', width: '70%', alignSelf: 'center', fontFamily: regFont, fontSize: 22, color: 'white', marginTop: 20, marginBottom: 20 }} >{route.params.firstName} {route.params.lastName}{canceled === true && ' was cancelled'}{canceled === false && accepted === true && ' was accepted!'}</Text>
                        {canceled === false && <Progress.Bar progress={progress} style={{ marginTop: 20 }} height={6} width={200} color={'#D63B70'}></Progress.Bar>}
                        {canceled === false && accepted === true && <Text style={{ textAlign: 'center', width: '70%', alignSelf: 'center', fontFamily: regFont, fontSize: 18, color: 'white', marginTop: 20 }} >Starting session...</Text>}
                        <Pressable style={{ alignSelf: 'center' }} onPress={() => { canceled === false ? setCanceled(true) : navigation.navigate("RapidFireDefault") }}>
                            <View style={[styles.send, { marginTop: 60, width: 200 }]}>
                                <Text style={styles.sendText}>{canceled === false ? 'Cancel Request' : 'Back to Start'}</Text>
                            </View>
                        </Pressable>
                    </BlurView>
                </SafeAreaView>
            </LinearGradient>
        )
    }

    function RFSession(props) {

        var [timeLeft, setTimeLeft] = useState(1);
        useEffect(() => {
            var timer = setTimeout(() => setTimeLeft((prev) => prev - 0.01), 100);
            if (timeLeft <= 0) {
                clearTimeout(timer.current);
            }
        }, [timeLeft]);

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
                                [{ text: "NO" }, { text: "YES", onPress: () => navigation.navigate("RapidFireDefault") }]
                            );
                        }}>
                            <Text style={{ fontFamily: regFont, fontSize: 12, color: 'white', }}>End Session</Text>
                        </Pressable>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: regFont, fontSize: 16, color: 'white', }}>Time left in your turn:   </Text>
                        <Progress.Pie progress={timeLeft} size={40} color={'white'}></Progress.Pie>
                    </View>
                </View>
            </View>
        )
    }

    function RFCategories({ route }) {
        var categories = [{ name: "Deeply Personal", question: "What's one memory that's shaped a part of who you are?" },
        { name: "Funny", question: "What's the most embarrassing thing you've done to impress someone?" },
        { name: "Love", question: "Do you believe in love at first sight?" },
        { name: "Memories", question: "What's your favorite memory from middle school?" },];

        const renderCategories = ({ item }) => {
            return (
                <Pressable onPress={() => navigation.navigate("RFQuestion", { category: item.name, firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online })}>
                    {({ pressed }) => (
                        <BlurView intensity={75} tint="light" style={[styles.category, { backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                            <Text style={styles.categoryText}>{item.name}</Text>
                        </BlurView>
                    )}
                </Pressable>
            )
        }

        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: '100%' }}>
                <SafeAreaView>
                    <Pressable style={{ marginTop: 100 }} onPress={() => navigation.navigate("RFQuestion", { category: "Random", question: Math.floor(Math.random() * categories.length), firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online })}>
                        {({ pressed }) => (
                            <BlurView intensity={75} tint="light" style={[styles.category, { marginTop: 10, backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                                <Text style={styles.categoryText}>🎲 Random</Text>
                            </BlurView>
                        )}
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("RFQuestion", { category: "Custom", firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online })}>
                        {({ pressed }) => (
                            <BlurView intensity={75} tint="light" style={[styles.category, { marginBottom: 60, backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                                <Text style={styles.categoryText}>✏️ Write your own question</Text>
                            </BlurView>
                        )}
                    </Pressable>
                    <Pressable>
                        {({ pressed }) => (
                            <BlurView intensity={75} style={[styles.category, { alignSelf: 'flex-start', marginLeft: '7.5%', width: '35%', height: 35, backgroundColor: pressed ? 'rgba(255, 255, 255, 0.25)' : "rgba(255, 255, 255, 0.35)" }]}>
                                <Text style={{ fontFamily: regFont, fontSize: 14 }}>+/- categories</Text>
                            </BlurView>
                        )}
                    </Pressable>
                    <FlatList data={categories} renderItem={renderCategories} keyExtractor={(item) => item.name} />
                    {RFSession(route.params)}
                </SafeAreaView>
            </LinearGradient>
        )
    }

    function RFQuestion({ route }) {
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: '100%' }}>
                <SafeAreaView>

                </SafeAreaView>
            </LinearGradient>
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
            <RFStack.Screen options={{ headerTitle: "Start a Rapid Fire Session", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 24 } }} name="RapidFireDefault" component={RapidFireDefault} />
            <RFStack.Screen options={{ headerShown: false, }} name="ConfirmRequest" component={ConfirmRequest} />
            <RFStack.Screen options={{ headerShown: false, }} name="SendRequest" component={SendRequest} />
            <RFStack.Screen options={{ headerLeft: null, headerTitle: "Choose Category", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 24 } }} name="RFCategories" component={RFCategories} />
            <RFStack.Screen options={{}} name="RFQuestion" component={RFQuestion} />
        </RFStack.Navigator>
    )
}

const styles = StyleSheet.create({
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
    category: {
        height: 50,
        width: '85%',
        alignSelf: 'center',
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'white',
    },
    categoryText: {
        fontFamily: regFont,
        fontSize: 18,
    },
});