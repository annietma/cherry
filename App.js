import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { TabRouter } from 'react-navigation';
import { StyleSheet, Text, View, Pressable, SafeAreaView } from 'react-native';
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/HomeScreen';
import Questions from './components/QuestionsScreen';
import Responses from './components/ResponsesScreen';
import * as Contacts from 'expo-contacts';
import AppLoading from 'expo-app-loading';
import { useFonts, PlayfairDisplay_800ExtraBold_Italic, } from '@expo-google-fonts/playfair-display';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const Tab = createBottomTabNavigator();

var questions = ["What are you most excited about in the coming weeks?",
  "What's a unique mannerism of mine?",
  "What's one time you stepped totally out of your comfort zone?",
  "What was your worst date ever?",
  "How do you handle stress?",
  "Where do you want to live before you settle down?"];

var responses = [{ answered: "What are you currently trying to improve about yourself?", responseType: 'text', response: "I'm trying to be less negative about things that mess up my day or my mood. " },
{ answered: "What's a place that means a lot to you?", responseType: 'image', response: require('./assets/legoland.jpg'), },
{ answered: "What does your mood look like right now?", responseType: 'drawing', response: require('./assets/mood.jpeg'), },
{ answered: "When did you feel at your highest this week?", responseType: 'audio' }];

export default function App() {

  const [ContactsData, setContactsData] = useState("");
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          sort: Contacts.SortTypes.LastName
        });

        if (data.length > 0) {
          setContactsData(data);

        }
      }
    })();
  }, []);

  function RapidFire() {
    return (
      <Text>RapidFire</Text>
    )
  }
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_800ExtraBold_Italic, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold
  });
  if (!ContactsData || !fontsLoaded) {
    return <AppLoading />;
  } else {
    for (var i = 0; i < ContactsData.length; i++) {
      if (Math.random() < 0.3) {
        ContactsData[i].online = true;
      }
      else {
        ContactsData[i].online = false;
      }
    }

    var j = 0;
    for (var i = 0; i < 6; i++) {
      ContactsData[j].question = questions[i];
      j += Math.floor(ContactsData.length / 6);
    }

    j = 0;
    for (var i = 0; i < 4; i++) {
      ContactsData[j].response = responses[i];
      j += Math.floor(ContactsData.length / 4);
    }

    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={{
          headerShown: false,
          tabBarStyle: { borderTopColor: 'white', borderTopWidth: 2, },
          tabBarActiveTintColor: '#ff4a86',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
          tabBarShowLabel: false,

        }}
          tabBar={(props) => <LinearGradient colors={['#FD9955', '#FEC759']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
            <View style={{ borderColor: 'white', borderBottomWidth: 1, marginBottom: 10, }}></View>
            <BottomTabBar {...props} />
          </LinearGradient>}>
          <Tab.Screen name="Home" options={{
            tabBarStyle: { backgroundColor: "rgba(255, 255, 255, 0)", borderTopColor: 'transparent' },
            tabBarIcon: ({ color }) => (<Icon name='home' color={color} size={35} />)
          }} children={() => <Home data={ContactsData} />} />
          <Tab.Screen name="Questions" options={{
            tabBarStyle: { backgroundColor: "rgba(255, 255, 255, 0)", borderTopColor: 'transparent' },
            tabBarBadge: 6,
            tabBarIcon: ({ color }) => (<Icon name='pencil-box-multiple' color={color} size={35} />)
          }} children={() => <Questions data={ContactsData} />} />
          <Tab.Screen name="Open" options={{
            tabBarStyle: { backgroundColor: "rgba(255, 255, 255, 0)", borderTopColor: 'transparent' },
            tabBarBadge: 5,
            tabBarIcon: ({ color }) => (<Icon name='inbox' color={color} size={35} />)
          }} children={() => <Responses data={ContactsData} />} />
          <Tab.Screen name="RapidFire" options={{
            tabBarStyle: { backgroundColor: "rgba(255, 255, 255, 0)", borderTopColor: 'transparent' },
            tabBarIcon: ({ color }) => (<Icon name='fire' color={color} size={35} />)
          }} component={RapidFire} />
        </Tab.Navigator>
      </NavigationContainer >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
