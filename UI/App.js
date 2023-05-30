import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import 'react-native-gesture-handler';



import LoginNavigationStack from './Components/LoginStack';

import TabNavigation from './Components/TabNavigation';
import DrawerNavigator from './Components/DrawerNavigation';
import { Linking } from "react-native";
import "./global/global";
import { IPAddress } from "./global/global";
import UserProfileStack from "./Components/UserProfileStack";

import 'react-native-console-time-polyfill';
import ForgotPassword from "./Screens/ForgotPassword";
import ForgotPasswordStack from "./Components/ForgotPasswordStack";


const AppStack = createNativeStackNavigator();

export default function App() {

  // const navigation = useNavigation()
  // const {isLoading, userToken} = useContext(AuthContext);

  // if(isLoading) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size={"large"} />
  //     </View>
  //   );
  // }

  // get notification access/token
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>{
      setExpoPushToken(token)
      global.deviceExpoPushToken = token;

      fetch(`https://hanaplingkod.onrender.com/setToken/${global.userData._id}`, {
          method: "PUT",
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            pushtoken: token
          })
        }).then(() => console.log("all notification read"))
        .catch((error) => console.log("notification app js error: ", error.message))
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("new notification")
      });
    
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    

    // return () => {
    //   Notifications.removeNotificationSubscription(notificationListener.current);
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };

    return () => { 
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
    
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);


// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }
  
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//         alert('Failed to get push token for push notification!');
//         return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//   }

//     if (Platform.OS === 'android') {
//       Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }

//     return token;

// }

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getDevicePushTokenAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

  return (
      <NavigationContainer>
        <AppStack.Navigator initialRouteName="LoginNavigationStack" screenOptions={{headerShown: false}} >
          <AppStack.Screen name="LoginNavigationStack" component={LoginNavigationStack} /> 
          <AppStack.Screen name="DrawerNavigation" component={DrawerNavigator} /> 
          <AppStack.Screen name="UserProfileStack" component={UserProfileStack} /> 
          <AppStack.Screen name="ForgotPasswordStack" component={ForgotPasswordStack} /> 
        </AppStack.Navigator>
      </NavigationContainer>
  );
}

