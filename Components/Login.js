import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ArrowLeft, Eye, EyeOff, Forward, ReplyAll } from 'lucide-react-native';
//import Exstyles from './Styles';

// Firebase imports
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loginUserToFirebase } from './FireBase';

const { Store } = require('./AllPages');

const Login = ({ navigation }) => {
  const {
    Exstyles,
    show,
    setShow,
    loginData,
    setLoginData,
    errorMessage,
    setErrorMessage,
    confirm,
    setConfirm,
    alert,
    setAlert,
    triggerAlert,
    userUid,
    setUserUid,
  } = useContext(Store);

  const smail = 'surya6@smails.in';
  const password = '66lakshmi66';

  const loginDataHandleChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // const loginChack = () => {
  //   setErrorMessage('');
  //   if (loginData.loginEmail === smail) {
  //     if (loginData.loginPassword === password) {
  //       navigation.navigate('Home');
  //     } else {
  //       setErrorMessage('Wrong Password!!');
  //     }
  //   } else {
  //     if (loginData.loginEmail === '') {
  //       setErrorMessage('');
  //     } else {
  //       setErrorMessage('This Smail Is Not Exist');
  //     }
  //   }
  // };

  const handleLogin = async () => {
    if (!loginData.loginEmail || !loginData.loginPassword) {
      triggerAlert('Please enter both Smail and Password!');
      return;
    }

    const email = loginData.loginEmail.toLowerCase().trim();
    const password = loginData.loginPassword.trim();

    try {
      const result = await loginUserToFirebase(email, password);

      if (result.success) {
        // Firebase UID save
        await AsyncStorage.setItem('userUid', result.uid);

        // Context lo kuda save
        setUserUid(result.uid);

        // Home
        navigation.navigate('Home');
      } else {
        triggerAlert('Login Error: ' + result.error);
      }
    } catch (error) {
      console.log('LOGIN ERROR:', error);

      triggerAlert('Login failed. Please try again.');
    }
  };

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.AlHadder}>
        <Text style={Exstyles.TextBasic}>Login</Text>
      </View>

      <View style={[Exstyles.AlBody, Exstyles.centerItem]}>
        <View style={Exstyles.submitBlock}>
          <TextInput
            keyboardType="email-address"
            style={Exstyles.enterInput}
            placeholderTextColor="#888"
            placeholder="Enter Your Smail"
            value={loginData.loginEmail}
            onChangeText={text => loginDataHandleChange('loginEmail', text)}
          />

          <View style={Exstyles.passwordBlock}>
            <TextInput
              secureTextEntry={!show}
              style={Exstyles.marginAround}
              placeholderTextColor="#888"
              placeholder="Enter Your Password"
              value={loginData.loginPassword}
              onChangeText={text =>
                loginDataHandleChange('loginPassword', text)
              }
            />
            <TouchableOpacity onPress={() => setShow(!show)}>
              {show ? (
                <Eye style={Exstyles.marginAround} />
              ) : (
                <EyeOff style={Exstyles.marginAround} />
              )}
            </TouchableOpacity>
          </View>
          {true && <Text style={Exstyles.errorMsg}>{errorMessage || ' '}</Text>}
          <TouchableOpacity onPress={handleLogin} style={Exstyles.submitBtn}>
            <Text style={Exstyles.primaryIcons}>Login</Text>
          </TouchableOpacity>
          <View style={Exstyles.textBlock}>
            <TouchableOpacity>
              <Text style={Exstyles.textLink}> I Forget My Password </Text>
            </TouchableOpacity>
          </View>
        </View>
        {alert.show && (
          <View style={Exstyles.alertContainer}>
            <View style={Exstyles.alertBox}>
              <Text style={Exstyles.alertText}>{alert.msg}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={Exstyles.AlFooter}>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Singup')}>
            <Text>I Don't Have Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
