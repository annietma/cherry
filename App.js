import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView } from 'react-native';
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigationState, useNavigation } from '@react-navigation/native';
import * as Contacts from 'expo-contacts';
import AppLoading from 'expo-app-loading';
import { useFonts, PlayfairDisplay_800ExtraBold_Italic, } from '@expo-google-fonts/playfair-display';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notificationsimport { LogBox } from 'react-native';

import Home from './components/TabHome';
import Questions from './components/TabQuestions';
import Responses from './components/TabResponses';
import RapidFire from './components/TabRapidFire';

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

  useEffect(() => {
    if (ContactsData != "") {

      global.contactsOnline = [];
      for (var i = 0; i < ContactsData.length; i++) {
        if (Math.random() < 0.3) {
          ContactsData[i].online = true;
          contactsOnline.push(ContactsData[i]);
        }
        else {
          ContactsData[i].online = false;
        }
      }
      if (contactsOnline.length === 0) {
        contactsOnline.push(ContactsData[0]);
        contactsOnline.push(ContactsData[1]);
        contactsOnline.push(ContactsData[2]);
      }

      global.contactsWithQuestionsMaster = [];
      var j = 0;
      for (var i = 0; i < 6; i++) {
        ContactsData[j].question = questions[i];
        contactsWithQuestionsMaster.push(ContactsData[j]);
        j += Math.floor(ContactsData.length / 6);
      }
      global.contactsWithQuestions = [...contactsWithQuestionsMaster];

      global.contactsWithResponsesMaster = [];
      j = 0;
      for (var i = 0; i < 4; i++) {
        ContactsData[j].response = responses[i];
        contactsWithResponsesMaster.push(ContactsData[j]);
        j += Math.floor(ContactsData.length / 4);
      }
      global.contactsWithResponses = [...contactsWithResponsesMaster];
    }
  }, [ContactsData]);

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_800ExtraBold_Italic, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold
  });

  var [tabBackground, setTabBackground] = useState(['#FD9955', '#FEC759']);
  var [tabActiveColor, setTabActiveColor] = useState('#ff4a86');
  var [showTabBar, setShowTabBar] = useState(true);

  const Tab = createBottomTabNavigator();
  if (!ContactsData || !fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: { borderTopColor: 'white', borderTopWidth: 2, },
              tabBarActiveTintColor: tabActiveColor,
              tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
              tabBarShowLabel: false,
            }}
            tabBar={(props) => {
              if (showTabBar) {
                return (<LinearGradient colors={tabBackground} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >
                  <View style={{ borderColor: 'white', borderBottomWidth: 1, marginBottom: 10, }}></View>
                  <BottomTabBar {...props} />
                </LinearGradient>)
              } else {
                return (<View></View>)
              }
            }}
            screenListeners={() => ({
              state: (e) => {
                var history = e.data.state.routes[e.data.state.routes.length - 1].state;
                if (history != undefined) {
                  var name = history.routes[history.routes.length - 1].key;
                  if (name.includes("RF") && !name.includes("End")) {
                    setShowTabBar(false);
                  } else {
                    setShowTabBar(true);
                  }
                } else {
                  setShowTabBar(true);
                }
                if (e.data.state.history[e.data.state.history.length - 1].key.includes("RapidFire")) {
                  if (tabBackground != ['#9F2C53', '#A92E57']) {
                    setTabBackground(['#9F2C53', '#A92E57']);
                  }
                  if (tabActiveColor != 'white') {
                    setTabActiveColor('white');
                  }

                } else {
                  if (tabBackground != ['#FD9955', '#FEC759']) {
                    setTabBackground(['#FD9955', '#FEC759']);
                  }
                  if (tabActiveColor != '#ff4a86') {
                    setTabActiveColor('#ff4a86');
                  }
                  setShowTabBar(true);
                }
              },
            })}>
            <Tab.Screen name="Home" options={{
              tabBarStyle: { backgroundColor: "rgba(255, 255, 255, 0)", borderTopColor: 'transparent' },
              tabBarIcon: ({ color }) => (<Icon name='home' color={color} size={35} />),
            }}
              children={() => <Home data={ContactsData} />} />
            <Tab.Screen name="Questions" options={{
              tabBarStyle: { backgroundColor: "rgba(255, 255, 255, 0)", borderTopColor: 'transparent' },
              tabBarBadge: typeof contactsWithQuestions !== 'undefined' ? contactsWithQuestions.length : 0,
              tabBarIcon: ({ color }) => (<Icon name='pencil-box-multiple' color={color} size={35} />)
            }}
              children={() => <Questions data={ContactsData} />} />
            <Tab.Screen name="Responses" options={{
              tabBarStyle: { backgroundColor: "rgba(255, 255, 255, 0)", borderTopColor: 'transparent' },
              tabBarBadge: typeof contactsWithResponses !== 'undefined' ? contactsWithResponses.length : 0,
              tabBarIcon: ({ color }) => (<Icon name='inbox' color={color} size={35} />)
            }}
              children={() => <Responses data={ContactsData} />} />
            <Tab.Screen name="RapidFire" options={{
              tabBarStyle: { backgroundColor: "rgba(255, 255, 255, 0)", borderTopColor: 'transparent' },
              tabBarIcon: ({ color }) => (<Icon name='fire' color={color} size={35} />)
            }}
              children={() => <RapidFire data={ContactsData} />} />
          </Tab.Navigator>
        </NavigationContainer >
      </SafeAreaProvider>
    );
  }
}