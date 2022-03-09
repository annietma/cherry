import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, SafeAreaView, TextInput, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
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

export default function Home(props) {
    const HomeStack = createStackNavigator();
    const navigation = useNavigation();
    var categories = [{ name: "Deeply Personal", question: "What did you recently feel insecure about?" },
    { name: "Funny", question: "What's the funniest thing that's happened to you this week?" },
    { name: "Love", question: "Talk to anyone *interesting* lately?" },
    { name: "Memories", question: "What's your favorite memory of us?" },];
    var firstContact = props.data[0];
    var lastContact = props.data[props.data.length - 1];

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

    function HomeDefault() {

        function cardBlock(title, contact, subtitle, bodyText) {
            var image = imageRender(contact);
            return (
                <>
                    <Text style={{ fontFamily: regFont, fontSize: 20, marginTop: 30, marginBottom: 5, marginLeft: '5%', color: 'white' }}>{title}</Text>
                    <View style={{ width: '90%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ height: 155, width: '70%', backgroundColor: 'rgba(255, 255, 255, 0.45)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', position: 'absolute', right: 0 }} />
                        <BlurView intensity={75} tint="light"
                            style={{ overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.55)', height: 180, width: '94%', justifyContent: 'center', borderWidth: 1, borderColor: 'white', borderRadius: 25, }}>
                            <View style={{ flexDirection: 'row', position: 'absolute', top: 0, alignItems: 'center', marginLeft: 10, marginTop: 10, }}>
                                {image}
                                <Text style={{ marginLeft: 7, fontFamily: regFont }}>{contact.firstName} {subtitle}</Text>
                            </View>
                            <Text style={{ textAlign: 'center', fontFamily: regFont, fontSize: 18, width: '90%', alignSelf: 'center', marginTop: 20, }}>{bodyText}</Text>
                        </BlurView>
                    </View>
                </>
            )
        }

        return (
            <View style={{ backgroundColor: 'red', height: '100%' }}>
                <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations}>
                    <SafeAreaView style={{ flexDirection: 'column', height: '100%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Image style={{ width: 40, height: 40, borderRadius: 100, position: 'absolute', left: 20, borderWidth: 1, borderColor: 'white' }}
                                source={require('../assets/monalisa.jpeg')} />
                            <Text style={{ fontFamily: 'PlayfairDisplay_800ExtraBold_Italic', fontSize: 40, color: 'white' }}>Cherry</Text>
                        </View>
                        {cardBlock("New Questions", firstContact, "asked:", "What are you most excited about in the coming weeks?")}
                        {cardBlock("New Responses", lastContact, "responded:", "Where do you want to live before you settle down?")}
                        <View style={{ alignItems: 'center' }}>

                            <Pressable onPress={() => navigation.navigate("ChooseContact", { data: props.data })} >
                                {({ pressed }) => (
                                    <BlurView intensity={75} tint="light" style={[styles.send, { width: 250, overflow: 'hidden', marginTop: pressed ? 75 : 70, backgroundColor: 'rgba(255, 255, 255, 0.35)' }]}>
                                        <Text style={[styles.sendText, { color: 'black' }]}>SEND A QUESTION</Text>
                                    </BlurView>
                                )}
                            </Pressable>
                        </View>
                    </SafeAreaView >
                </LinearGradient>
            </View>
        )

    }

    function ChooseContact({ route }) {
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView>
                    <BlurView intensity={75} tint="light"
                        style={{
                            overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.55)', width: '90%', height: '88%', justifyContent: 'center',
                            borderWidth: 1, borderColor: 'white', borderRadius: 25, marginTop: 70, alignSelf: 'center'
                        }}>
                        <View style={{ height: 50 }} />
                        <ContactList data={route.params.data} />
                    </BlurView>
                </SafeAreaView>
            </LinearGradient>
        )
    }

    function Categories({ route }) {
        const renderCategories = ({ item }) => {
            return (
                <Pressable onPress={() => navigation.navigate("Question", { category: item.name, firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online })}>
                    {({ pressed }) => (
                        <BlurView intensity={75} tint="light" style={[styles.category, { backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                            <Text style={styles.categoryText}>{item.name}</Text>
                        </BlurView>
                    )}
                </Pressable>
            )
        }
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 45, }}>
                        {imageRender(route.params)}
                        <Text style={{ alignSelf: 'center', fontFamily: regFont, fontSize: 16, color: 'white' }}> {route.params.firstName} {route.params.lastName}</Text>
                    </View>
                    <Text style={{ alignSelf: 'center', fontFamily: regFont, fontSize: 18, color: 'white', marginTop: 40 }}>Choose Category</Text>
                    <Pressable onPress={() => navigation.navigate("Question", { category: "Random", question: Math.floor(Math.random() * categories.length), firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online })}>
                        {({ pressed }) => (
                            <BlurView intensity={75} tint="light" style={[styles.category, { marginTop: 10, backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                                <Text style={styles.categoryText}>🎲 Random</Text>
                            </BlurView>
                        )}
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Question", { category: "Custom", firstName: route.params.firstName, lastName: route.params.lastName, imageAvailable: route.params.imageAvailable, image: route.params.image, online: route.params.online })}>
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
                </SafeAreaView>
            </LinearGradient>
        )
    }

    function Question({ route }) {
        var question = '';
        if (route.params.category === "Random") {
            question = categories[route.params.question].question;
        }
        else if (route.params.category !== "Custom") {
            question = categories.find((category) => {
                return category.name === route.params.category;
            }).question;
        }
        var [sendButton, setSendButton] = useState("Send →");
        var [border, setBorder] = useState(true);
        var [lowerButtons, setLowerButtons] = useState(<View></View>);
        const [text, onChangeText] = React.useState("");
        var textLength = text.length;
        var displayQuestion = '';
        if (route.params.category === "Custom") {
            displayQuestion = <View>
                <Pressable onPress={() => navigation.navigate("PastQuestions", {})} >
                    {({ pressed }) => (
                        <BlurView intensity={75} tint="light" style={[styles.send, { marginTop: 60, width: 250, backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                            <Text style={styles.categoryText}>VIEW PAST QUESTIONS</Text>
                        </BlurView>
                    )}
                </Pressable>
                <BlurView intensity={75} tint="light" style={[styles.question, { height: 320, marginTop: 20 }]}>
                    <TextInput
                        value={text}
                        onChangeText={onChangeText}
                        placeholder="Example: What was your first impression of me?"
                        textAlign={'center'}
                        textAlignVertical={'center'}
                        style={styles.questionText}
                        maxLength={150}
                        multiline={true} />
                    <Text style={{ position: 'absolute', bottom: 15, right: 15, fontFamily: regFont, fontSize: 14 }}>{textLength}/150</Text>
                </BlurView></View>;
        }
        else {
            displayQuestion = <>
                <BlurView intensity={75} tint="light" style={styles.question}>
                    <Text style={{ position: 'absolute', top: 15, left: 15, fontFamily: regFont, fontSize: 14 }}>{route.params.category}</Text>
                    <Text style={styles.questionText}>{question}</Text>
                </BlurView></>;
        }

        function renderSendButton(buttonText, border) {
            if (buttonText === "Sent!") {
                return (
                    <View style={[styles.send, { borderWidth: border ? 1 : 0 }]}>
                        <Text style={styles.sendText}>{buttonText}</Text>
                    </View>
                )
            }
            else if (route.params.category === "Custom") {
                return (
                    <Pressable onPress={text.length > 0 ? () => { setSendButton("Send?"); setLowerButtons(renderConfirm); setBorder(false) } : () => { }}>
                        <View style={[styles.send, { borderWidth: border ? 1 : 0, borderColor: text.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.5)' }]}>
                            <Text style={[styles.sendText, { color: text.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.5)' }]}>{buttonText}</Text>
                        </View>
                    </Pressable>
                )
            }
            return (
                <Pressable onPress={() => { setSendButton("Send?"); setLowerButtons(renderConfirm); setBorder(false) }}>
                    <View style={[styles.send, { borderWidth: border ? 1 : 0 }]}>
                        <Text style={styles.sendText}>{buttonText}</Text>
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

        var renderSent = <><Pressable onPress={() => navigation.navigate("ChooseContact", { data: props.data })}>
            <View style={[styles.send, { marginTop: 20 }]}>
                <Text style={styles.sendText}>Send another question</Text>
            </View>
        </Pressable></>;

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                    <SafeAreaView>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 45, }}>
                            {imageRender(route.params)}
                            <Text style={{ alignSelf: 'center', fontFamily: regFont, fontSize: 16, color: 'white' }}> {route.params.firstName} {route.params.lastName}</Text>
                        </View>
                        {displayQuestion}
                        {renderSendButton(sendButton, border)}
                        {lowerButtons}
                    </SafeAreaView>
                </LinearGradient>
            </TouchableWithoutFeedback>
        )
    }

    return (

        <HomeStack.Navigator screenOptions={{
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
        }
        }>
            <HomeStack.Screen options={{ headerShown: false }} name="HomeDefault" component={HomeDefault} />
            <HomeStack.Screen options={{ headerTitle: "Choose a contact", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 24 } }} name="ChooseContact" component={ChooseContact} />
            <HomeStack.Screen options={{ headerTitle: "Daily Question to", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 24 } }} name="Categories" component={Categories} />
            <HomeStack.Screen options={{ headerTitle: "Daily Question to", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 24 } }} name="Question" component={Question} />
        </HomeStack.Navigator>
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
    categoriesTitle: {
        fontFamily: regFont,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 50,
        marginTop: 50,
        color: 'white'
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
    question: {
        height: 400,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
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
    initials: {
        fontFamily: 'Helvetica Neue',
        fontSize: 13,
    },
});
