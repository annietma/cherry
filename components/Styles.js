import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { BlurView } from 'expo-blur';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import SafeAreaView from 'react-native-safe-area-view';

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
            <SafeAreaView style={{ height: '100%' }} forceInset={{ top: 'always' }}>
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

export function notImplemented(functionality) {
    Alert.alert("Not yet implemented",
        "\"" + functionality + "\" is beyond the scope of our project, but it will be implemented in future iterations.",
        [{ text: "OK" }]);
}

export function SendButtons(props) {
    const navigation = useNavigation();
    const onPressAfterSent = props.onPressAfterSent ? props.onPressAfterSent : () => { navigation.navigate("ChooseContact", { data: props.contacts }) };

    var upperSend = <BlurPressable text={'Send'} textStyle={styles.sendText} style={styles.send}
        onPress={() => { setUpperButton(upperConfirm); setLowerButtons(lowerConfirm); }} />;

    var upperSendGrayed = <View style={[styles.send, { borderWidth: 0, backgroundColor: 'transparent', }]}>
        <Text style={[styles.sendText, { color: 'rgba(0,0,0, 0.5)' }]}>Send</Text>
    </View>;

    var upperConfirm = <View style={[styles.send, { borderWidth: 0, backgroundColor: 'transparent', }]}>
        <Text style={styles.sendText}>Send?</Text>
    </View>;

    var upperSent = <View style={[styles.send, { borderWidth: 0, backgroundColor: 'transparent', }]}>
        <Text style={styles.sendText}>Sent!</Text>
    </View>;

    var lowerConfirm = <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '70%' }}>
        <BlurPressable text={'No'} textStyle={styles.sendText} style={[styles.send, { width: 120 }]}
            onPress={() => { setUpperButton(upperSend); setLowerButtons(<></>); }} />
        <BlurPressable text={'Yes'} textStyle={styles.sendText} style={[styles.send, { width: 120 }]}
            onPress={() => { setUpperButton(upperSent); setLowerButtons(lowerSent); }} />
    </View>;

    var lowerSent = <BlurPressable text={props.afterSentText} textStyle={styles.sendText} style={styles.send}
        onPress={() => onPressAfterSent()} />;

    var upperButton = upperSend;
    var [upperButton, setUpperButton] = useState(upperSend);
    var [lowerButtons, setLowerButtons] = useState(<></>);
    if (props.textInput === true && props.textLength < 1) {
        if (upperButton === upperSend) upperButton = upperSendGrayed;
    }
    if (props.textInput === true && props.textLength > 0) {
        if (upperButton === upperSendGrayed) upperButton = upperSend;

    }

    return (
        <>
            {upperButton}
            {lowerButtons}
            <View style={{ marginTop: 80 }}></View>
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
        marginTop: 20,
    },
    sendText: {
        fontFamily: regFont,
        fontSize: 18,
        color: 'black'
    },
});