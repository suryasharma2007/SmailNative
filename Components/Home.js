import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { UsersRound, Menu, Pen, Inbox, Book, Star } from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { Store } = require('./AllPages');

// Firebase imports

import {
  logoutUser,
  getUserDetails,
  listenForRealtimeEmails,
  getMessages,
  getPublicProfile,
} from './FireBase';

const Home = ({ navigation }) => {
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
  const [imageStatus, setImageStatus] = useState('');

  useEffect(() => {
    const loadCachedEmails = async () => {
      try {
        const saved = await AsyncStorage.getItem('emails');

        if (saved) {
          setEmails(JSON.parse(saved));
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
  // livePic catcher

  // ---------------------------
  // APP OPEN + MAIL FETCH
  // ---------------------------



  // ---------------------------
// CACHED EMAILS
// ---------------------------

useEffect(() => {
  const loadCachedEmails = async () => {
    try {
      const saved = await AsyncStorage.getItem('emails');

      if (saved) {
        const cachedData = JSON.parse(saved);

        const normalEmails = (cachedData || []).filter(
          mail => !mail.to?.includes('-group@smails.in')
        );

        setEmails(normalEmails);
      } else {
        setEmails([]);
      }
    } catch (err) {
      triggerAlert('Failed to load cached emails');
      setEmails([]);
    }
  };

  setBooleanValue({
    ...booleanValue,
    scheduleTimeShow: false,
  });

  loadCachedEmails();
}, []);


// ---------------------------
// APP OPEN + MAIL FETCH
// ---------------------------

useEffect(() => {
  let unsubscribeMessages;
  let unsubscribeRealtime;

  const loadMails = async () => {
    try {
      // ---------------------------
      // GET SAVED UID
      // ---------------------------

      const uid = await AsyncStorage.getItem('userUid');

      if (!uid) {
        setEmails([]);
        setGroupMails([]);

        triggerAlert('Please login to continue');

        navigation.navigate('Login');
        return;
      }

      setUserUid(uid);

      // ---------------------------
      // GET USER DETAILS
      // ---------------------------

      const userDetails = await getUserDetails(uid);

      if (!userDetails?.success) {
        triggerAlert('Failed to load user details');
        return;
      }

      const smail = userDetails.data?.smail;

      if (!smail) {
        triggerAlert('Email address not found');
        return;
      }

      // ---------------------------
      // SET USER DETAILS
      // ---------------------------

      setMyDetails({
        surName: userDetails.data?.surName || '',
        name: userDetails.data?.name || '',
        nickName: userDetails.data?.nickName || '',
        dob: userDetails.data?.dOB || '',
        gender: userDetails.data?.gender || '',
        purpose: userDetails.data?.usage || '',
        smail: userDetails.data?.smail || '',
        verified: userDetails.data?.verified === true,
        uid: userDetails.data?.uid || null,
        profilePic: userDetails.data?.profilePic || null,
      });

      // ---------------------------
      // REALTIME MAIL LISTENER
      // ---------------------------

      unsubscribeRealtime = listenForRealtimeEmails(
        smail,
        uid,
        mail => {
          // No console.log
        }
      );

      // ---------------------------
      // FETCH MAILS
      // ---------------------------

      unsubscribeMessages = getMessages(uid, async data => {
        try {
          const allMails = Array.isArray(data) ? data : [];

          // ---------------------------
          // GROUP MAILS
          // ---------------------------

          const groups = allMails.filter(mail =>
            mail?.to?.includes('-group@smails.in')
          );

          // ---------------------------
          // NORMAL MAILS
          // ---------------------------

          const normalEmails = allMails.filter(
            mail => !mail?.to?.includes('-group@smails.in')
          );

          // ---------------------------
          // UPDATE STATE
          // ---------------------------

          setGroupMails(groups);
          setEmails(normalEmails);

          // ---------------------------
          // CACHE ONLY NORMAL EMAILS
          // ---------------------------

          await AsyncStorage.setItem(
            'emails',
            JSON.stringify(normalEmails)
          );

        } catch (err) {
          triggerAlert('Failed to process emails');
        }
      });

    } catch (err) {
      triggerAlert('Failed to load emails');
    }
  };

  loadMails();

  // ---------------------------
  // CLEANUP
  // ---------------------------

  return () => {
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }

    if (unsubscribeRealtime) {
      unsubscribeRealtime();
    }
  };
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
            {liveProfilePic ? (
              <Image
                style={Exstyles.MPic}
                source={{ uri: liveProfilePic }}
                resizeMode="fill"
              />
            ) : (
              <View style={Exstyles.centerItem}>
                <Text style={{ fontWight: 'bold', fontSize: 26 }}>
                  {item.name?.charAt(0) || ''}
                </Text>
              </View>
            )}
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

  const userProfile = false;

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.HHadder}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MoreOptions')}
          style={Exstyles.HHbtns}
        >
          <Menu style={Exstyles.lucideIcons} />
        </TouchableOpacity>
        <View style={Exstyles.searchBlock}>
          <TextInput
            inlineImageLeft="search_icon"
            style={[Exstyles.TextBasic, Exstyles.searchInput]}
            placeholder="Search hare "
            placeholderTextColor={"gray"}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('GroupMails')}
          style={Exstyles.HHbtns}
        >
          <UsersRound style={Exstyles.lucideIcons} />
        </TouchableOpacity>
      </View>
      <View style={Exstyles.Hbody}>
        <View style={Exstyles.HmailList}>
          {(emails || []).length < 1 ? (
            <Shimmer style={Exstyles.HMShimmerCard} />
          ) : (
            <FlatList
              data={emails || []}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          )}
        </View>

        {footer && (
          <View style={Exstyles.Hfooter}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Compose')}
              style={Exstyles.HFMView}
            >
              <View style={Exstyles.HFbtns}>
                <Pen style={Exstyles.lucideIcons} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={Exstyles.HFMView}
            >
              <View style={Exstyles.HFbtns}>
                {true ? (
                  <Image
                    style={Exstyles.MPic}
                    source={{ uri: myDetails.profilePic }}
                  />
                ) : (
                  <Image
                    style={Exstyles.userProfilePic}
                    source={
                      !booleanValue.lightTheme
                        ? require('./assets/userblack.jpg')
                        : require('./assets/userblank.jpg')
                    }
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Home;

/*


cd smailNative 
npx react-native run-android

cd smailNative 
cd android
gradlew.bat clean
gradlew.bat bundleRelease


cd smailNative\android
gradlew clean
cd ..
npx react-native run-android



*/
