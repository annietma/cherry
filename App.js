import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { TabRouter } from 'react-navigation';
import { StyleSheet, Text, View, Pressable, SafeAreaView } from 'react-native';
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/HomeScreen';
import Questions from './components/QuestionsScreen';
import * as Contacts from 'expo-contacts';
import AppLoading from 'expo-app-loading';
import { useFonts, PlayfairDisplay_800ExtraBold_Italic, } from '@expo-google-fonts/playfair-display';
import { Nunito_400Regular, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
var regFont = 'Nunito_500Medium';

var gradient = ['#ff4a86', '#fe9a55', '#fec759'];
var locations = [0.2, 0.8, 1];

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

  function Open() {
    return (
      <Text>Open</Text>
    )
  }

  function RapidFire() {
    return (
      <Text>RapidFire</Text>
    )
  }
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_800ExtraBold_Italic, Nunito_400Regular, Nunito_500Medium
  });
  if (!ContactsData || !fontsLoaded) {
    return <AppLoading />;
  } else {
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
            tabBarIcon: ({ color }) => (<Icon name='pencil-box-multiple' color={color} size={35} />)
          }} children={() => <Questions data={ContactsData} />} />
          <Tab.Screen name="Open" options={{
            tabBarStyle: { backgroundColor: "rgba(255, 255, 255, 0)", borderTopColor: 'transparent' },
            tabBarIcon: ({ color }) => (<Icon name='inbox' color={color} size={35} />)
          }} component={Open} />
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
