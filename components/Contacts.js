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
            onPressContact = () => navigation.navigate("ViewQuestion", { firstName: props.firstName, imageRender: imageRender });
        }

        return (
            <Pressable style={props.contactStyle} onPress={onPressContact}>
                {imageRender}
                <Text style={styles.name}>{props.firstName} </Text>
                <Text style={[styles.name, { marginLeft: 0 }]}>{props.lastName}</Text>
            </Pressable>
        );
    }

    function renderContacts({ item, index }) {
        console.log(item);
        var contactStyle = styles.contact;
        if (props.contactStyle !== undefined) {
            contactStyle = props.contactStyle;
        }
        return <ContactItem
            firstName={item.firstName}
            lastName={item.lastName}
            imageAvailable={item.imageAvailable}
            image={item.image}
            online={item.online}
            contactStyle={contactStyle}
            onPressContact={props.onPressContact}
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