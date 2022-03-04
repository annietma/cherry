import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, SafeAreaView, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
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

    function HomeDefault() {

        function cardBlock(title, contact, subtitle, bodyText) {
            var imageRender = <View style={styles.image}><Text style={styles.initials}>{contact.firstName ? contact.firstName[0] : ""}{contact.lastName ? contact.lastName[0] : ""}</Text></View>;
            if (contact.imageAvailable) {
                imageRender = <Image style={styles.image} source={contact.image} />
            }
            return (
                <>
                    <Text style={{ fontFamily: regFont, fontSize: 20, marginTop: 30, marginBottom: 5, marginLeft: '5%', color: 'white' }}>{title}</Text>
                    <View style={{ width: '90%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ height: 135, width: '70%', backgroundColor: 'rgba(255, 255, 255, 0.45)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', position: 'absolute', right: 0 }} />
                        <BlurView intensity={75} tint="light"
                            style={{ overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.55)', height: 150, width: '94%', justifyContent: 'center', borderWidth: 1, borderColor: 'white', borderRadius: 25, }}>
                            <View style={{ flexDirection: 'row', position: 'absolute', top: 0, alignItems: 'center', marginLeft: 10, marginTop: 10, }}>
                                {imageRender}
                                <Text style={{ marginLeft: 7, fontFamily: regFont }}>{contact.firstName} {subtitle}</Text>
                            </View>
                            <Text style={{ textAlign: 'center', fontFamily: regFont, fontSize: 16, width: '90%', alignSelf: 'center', marginTop: 20, }}>{bodyText}</Text>
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
                            <Pressable onPress={() => navigation.navigate("ChooseContact")} >
                                {({ pressed }) => (
                                    <BlurView intensity={75} tint="light" style={[styles.send, { marginTop: 120, width: 250, backgroundColor: pressed ? 'transparent' : "rgba(255, 255, 255, 0.3)" }]}>
                                        <Text style={styles.categoryText}>SEND A QUESTION</Text>
                                    </BlurView>
                                )}
                            </Pressable>
                        </View>
                    </SafeAreaView >
                </LinearGradient>
            </View>
        )

    }

    function ChooseContact() {
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView>
                    <BlurView intensity={75} tint="light"
                        style={{
                            overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.55)', width: '90%', height: '88%', justifyContent: 'center',
                            borderWidth: 1, borderColor: 'white', borderRadius: 25, marginTop: 70, alignSelf: 'center'
                        }}>
                        <View style={{ height: 50 }} />
                        <ContactList data={props.data} />
                    </BlurView>

                </SafeAreaView>
            </LinearGradient>
        )
    }

    function Categories({ route }) {
        const renderCategories = ({ item }) => {
            return (
                <Pressable onPress={() => navigation.navigate("Question", { firstName: route.params.firstName, category: item.name })}>
                    <BlurView intensity={75} tint="light" style={styles.category}>
                        <Text style={styles.categoryText}>{item.name}</Text>
                    </BlurView>
                </Pressable>
            )
        }
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView>
                    <Pressable onPress={() => navigation.navigate("Question", { firstName: route.params.firstName, category: "Random", question: Math.floor(Math.random() * categories.length) })}>
                        <BlurView intensity={75} tint="light" style={[styles.category, { marginTop: 100 }]}>
                            <Text style={styles.categoryText}>🎲 Random</Text>
                        </BlurView>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Question", { firstName: route.params.firstName, category: "Custom" })}>
                        <BlurView intensity={75} tint="light" style={[styles.category, { marginBottom: 60 }]}>
                            <Text style={styles.categoryText}>✏️ Write your own question</Text>
                        </BlurView>
                    </Pressable>
                    <Pressable>
                        <BlurView intensity={75} style={[styles.category, { alignSelf: 'flex-start', marginLeft: '7.5%', width: '35%', height: 35, backgroundColor: 'rgba(255, 255, 255, 0.35)' }]}>
                            <Text style={{ fontFamily: regFont, fontSize: 14 }}>+/- categories</Text>
                        </BlurView>
                    </Pressable>
                    <FlatList data={categories} renderItem={renderCategories} />

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

        var displayQuestion = '';
        if (route.params.category === "Custom") {
            const [text, onChangeText] = React.useState("");

            displayQuestion = <View>
                <Text style={styles.categoriesTitle}>Write your daily question to {route.params.firstName} {route.params.lastName}:</Text>

                <BlurView intensity={75} tint="light" style={styles.question}>
                    <TextInput
                        value={text}
                        onChangeText={onChangeText}
                        placeholder="Example: What was your first impression of me?"
                        style={styles.questionText}
                        multiline={true} />
                </BlurView></View>;
        }
        else {
            displayQuestion = <>
                <Text style={styles.categoriesTitle}>Your daily question to {route.params.firstName} {route.params.lastName}:</Text>
                <BlurView intensity={75} tint="light" style={styles.question}>
                    <Text style={styles.questionText}>{question}</Text>
                </BlurView></>;
        }

        const [sendButton, setSendButton] = useState("Send →");
        const [afterSent, setAfterSent] = useState(<Text></Text>);
        var renderAfterSent = <><Pressable onPress={() => navigation.navigate("ChooseContact")}>
            <View style={[styles.send, { marginTop: 20 }]}>
                <Text style={styles.sendText}>Send another question</Text>
            </View>
        </Pressable></>;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                    <SafeAreaView>
                        {displayQuestion}
                        <Pressable onPress={() => { setSendButton("Sent!"); setAfterSent(renderAfterSent) }}>
                            <View style={styles.send}>
                                <Text style={styles.sendText}>{sendButton}</Text>
                            </View>
                        </Pressable>
                        {afterSent}
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
            }
        }
        }>
            <HomeStack.Screen options={{ headerShown: false }} name="HomeDefault" component={HomeDefault} />
            <HomeStack.Screen options={{ headerTitle: "Choose a contact", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 20 } }} name="ChooseContact" component={ChooseContact} />
            <HomeStack.Screen options={{ headerTitle: "Choose a category", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 20 } }} name="Categories" component={Categories} />
            <HomeStack.Screen options={{}} name="Question" component={Question} />
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
        backgroundColor: 'rgba(255, 255, 255, 0.55)'
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
