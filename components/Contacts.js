import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { TabRouter } from 'react-navigation';
import { StyleSheet, Text, View, FlatList, Image, Pressable, ImageEditor } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Contacts from 'expo-contacts';
var regFont = 'Nunito_500Medium';


export default function ContactList(props) {
    const navigation = useNavigation();

    function ContactItem(props) {
        var imageRender = <View style={styles.image}>
            <Text style={styles.initials}>{props.firstName ? props.firstName[0] : ""}{props.lastName ? props.lastName[0] : ""}</Text>
            {props.online ? <View style={{ height: 12, width: 12, borderRadius: 12, backgroundColor: 'limegreen', position: 'absolute', right: 0, bottom: 0 }}></View> : <View></View>}
        </View>;
        if (props.imageAvailable) {
            imageRender = <View style={styles.image} >
                <Image style={styles.image} source={props.image} />
                {props.online ? <View style={{ height: 12, width: 12, borderRadius: 12, backgroundColor: 'limegreen', position: 'absolute', right: 0, bottom: 0 }}></View> : <View></View>}
            </View>
        }

        var onPressContact = () => navigation.navigate("Categories", { firstName: props.firstName, lastName: props.lastName, imageAvailable: props.imageAvailable, image: props.image, online: props.online });
        if (props.onPressContact === "ViewQuestion") {
            onPressContact = () => navigation.navigate("ViewQuestion", { firstName: props.firstName, lastName: props.lastName, imageAvailable: props.imageAvailable, image: props.image, online: props.online, question: props.question });
        }
        if (props.onPressContact === "ViewResponse") {
            onPressContact = () => navigation.navigate("ViewResponse", { firstName: props.firstName, lastName: props.lastName, imageAvailable: props.imageAvailable, image: props.image, online: props.online, response: props.response });
        }

        if (props.response) {
            var response = props.response.response;
            if (props.response.responseType === 'image') {
                response = '(tap to view image)';
            }
            else if (props.response.responseType === 'drawing') {
                response = '(tap to view drawing)';
            }
            else if (props.response.responseType === 'audio') {
                response = '(tap to listen)';
            }
        }


        return (
            <Pressable style={props.contactStyle} onPress={onPressContact}>
                {imageRender}
                <View style={{ flexDirection: 'column', width: 280 }}>
                    <Text style={[props.nameStyle, { fontFamily: 'Nunito_700Bold' }]}>{props.firstName} {props.lastName}</Text>
                    {props.showQuestion === true && <Text style={[props.nameStyle, { color: 'rgba(255, 255, 255, 0.65)' }]} numberOfLines={1}>{props.question}</Text>}
                    {props.showResponse === true && <Text style={[props.nameStyle, { color: 'rgba(255, 255, 255, 0.65)' }]} numberOfLines={1}>Q: {props.response.answered}</Text>}
                    {props.showResponse === true && <Text style={[props.nameStyle, { color: 'rgba(255, 255, 255, 0.65)' }]} numberOfLines={1}>A: {response}</Text>}
                </View>
            </Pressable>
        );
    }

    function renderContacts({ item, index }) {
        var contactStyle = styles.contact;
        if (props.contactStyle !== undefined) {
            contactStyle = props.contactStyle;
        }
        var nameStyle = styles.name;
        if (props.contactStyle !== undefined) {
            nameStyle = props.nameStyle;
        }

        return <ContactItem
            firstName={item.firstName}
            lastName={item.lastName}
            imageAvailable={item.imageAvailable}
            image={item.image}
            online={item.online}
            contactStyle={contactStyle}
            nameStyle={nameStyle}
            onPressContact={props.onPressContact}
            question={item.question}
            showQuestion={props.showQuestion}
            showResponse={props.showResponse}
            response={item.response}
            id={props.id}
        />;
    };

    return (
        <FlatList data={props.data} renderItem={renderContacts} style={styles.container} keyExtractor={(item) => item.id} />
    );
}


const styles = StyleSheet.create({
    container: {
        marginLeft: 30,
    },
    contact: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    name: {
        fontFamily: regFont,
        fontSize: 16,
        marginLeft: 30,
    },
    image: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white',
    },
    initials: {
        fontFamily: regFont,
        fontSize: 16,
    },
});