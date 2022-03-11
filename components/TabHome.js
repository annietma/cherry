import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, ScrollView, View, FlatList, Image, Pressable, TextInput } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';

import { imageRender, ContactList } from './Contacts';
import { regFont, blurIntensity, RegBackground, RegBlurView, BlurPressable, notImplemented, SendButtons } from './Styles';

var categories = [{ name: "Deeply Personal", question: "What did you recently feel insecure about?" },
{ name: "Funny", question: "What's the funniest thing that's happened to you this week?" },
{ name: "Love", question: "Talk to anyone *interesting* lately?" },
{ name: "Memories", question: "What's your favorite memory of us?" },];

export function CategoriesComponent(props) {
    const navigation = useNavigation();
    var data = {
        firstName: props.data.firstName,
        lastName: props.data.lastName,
        imageAvailable: props.data.imageAvailable,
        image: props.data.image,
        online: props.data.online,
        question: Math.floor(Math.random() * categories.length)
    };

    var goToScreen = "Question";
    if (props.goToScreen) goToScreen = props.goToScreen;

    var onPressCategory = () => navigation.navigate(goToScreen, data);

    const renderCategories = ({ item }) => {
        return (
            <BlurPressable text={item.name} style={{ marginBottom: 18 }}
                onPress={() => { data.category = item.name; onPressCategory() }} />
        )
    }
    return (
        <>
            <BlurPressable text={'🎲 Random'} style={{ marginTop: 10 }}
                onPress={() => { data.category = "Random"; onPressCategory() }} />
            <BlurPressable text={'✏️ Write your own question'} style={{ marginTop: 10, marginBottom: 60 }}
                onPress={() => { data.category = "Custom"; onPressCategory() }} />
            <BlurPressable text={'+/- categories'} textStyle={{ fontSize: 14 }} style={{ alignSelf: 'flex-start', marginLeft: '7.5%', width: '35%', height: 35, marginBottom: 18, backgroundColor: 'transparent' }}
                onPress={() => notImplemented("+/- categories")} />
            <FlatList data={categories} renderItem={renderCategories} keyExtractor={(item) => item.name} />
        </>
    )
}


export function QuestionComponent(props) {
    const navigation = useNavigation();

    var questionText = '';
    if (props.data.category === "Random") {
        questionText = categories[props.data.question].question;
    }
    else if (props.data.category !== "Custom") {
        questionText = categories.find((category) => {
            return category.name === props.data.category;
        }).question;
    }

    props.data.screen = "Question";
    props.data.questionText = questionText;

    var goToScreen = "ChooseContact";
    if (props.goToScreen) goToScreen = props.goToScreen;
    var afterSentText = "Send another question";
    if (props.afterSentText) afterSentText = props.afterSentText;

    var [text, setText] = React.useState("");
    if (props.data.category === "Custom") {
        var textLength = text.length;
        return (<ScrollView>
            <BlurPressable text={'View Past Questions'} style={{ marginTop: 60, width: 250 }} onPress={() => notImplemented("View Past Questions")} />
            <RegBlurView style={{ height: 320, marginTop: 20, marginBottom: 10 }}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Example: What was your first impression of me?"
                    textAlign={'center'}
                    textAlignVertical={'center'}
                    style={{ fontFamily: regFont, fontSize: 25, lineHeight: 40, textAlign: 'center', width: '80%' }}
                    maxLength={150}
                    returnKeyType="next"
                    blurOnSubmit={true}
                    multiline={true} />
                <Text style={{ position: 'absolute', bottom: 15, right: 15, fontFamily: regFont, fontSize: 14 }}>{textLength}/150</Text>
            </RegBlurView>
            <SendButtons screen={'Question'} contacts={props.data} category={props.data.category} textInput={true} textLength={textLength}
                onPressAfterSent={() => navigation.navigate(goToScreen, props.data)}
                afterSentText={afterSentText} />
        </ScrollView>
        )
    }
    else {
        return (
            <>
                <RegBlurView>
                    <Text style={{ position: 'absolute', top: 15, left: 15, fontFamily: regFont, fontSize: 14 }}>{props.data.category}</Text>
                    <Text style={{ fontFamily: regFont, fontSize: 25, lineHeight: 40, textAlign: 'center', width: '80%' }}>{questionText}</Text>
                </RegBlurView>
                <SendButtons screen={'Question'} contacts={props.data} category={props.data.category} textInput={true} textLength={textLength}
                    onPressAfterSent={() => navigation.navigate(goToScreen, props.data)}
                    afterSentText={afterSentText} />
            </>
        )
    }
}

export default function Home(props) {
    const HomeStack = createStackNavigator();
    const navigation = useNavigation();

    function HomeDefault() {
        function cardBlock(title, contact, subtitle, bodyText) {
            return (
                <>
                    <Text style={{ fontFamily: regFont, fontSize: 20, marginTop: 30, marginBottom: 5, marginLeft: '5%', color: 'white' }}>{title}</Text>
                    <Pressable onPress={() => notImplemented("Card swiping")}
                        style={{ width: '90%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ height: 155, width: '70%', backgroundColor: 'rgba(255, 255, 255, 0.45)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', position: 'absolute', right: 0 }} />
                        <BlurView intensity={blurIntensity} tint="light"
                            style={{ overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.55)', height: 180, width: '94%', justifyContent: 'center', borderWidth: 1, borderColor: 'white', borderRadius: 25, }}>
                            <View style={{ flexDirection: 'row', position: 'absolute', top: 0, alignItems: 'center', marginLeft: 10, marginTop: 10, }}>
                                {imageRender(contact)}
                                <Text style={{ marginLeft: 7, fontFamily: regFont }}>{contact.firstName} {subtitle}</Text>
                            </View>
                            <Text style={{ textAlign: 'center', fontFamily: regFont, fontSize: 18, width: '90%', alignSelf: 'center', marginTop: 20, }}>{bodyText}</Text>
                        </BlurView>
                    </Pressable>
                </>
            )
        }
        return (
            <RegBackground>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Pressable onPress={() => notImplemented("Profile page")} style={{ position: 'absolute', left: 20 }}>
                        <Image style={{ width: 40, height: 40, borderRadius: 100, borderWidth: 1, borderColor: 'white' }}
                            source={require('../assets/monalisa.jpeg')} /></Pressable>
                    <Text style={{ fontFamily: 'PlayfairDisplay_800ExtraBold_Italic', fontSize: 40, color: 'white' }}>Cherry</Text>
                </View>
                {cardBlock("New Questions", props.data[0], "asked:", "What are you most excited about in the coming weeks?")}
                {cardBlock("New Responses", props.data[props.data.length - 1], "responded:", "Where do you want to live before you settle down?")}
                <BlurPressable text={'Send a Question'} style={{ width: 250, marginTop: 70 }} onPress={() => navigation.navigate("ChooseContact", { data: props.data })} />
            </RegBackground>
        )

    }

    function ChooseContact({ route }) {
        return (
            <RegBackground>
                <BlurView intensity={blurIntensity} tint="light"
                    style={{
                        overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.55)', width: '90%', height: '88%', justifyContent: 'center',
                        borderWidth: 1, borderColor: 'white', borderRadius: 25, marginTop: 70, alignSelf: 'center'
                    }}>
                    <View style={{ height: 50 }} />
                    <ContactList data={props.data} />
                </BlurView>
            </RegBackground>
        )
    }

    function Categories({ route }) {
        return (
            <RegBackground>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 45, }}>
                    {imageRender(route.params)}
                    <Text style={{ alignSelf: 'center', fontFamily: regFont, fontSize: 16, color: 'white' }}> {route.params.firstName} {route.params.lastName}</Text>
                </View>
                <Text style={{ alignSelf: 'center', fontFamily: regFont, fontSize: 18, color: 'white', marginTop: 40 }}>Choose Category</Text>
                <CategoriesComponent data={route.params} />
            </RegBackground>
        )
    }

    function Question({ route }) {
        return (
            <RegBackground>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 45, }}>
                    {imageRender(route.params)}
                    <Text style={{ alignSelf: 'center', fontFamily: regFont, fontSize: 16, color: 'white' }}> {route.params.firstName} {route.params.lastName}</Text>
                </View>
                <QuestionComponent data={route.params} />
            </RegBackground>
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