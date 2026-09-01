import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ArrowLeft, Calendar, Eye, EyeOff } from 'lucide-react-native';
//import Exstyles from './Styles';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { Store } = require('./AllPages');

// Firebase imports
import { registerUserToFirebase } from './FireBase';

const SingupFinish = ({ navigation }) => {
  const {
    Exstyles ,
    show,
    setShow,
    form,
    setForm,
    agree,
    showDatePicker,
    setShowDatePicker,
    woringMsg,
    setWoringMsg,
    triggerAlert,
  } = useContext(Store);

  const singupDataHandleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const singupSubmit = async () => {
    // Final smail address format
    const finalSmail = form.smail + '@smails.in';

    if (
      form.purpose &&
      form.gender &&

      form.smail &&
      form.password &&
      agree
    ) {
      // Form data prepare cheyadam
      const userData = { ...form, smail: finalSmail };

      // Firebase Signup Function call
      const result = await registerUserToFirebase(userData);

      if (result.success) {
        triggerAlert('Smail Account Created Successfully!');
        navigation.navigate('Login');
        setShowDatePicker(false) ;
        location.reload();
      } else {
        setWoringMsg(result.error); // Firebase error (e.g., email already exists)
        //setToggle(false);
      }
    } else {
      setWoringMsg("Don't leave empty and read T&C");
      //setToggle(false);
    }
  };

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.AlHadder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft />
        </TouchableOpacity>
        <Text>Create Your Smail</Text>
        <View style={Exstyles.MSingupFinish}></View>
      </View>

      <View style={[Exstyles.AlBody, Exstyles.centerItem]}>
        <View style={Exstyles.submitBlock}>
          <View style={Exstyles.pickerContainer}>
            <View style={Exstyles.pickerBlock}>
              <Picker
                selectedValue={form.gender}
                onValueChange={text => singupDataHandleChange('gender', text)}
              >
                <Picker.Item label="Gender" value=" " />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Others" value="others" />
              </Picker>
            </View>

            <View style={Exstyles.pickerBlock}>
              <Picker
                selectedValue={form.purpose}
                onValueChange={text => singupDataHandleChange('purpose', text)}
              >
                <Picker.Item label="Purpose" value=" " />
                <Picker.Item label="Casual" value="casual" />
                <Picker.Item label="Business" value="business" />
                <Picker.Item label="Child" value="child" />
              </Picker>
            </View>
          </View>
          <View style={Exstyles.dobContainer}>
            <TouchableOpacity
              style={Exstyles.enterInput}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={Exstyles.dobBlock}>
                <Text>
                  {form.dob instanceof Date
                    ? form.dob.toLocaleDateString('en-IN')
                    : 'Select Date of Birth'}
                </Text>

                <Calendar />
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={form.dob instanceof Date ? form.dob : new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);

                  if (selectedDate) {
                    singupDataHandleChange('dob', selectedDate);
                  }
                }}
              />
            )}
          </View>
          <TextInput
          placeholderTextColor="#888"
            keyboardType="email-address"
            style={Exstyles.enterInput}
            placeholder="Create Your Smail"
            value={form.smail}
            onChangeText={text => singupDataHandleChange('smail', text)}
          />
          <View style={Exstyles.passwordBlock}>
            <TextInput
            placeholderTextColor="#888"
              secureTextEntry={!show}
              style={Exstyles.marginAround}
              placeholder="Create Your Password"
              value={form.password}
              onChangeText={text => singupDataHandleChange('password', text)}
            />
            <TouchableOpacity onPress={() => setShow(!show)}>
              {show ? (
                <Eye style={Exstyles.marginAround} />
              ) : (
                <EyeOff style={Exstyles.marginAround} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={singupSubmit} style={Exstyles.submitBtn}>
            <Text style={Exstyles.primaryIcons}>Submit</Text>
          </TouchableOpacity>

          <View style={Exstyles.textBlock}>
            <TouchableOpacity>
              <Text style={Exstyles.textLink}>
                {' '}
                Read T&C Before create your account{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text>{woringMsg}</Text>
      
      <View style={Exstyles.AlFooter}>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text>Login Your Account </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SingupFinish;
