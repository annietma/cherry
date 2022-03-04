import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { TabRouter } from 'react-navigation';
import { StyleSheet, Text, View, FlatList, Image, Pressable } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Contacts from 'expo-contacts';
var regFont = 'Nunito_500Medium';


export default function ContactList(props) {
    const navigation = useNavigation();

    function ContactItem(props) {
        var imageRender = <View style={styles.image}><Text style={styles.initials}>{props.firstName ? props.firstName[0] : ""}{props.lastName ? props.lastName[0] : ""}</Text></View>;
        if (props.hasImage) {
            imageRender = <Image style={styles.image} source={props.image} />
        }

        var onPressContact = () => navigation.navigate("Categories", { firstName: props.firstName, lastName: props.lastName });
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
        var contactStyle = styles.contact;
        if (props.contactStyle !== undefined) {
            contactStyle = props.contactStyle;
        }
        return <ContactItem
            firstName={item.firstName}
            lastName={item.lastName}
            hasImage={item.imageAvailable}
            image={item.image}
            contactStyle={contactStyle}
            onPressContact={props.onPressContact}
        />;
    };

    return (
        <FlatList data={props.data} renderItem={renderContacts} style={styles.container} />
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