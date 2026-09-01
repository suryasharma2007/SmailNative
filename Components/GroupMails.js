import React, { useContext, useEffect, useState } from 'react';

import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  UsersRound,
  Menu,
  Pen,
  Inbox,
  Book,
  Star,
  Group,
} from 'lucide-react-native';

const { Store } = require('./AllPages');

const GroupMails = ({ navigation }) => {
  const {
    Exstyles,
    footer,
    setFooter,
    mailList,
    mailItem,
    setMailItem,
    myDetails,
    setMyDetails,
    userUid,
    setUserUid,
    confirm,
    setConfirm,
    triggerAlert,
    emails,
    setEmails,
    groupMails,
    setGroupMails,
    readMail,
    setReadMail,
    triggerConfirm,
    closeConfirm,
    handleConfirmAction,
    booleanValue,
    setBooleanValue,
    Shimmer,
    formatMailTime,
    profileCache,
    setProfileCache,
  } = useContext(Store);

  const openMail = item => {
    setReadMail(item);
    navigation.navigate('Mail');
  };

  useEffect(() => {
    const loadCachedEmails = async () => {
      try {
        const saved = await AsyncStorage.getItem('groupMails');

        if (saved) {
          setGroupMails(JSON.parse(saved));
        }
      } catch (err) {
        triggerAlert('Failed to load emails:', err);
      }
    };

    setBooleanValue({
      ...booleanValue,

      scheduleTimeShow: false,
    });

    loadCachedEmails();
  }, []);

  const getMailPreview = (html = '') => {
    return (
      html
        // HTML tags remove
        .replace(/<[^>]*>/g, ' ')

        // numeric hex entities: &#x231B;
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
          String.fromCodePoint(parseInt(hex, 16)),
        )

        // numeric decimal entities: &#8987;
        .replace(/&#([0-9]+);/g, (_, dec) =>
          String.fromCodePoint(parseInt(dec, 10)),
        )

        // common HTML entities
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")

        // extra spaces/new lines
        .replace(/\s+/g, ' ')
        .trim()
    );
  };

  const myProfilePic = profileCache[userUid]?.profilePic;

  const renderItem = ({ item }) => {
    const liveProfilePic = profileCache[item.senderUid]?.profilePic;
    return (
      <View key={item.id} style={Exstyles.HmailItem}>
        <TouchableOpacity onPress={() => openMail(item)} style={Exstyles.HMail}>
          <View style={Exstyles.MProfile}>
                <Text style={Exstyles.TextBasic}>
                  {item.name.charAt(0) || ''}
                </Text>  
          </View>
          <View style={Exstyles.mailTextBox}>
            <Text style={Exstyles.HmailSubject} ellipsizeMode="tail">
              {item.name || ''}
            </Text>
            <Text style={Exstyles.HmailSender} ellipsizeMode="tail">
              {item.subject || ''}
            </Text>
            <Text style={Exstyles.HmailBody} numberOfLines={1}>
              {getMailPreview(item.body) || ''}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={Exstyles.HMView}>
          <View style={Exstyles.timeBlock}>
            <Star style={Exstyles.lucideIcons} />
            <Text style={Exstyles.mailTime} ellipsizeMode="tail">
              {formatMailTime(item.time) || ''}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.AlHadder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft style={Exstyles.lucideIcons} />
        </TouchableOpacity>
        <Text style={Exstyles.TextBasic}>GroupMails</Text>
        <Text></Text>
      </View>

      <View style={Exstyles.Hbody}>
        <View style={Exstyles.HmailList}>
          {(groupMails || []).length < 1 ? (
            <Shimmer style={Exstyles.HMShimmerCard} />
          ) : (
            <FlatList
              data={groupMails || []}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          )}
        </View>
        {alert.show && (
          <View style={Exstyles.alertContainer}>
            <View style={Exstyles.alertBox}>
              <Text style={Exstyles.alertText}>{alert.msg}</Text>
            </View>
          </View>
        )}
        {footer && (
          <View style={Exstyles.Hfooter}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={Exstyles.HFMView}
            >
              <View style={Exstyles.HFbtns}>
                <Inbox style={Exstyles.lucideIcons} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('CreateGroup')}
              style={Exstyles.HFMView}
            >
              <View style={Exstyles.HFbtns}>
                <Group style={Exstyles.lucideIcons} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default GroupMails;
