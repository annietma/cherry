import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View, } from 'react-native';
import { BlurView } from 'expo-blur';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

export var regFont = 'Nunito_500Medium';
export var blurIntensity = 75;

export function RegBackground(props) {
    var colors = ['#ff4a86', '#fe9a55', '#fec759'];
    var locations = [0.2, 0.8, 1];
    if (props.shade === 'dark') {
        colors = ['#791F3D', '#A92E57'];
        locations = [0.2, 1];
    }
    return (
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={locations}>
            <SafeAreaView style={{ height: '100%' }}>
                {props.children}
            </SafeAreaView>
        </LinearGradient>
    )
}

export function RegBlurView(props) {
    return (
        <BlurView intensity={75} tint="light" style={[styles.regBlurView, props.style]}>
            {props.children}
        </BlurView>
    )
}

export function BlurPressable(props) {
    return (
        <Pressable onPress={props.onPress} style={{ justifyContent: 'center', alignItems: 'center' }} >
            {({ pressed }) => (
                <BlurView intensity={75} tint="light" style={[styles.blurPressable, { backgroundColor: pressed ? 'transparent' : 'rgba(255, 255, 255, 0.3)' }, props.style]}>
                    {props.children ? props.children : <Text style={[{ fontFamily: regFont, fontSize: 18, color: 'black' }, props.textStyle]}>{props.text}</Text>}
                </BlurView>
            )}
        </Pressable>
    )
}

export function notImplemented() {
    Alert.alert("Functionality not yet implemented",
        "This functionality is beyond the scope of our project, but it will be implemented in future iterations.",
        [{ text: "OK" }]);
}

export function SendButtons(props) {
    const navigation = useNavigation();
    var [sendButton, setSendButton] = useState("Send →");
    var [border, setBorder] = useState(true);
    var [lowerButtons, setLowerButtons] = useState(<></>);
    var [clickable, setClickable] = useState(false);
    if ((clickable === false) && (props.textInput === false || props.textLength > 0 || props.category !== "Custom")) setClickable(true);
    if (clickable === true && props.textInput === true && props.textLength < 1 && props.category === "Custom") setClickable(false);

    var onPressUpper = () => { setSendButton("Send?"); setLowerButtons(confirmLower); setClickable(false); setBorder(false) };
    var onPressNo = () => { setSendButton("Send →"); setLowerButtons(<></>); setBorder(true) };
    var onPressYes = () => { setSendButton("Sent!"); setLowerButtons(sentLower) };
    var onPressAfterSent = props.onPressAfterSent ? props.onPressAfterSent : () => { navigation.navigate("ChooseContact", { data: props.contacts }) };
    var color = 'black';

    if (!clickable) {
        onPressUpper = () => { }
        color = 'rgba(255, 255, 255, 0.5)';
    }

    var upperButtons =
        <Pressable onPress={onPressUpper}>
            <View style={[styles.send, { borderWidth: border ? 1 : 0, backgroundColor: border ? 'rgba(255, 255, 255, 0.55)' : 'transparent', borderColor: 'white', marginTop: 30 }]}>
                <Text style={[styles.sendText, { color: color }]}>{sendButton}</Text>
            </View>
        </Pressable>;

    var confirmLower = <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
        <Pressable onPress={onPressNo} style={[styles.send, { marginRight: 0, width: 120 }]}>
            <Text style={styles.sendText}>No</Text>
        </Pressable>
        <Pressable onPress={onPressYes} style={[styles.send, { marginRight: 0, width: 120 }]}>
            <Text style={styles.sendText}>Yes</Text>
        </Pressable>
    </View>;

    var sentLower = <><Pressable onPress={onPressAfterSent} style={styles.send}>
        <Text style={styles.sendText}>{props.afterSentText}</Text>
    </Pressable></>;

    return (
        <>
            {upperButtons}
            {lowerButtons}
        </>
    )
}

const styles = StyleSheet.create({
    regBlurView: {
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
    blurPressable: {
        height: 50,
        width: '85%',
        alignSelf: 'center',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.35)'
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
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.55)'
    },
    sendText: {
        fontFamily: regFont,
        fontSize: 18,
        color: 'black'
    },
});