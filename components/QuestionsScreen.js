import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { TabRouter, CancelButton } from 'react-navigation';
import { StyleSheet, Text, View, FlatList, Image, Pressable, SafeAreaView, TextInput, AppRegistry, Alert, Button } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Contacts from 'expo-contacts';
import ContactList from './Contacts';
import Sketch from 'react-native-sketch';




export default function Questions(props) {
    const QuestionsStack = createStackNavigator();
    const navigation = useNavigation();
    var questions = ["What are you most excited about in the coming weeks?",
        "What's a unique mannerism of mine?",
        "What's one time you stepped totally out of your comfort zone?",
        "What was your worst date ever?",
        "How do you handle stress?",
        "Where do you want to live before you settle down?"];

    contactsWithQuestions = [];
    for (var i = 0; i < 6; i += props.data.length / 6) {
        props.data[i].question = questions[i]
        contactsWithQuestions.push(props.data[i]);
    }

    function QuestionsDefault() {
        return (
            <SafeAreaView>
                <Text style={styles.questionsTitle}>New Questions</Text>
                <ContactList
                    data={contactsWithQuestions}
                    contactStyle={styles.contact}
                    onPressContact="ViewQuestion"
                />
            </SafeAreaView>
        )
    }

    function ViewQuestion({ route }) {
        return (
            <SafeAreaView>
                <View style={styles.questionCard} >
                    <View style={styles.questionCardTopBar}>
                        <View style={styles.questionCardContactImage}>{route.params.imageRender}</View>
                        <Text style={styles.questionCardContact}>{route.params.firstName}</Text>
                    </View>
                    <Text style={styles.questionText}>{props.data.find((name) => {
                        return name.firstName === route.params.firstName;
                    }).question}</Text>
                </View>
                <Text style={{ marginLeft: '5%', marginTop: 40, fontSize: 15, }}>Respond with:</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center', marginTop: 20, }}>
                    <Pressable style={styles.respondButton} onPress={() => navigation.navigate("TextRespond", { firstName: route.params.firstName, imageRender: route.params.imageRender })}>
                        <Text style={{ fontSize: 35 }}>✏</Text>
                    </Pressable>
                    <Pressable style={styles.respondButton} onPress={() => navigation.navigate("DrawingRespond", { firstName: route.params.firstName, imageRender: route.params.imageRender })}>
                        <Text style={{ fontSize: 35 }}>🎨</Text>
                    </Pressable>
                    <Pressable style={styles.respondButton}>
                        <Text style={{ fontSize: 35 }}>🏙</Text>
                    </Pressable>
                    <Pressable style={styles.respondButton} onPress={() => navigation.navigate("TextRespond", { firstName: route.params.firstName, imageRender: route.params.imageRender })}>
                        <Text style={{ fontSize: 35 }}>🎙</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        )
    }

    function handleSend() {
        return (
            <Pressable style={[styles.questionCard, { height: 50, marginTop: 20, }]} onPress={() => navigation.navigate("QuestionsDefault")}>
                <Text style={[styles.questionText, { fontSize: 18 }]}>Send! →</Text>
            </Pressable>
        )
    }

    function TextRespond({ route }) {
        const [text, onChangeText] = React.useState("");
        return (
            <SafeAreaView>
                <View style={[styles.questionCard, { height: 150 }]} >
                    <View style={styles.questionCardTopBar}>
                        <View style={styles.questionCardContactImage}>{route.params.imageRender}</View>
                        <Text style={styles.questionCardContact}>{route.params.firstName} asked:</Text>
                    </View>
                    <View >
                        <Text style={[styles.questionText, { fontSize: 16, lineHeight: 25, textAlign: 'left' }]}>{props.data.find((name) => {
                            return name.firstName === route.params.firstName;
                        }).question}</Text>
                    </View>
                </View>
                <View style={[styles.questionCard, { height: 200, marginTop: 20, }]}>
                    <TextInput
                        value={text}
                        onChangeText={onChangeText}
                        placeholder="Your response:"
                        style={[styles.questionText, { textAlign: 'left', fontSize: 18 }]}
                        multiline={true} />
                </View>
                {handleSend()}
            </SafeAreaView >
        )
    }


    function DrawingRespond({ route }) {
        return (
            <SafeAreaView>
                <View style={[styles.questionCard, { height: 150 }]} >
                    <View style={styles.questionCardTopBar}>
                        <View style={styles.questionCardContactImage}>{route.params.imageRender}</View>
                        <Text style={styles.questionCardContact}>{route.params.firstName} asked:</Text>
                    </View>
                    <View >
                        <Text style={[styles.questionText, { fontSize: 16, lineHeight: 25, textAlign: 'left' }]}>{props.data.find((name) => {
                            return name.firstName === route.params.firstName;
                        }).question}</Text>
                    </View>
                </View>
                <View style={[styles.questionCard, { height: 350, marginTop: 20, }]}>
                </View>
                {handleSend()}
            </SafeAreaView >
        )
    }

    return (
        <QuestionsStack.Navigator screenOptions={{
            headerBackTitle: " ",
            headerTitle: " ",
            headerStyle: {
                backgroundColor: 'transparent',
            },
        }}>
            <QuestionsStack.Screen options={{}} name="QuestionsDefault" component={QuestionsDefault} />
            <QuestionsStack.Screen options={{}} name="ViewQuestion" component={ViewQuestion} />
            <QuestionsStack.Screen options={{}} name="TextRespond" component={TextRespond} />
            <QuestionsStack.Screen options={{}} name="DrawingRespond" component={DrawingRespond} />
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
        fontFamily: 'Helvetica Neue',
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
    },
});