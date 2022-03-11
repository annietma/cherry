import { StyleSheet, Text, View, FlatList, Image, Pressable, ImageEditor } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { regFont, RegBackground } from './Styles';

export function imageRender(contact, size = 30, you) {
    var source = require('../assets/monalisa.jpeg');
    if (contact.imageAvailable || you) {
        if (!you) source = contact.image;
        return <View>
            <Image style={[styles.image, { height: size, width: size }]} source={source} />
            {contact.online ? <View style={{ height: size * 0.25, width: size * 0.25, borderRadius: 12, backgroundColor: 'limegreen', position: 'absolute', right: 0, bottom: 0 }}></View> : <View></View>}
        </View>
    }
    else {
        return <View style={[styles.image, { height: size, width: size }]}>
            <Text style={{ fontFamily: regFont, fontSize: size * 0.3 }}>{contact.firstName ? contact.firstName[0] : ""}{contact.lastName ? contact.lastName[0] : ""}</Text>
            {contact.online ? <View style={{ height: size * 0.25, width: size * 0.25, borderRadius: 12, backgroundColor: 'limegreen', position: 'absolute', right: 0, bottom: 0 }}></View> : <View></View>}
        </View>;
    }
}

export function ContactList(props) {
    const navigation = useNavigation();

    function ContactItem(props) {

        var onPressContact = () => navigation.navigate("Categories", props);
        if (props.onPressContact === "ViewQuestion") {
            onPressContact = () => navigation.navigate("ViewQuestion", props);
        }
        if (props.onPressContact === "ViewResponse") {
            onPressContact = () => navigation.navigate("ViewResponse", props);
        }
        if (props.onPressContact === "ConfirmRequest") {
            onPressContact = () => navigation.navigate("ConfirmRequest", props);
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
                {imageRender(props, 50)}
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
        if (props.nameStyle !== undefined) {
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
            phone={item.phoneNumbers && item.phoneNumbers[0].number}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white',
    },
});