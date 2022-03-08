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

export default function Responses(props) {
    const ResponsesStack = createStackNavigator();
    const navigation = useNavigation();

    function ResponsesDefault() {
        return (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations} style={{ height: '100%' }}>
                <SafeAreaView >
                    <View style={{ marginTop: 60 }}>

                    </View>
                </SafeAreaView>
            </LinearGradient>
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
            <ResponsesStack.Screen options={{ headerTitle: "Open Responses", headerTitleStyle: { color: 'white', fontFamily: regFont, fontSize: 24 } }} name="QuestionsDefault" component={ResponsesDefault} />
        </ResponsesStack.Navigator>
    )
}
