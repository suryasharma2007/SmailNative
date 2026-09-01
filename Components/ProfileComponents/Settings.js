import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  ArrowLeft,
  Forward,
  Moon,
  PowerIcon,
  PowerOff,
  ReplyAll,
  Shield,
  Sun,
} from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { Store } = require('../AllPages');

// FirBase imports

import { logoutUser } from '../FireBase';

const Settings = ({ navigation }) => {
  const {
    Exstyles,
    footer,
    setFooter,
    mailList,
    mailItem,
    setMailItem,
    confirm,
    setConfirm,
    booleanValue,
    setBooleanValue,
    show,
    setShow,
    conformUI,
    triggerConfirm,
    closeConfirm,
    handleConfirmAction,
  } = useContext(Store);

  const changeTheme = async () => {
    const newValue = !booleanValue.lightTheme;

    setBooleanValue(prev => ({
      ...prev,
      lightTheme: newValue,
    }));

    await AsyncStorage.setItem('lightTheme', JSON.stringify(newValue));
  };

  const handleLogout = () => {
    triggerConfirm('Are you sure you want to logout?', async () => {
      const result = await logoutUser();

      if (result.success) {
        navigation.navigate('Login');
      }
    });
  };

  const OptionCard = [
    { id: 1, name: 'Password' },
    { id: 2, name: 'Theme' },
    { id: 3, name: 'SingOut' },
  ];

  const trigerFunction = name => {
    if (name === 'Password') {
      navigation.navigate('UpdatePassword');
    }
    if (name === 'SingOut') {
      handleLogout();
    }
    if (name === 'Theme') {
      changeTheme();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => trigerFunction(item.name)}>
        <View style={Exstyles.SettingsOptions}>
         
          <Text
            style={
              item.name === 'SingOut' ? { color: 'red' } : Exstyles.TextBasic
            }
          >
            {item.name}
          </Text>
           {item.name === "Password" &&
            <Shield style={Exstyles.lucideIcons} /> 
          }
          {item.name === 'Theme' && (
            booleanValue.lightTheme ? <Moon style={Exstyles.lucideIcons} /> : <Sun style={Exstyles.lucideIcons} />
          ) }
           {item.name === "SingOut" &&
            <PowerIcon style={Exstyles.lucideIcons} /> 
          }
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.AlHadder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft style={Exstyles.lucideIcons} />
        </TouchableOpacity>
        <Text style={Exstyles.TextBasic}>Settings</Text>
        <Text></Text>
      </View>

      <View style={Exstyles.AlBody}>
        <View style={Exstyles.PCardContainer}>
          <FlatList
            data={OptionCard}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>
      {confirm.show && (
        <View style={Exstyles.alertOverlay}>
          <View style={Exstyles.confirmBox}>
            <Text style={Exstyles.confirmTitle}>Confirm</Text>

            <Text style={Exstyles.confirmMessage}>{confirm.msg}</Text>

            <View style={Exstyles.confirmButtons}>
              <TouchableOpacity
                style={Exstyles.cancelButton}
                onPress={closeConfirm}
              >
                <Text style={Exstyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={Exstyles.confirmButton}
                onPress={handleConfirmAction}
              >
                <Text style={Exstyles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View style={Exstyles.AlFooter}></View>
    </View>
  );
};

export default Settings;
