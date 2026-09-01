import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import styles from './Styles';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Login';
import Singup from './Singup';
import SingupFinish from './SingupFinish';
import Home from './Home';
import MoreOptions from './MoreOptions';
import GroupMails from './GroupMails';
import CreateGroup from './CreateGroup';
import Profile from './Profile';
import ManageSmail from './ProfileComponents/ManageSmail';
import HelpSupport from './ProfileComponents/HelpSupport';
import Settings from './ProfileComponents/Settings';
import UpdatePassword from './ProfileComponents/UpdatePassword';
import NewFeature from './ProfileComponents/NewFeature';
import Mail from './Mail';
import Compose from './Compose';
import mailList from './FireBase';

import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const Stack = createNativeStackNavigator();
export const Store = createContext();

//

import {} from '../index';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase imports
import { getPublicProfile } from './FireBase';

const AllPages = () => {
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('lightTheme');

      if (savedTheme !== null) {
        setBooleanValue(prev => ({
          ...prev,
          lightTheme: JSON.parse(savedTheme),
        }));
      }
    };

    loadTheme();
  }, []);

  const [loginData, setLoginData] = useState({
    loginEmail: '',
    loginPassword: '',
  });

  const [form, setForm] = useState({
    surName: '',
    name: '',
    nickName: '',
    dob: null,
    gender: '',
    purpose: '',
    smail: '',
    password: '',
  });

  const [footer, setFooter] = useState(true);
  const [fontColor, setFontColor] = useState('white');
  const [mailItem, setMailItem] = useState();
  const [emails, setEmails] = useState([]);
  const [groupMails, setGroupMails] = useState([]);
  const [readMail, setReadMail] = useState(null);
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(true);
  const [woringMsg, setWoringMsg] = useState('');
  const [userUid, setUserUid] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [profileCache, setProfileCache] = useState({});
  const [pickerMode, setPickerMode] = useState(null);
  const [booleanValue, setBooleanValue] = useState({
    optionShow: false,
    scheduleTimeShow: false,
    lightTheme: true,
    dull: true,
    loader: false,
    sent: true ,
  });
  const [myDetails, setMyDetails] = useState({
    surName: '',
    name: '',
    nickName: '',
    dob: null,
    gender: '',
    purpose: '',
    smail: '',
    verified: false,
    uid: null,
  });

  const [sendMails, setSendMails] = useState({
    senderEmail: '',
    subject: '',
    message: '',
    senderName: '',
    receiver: '',
    scheduleTime: '',
  });

  const [confirm, setConfirm] = useState({
    show: false,
    msg: '',
    onConfirm: null,
  });

  const [alert, setAlert] = useState({
    show: false,
    msg: '',
  });

  // Confirm & Alert

  // Alert
  const triggerAlert = msg => {
    setAlert({
      show: true,
      msg,
    });

    setTimeout(() => {
      setAlert({
        show: false,
        msg: '',
      });
    }, 3000);
  };

  const triggerConfirm = (msg, action) => {
    setConfirm({
      show: true,
      msg,
      onConfirm: action,
    });
  };

  const handleConfirmAction = () => {
    if (confirm.onConfirm) {
      confirm.onConfirm();
    }

    setConfirm({
      show: false,
      msg: '',
      onConfirm: null,
    });
  };

  const closeConfirm = () => {
    setConfirm({
      show: false,
      msg: '',
      onConfirm: null,
    });
  };

  const shimmerColors = booleanValue.lightTheme
    ? ['#d2d2d2', '#f7f7f7', '#d2d2d2']
    : ['#252525', '#3A3A3A', '#252525'];

  const Shimmer = props => (
    <ShimmerPlaceholder
      LinearGradient={LinearGradient}
      shimmerColors={shimmerColors}
      duration={1200}
      shimmerWidth={250}
      {...props}
    />
  );

  const formatMailTime = timestamp => {
    const date = timestamp?.toDate?.();

    if (!date) return '';

    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const isSameYear = date.getFullYear() === now.getFullYear();

    // Today → only time
    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    // Same year → date + month + time
    if (isSameYear) {
      return (
        date.toLocaleDateString([], {
          day: '2-digit',
          month: 'short',
        }) +
        ', ' +
        date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }

    // Different year → date + month + year + time
    return (
      date.toLocaleDateString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ', ' +
      date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  useEffect(() => {
    const loadProfiles = async () => {
      const cache = {};

      for (const mail of emails) {
        if (mail.senderUid && !cache[mail.senderUid]) {
          const result = await getPublicProfile(mail.senderUid);

          if (result.success) {
            cache[mail.senderUid] = result.data;
          }
        }
      }

      setProfileCache(cache);
    };

    if (emails.length > 0) {
      loadProfiles();
    }
  }, [emails]);

  const conformUI = () => {};

  const Exstyles = styles(booleanValue.lightTheme);
  return (
    <View style={Exstyles.Acontainer}>
      <Store.Provider
        value={{
          Exstyles,
          loginData,
          setLoginData,
          profileCache,
          setProfileCache,
          userUid,
          setUserUid,
          form,
          setForm,
          mailItem,
          setMailItem,
          fontColor,
          setFontColor,
          footer,
          setFooter,
          show,
          setShow,
          booleanValue,
          setBooleanValue,
          pickerMode,
          setPickerMode,
          showDatePicker,
          setShowDatePicker,
          errorMessage,
          setErrorMessage,
          confirm,
          setConfirm,
          alert,
          setAlert,
          agree,
          setAgree,
          woringMsg,
          setWoringMsg,
          sendMails,
          setSendMails,
          myDetails,
          setMyDetails,
          //
          mailList,
          emails,
          setEmails,
          groupMails,
          setGroupMails,
          readMail,
          setReadMail,
          // Functions
          formatMailTime,
          triggerAlert,
          triggerConfirm,
          closeConfirm,
          handleConfirmAction,
          conformUI,
          //Shimmer Card
          Shimmer,
        }}
      >
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Singup" component={Singup} />
            <Stack.Screen name="SingupFinish" component={SingupFinish} />
            <Stack.Screen name="MoreOptions" component={MoreOptions} />
            <Stack.Screen name="GroupMails" component={GroupMails} />
            <Stack.Screen name="CreateGroup" component={CreateGroup} />
            <Stack.Screen name="Mail" component={Mail} />
            <Stack.Screen name="Compose" component={Compose} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ManageSmail" component={ManageSmail} />
            <Stack.Screen name="HelpSupport" component={HelpSupport} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
            <Stack.Screen name="NewFeature" component={NewFeature} />
          </Stack.Navigator>
        </NavigationContainer>
      </Store.Provider>
    </View>
  );
};

export default AllPages;

// styling variables

export const Colors = true
  ? {
      bg: '#e1e1e1',
      fg: '#000000',
      cart: '#ffffff',
      primary: '#6200EE',
      text: '#212121',
      textSecondary: '#757575',
    }
  : {
      bg: '#1E1E1E',
      fg: '#FFFFFF',
      cart: '#121212',
      primary: '#BB86FC',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
    };

// export const Colors =  true ? {
//   bg: '#1E1E1E' ,
//   fg: '#FFFFFF',
//   cart:  '#121212' ,
//   primary: '#BB86FC',
//   text: '#FFFFFF',
//   textSecondary: '#B0B0B0',
// } :  {
//   bg: '#e1e1e1',
//   fg: '#000000',
//   cart: '#ffffff',
//   primary: '#6200EE',
//   text: '#212121',
//   textSecondary: '#757575',
// };
