import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {
  ArrowLeft,
  Forward,
  HelpCircle,
  Pen,
  ReplyAll,
  Settings,
  SlidersHorizontal,
  Sparkle,
} from 'lucide-react-native';
//import Exstyles from './Styles';

const { Store } = require('./AllPages');

const Profile = ({ navigation }) => {
  const {
    Exstyles,
    footer,
    setFooter,
    userUid,
    myDetails,
    setMyDetails,
    profileCache,
  } = useContext(Store);

  //     const result = await setUserVerified(
  //   'w07LFALewFdkcUYTZYKJRzTyujT2',
  //   true
  // );

  // if (result.success) {
  //   // verified successfully
  // }

  const OptionCard = [
    { id: 1, name: 'Manage Your Smail', page: 'ManageSmail' },
    { id: 2, name: 'Help & Support', page: 'HelpSupport' },
    { id: 3, name: 'Settings', page: 'Settings' },
    { id: 4, name: 'New Feature', page: 'NewFeature' },
  ];
  const icons = ['Pen', 'HelpCircle', 'Settings', 'Sparkle'];
  const renderItem = ({ item }) => {
    const getIcon = () => {
      switch (item.id) {
        case 1:
          return <SlidersHorizontal style={Exstyles.lucideIcons} />;

        case 2:
          return <HelpCircle style={Exstyles.lucideIcons} />;

        case 3:
          return <Settings style={Exstyles.lucideIcons} />;

        default:
          return <Sparkle style={Exstyles.lucideIcons} />;
      }
    };
    return (
      <TouchableOpacity onPress={() => navigation.navigate(item.page)}>
        <View style={Exstyles.POPtionCards}>
          <Text style={Exstyles.TextBasic}>{item.name}</Text>
          {getIcon()}
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
        <Text style={Exstyles.TextBasic}>
          {`Hey ${myDetails.nickName}` || 'Loading...'}
        </Text>
        <Text></Text>
      </View>

      <View style={Exstyles.AlBody}>
        <View style={Exstyles.PPicContainer}>
          <View style={Exstyles.BigProfile}>
            <Image
              style={Exstyles.MPic}
              source={{ uri: myDetails.profilePic }}
            />
          </View>
        </View>
        <View style={Exstyles.PCardContainer}>
          <FlatList
            data={OptionCard}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>

      <View style={Exstyles.AlFooter}>
        <Text style={Exstyles.TextBasic} >{myDetails?.smail || 'Loading...'}</Text>
      </View>
    </View>
  );
};

export default Profile;
