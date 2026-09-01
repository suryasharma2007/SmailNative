import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, Forward, ReplyAll } from 'lucide-react-native';
//import Exstyles from "../Styles";

const { Store } = require('../AllPages');

const NewFeature = ({ navigation }) => {
  const { Exstyles, footer, setFooter, mailList, mailItem, setMailItem } =
    useContext(Store);

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.AlHadder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft style={Exstyles.lucideIcons} />
        </TouchableOpacity>
        <Text style={Exstyles.TextBasic}>NewFeature</Text>
        <View style={Exstyles.MProfile}></View>
      </View>

      <View style={Exstyles.AlBody}></View>

      <View style={Exstyles.AlFooter}></View>
    </View>
  );
};

export default NewFeature;
