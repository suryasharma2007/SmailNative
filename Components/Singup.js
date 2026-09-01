import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
//import Exstyles from './Styles';

const { Store } = require('./AllPages');

const Singup = ({ navigation }) => {
  const { form, setForm, agree , Exstyles , } =
    useContext(Store);

  const singupDataHandleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const singupSubmit = e => {
    e.preventDefault();
    if (form.surName && form.name && form.nickName && agree) {
      navigation.navigate('SingupFinish') ;
    } else {
    }
  };

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.AlHadder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft />
        </TouchableOpacity>
        <Text>Create Your Smail</Text>
        <View style={Exstyles.MSingup}></View>
      </View>

      <View style={[Exstyles.AlBody, Exstyles.centerItem]}>
        <View style={Exstyles.submitBlock}>
          <TextInput
          placeholderTextColor="#888"
            keyboardType="email-address"
            style={Exstyles.enterInput}
            placeholder="Enter Your Surname"
            value={form.surName}
            onChangeText={text => singupDataHandleChange('surName', text)}
          />
          <TextInput
          placeholderTextColor="#888"
            keyboardType="email-address"
            style={Exstyles.enterInput}
            placeholder="Enter Your Name"
            value={form.name}
            onChangeText={text => singupDataHandleChange('name', text)}
          />
          <TextInput
          placeholderTextColor="#888"
            keyboardType="email-address"
            style={Exstyles.enterInput}
            placeholder="Enter Your Nick Name"
            value={form.nickName}
            onChangeText={text => singupDataHandleChange('nickName', text)}
          />
          <TouchableOpacity
            onPress={singupSubmit}
            style={Exstyles.submitBtn}
          >
            <Text style={Exstyles.primaryIcons}>Next</Text>
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

export default Singup;
