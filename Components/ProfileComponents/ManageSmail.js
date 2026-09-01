import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  AtSign,
  Badge,
  CalendarRange,
  Forward,
  Heart,
  Mail,
  Pen,
  Pencil,
  Plus,
  ReplyAll,
  Target,
  User,
  VenusAndMars,
} from 'lucide-react-native';

import { launchImageLibrary } from 'react-native-image-picker';

// FireBase import

import { updateUserProfile, uploadProfilePicture } from '../FireBase';

const { Store } = require('../AllPages');

const ManageSmail = ({ navigation }) => {
  const {
    Exstyles,
    footer,
    setFooter,
    mailList,
    mailItem,
    setMailItem,
    myDetails,
    setMyDetails,
    booleanValue,
    setBooleanValue,
    alert,
    show,
    userUid,
    //
    profileCache,
    triggerAlert,
  } = useContext(Store);

  const editProfileChange = (field, value) => {
    setMyDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const detileName = [
    'SurName',
    'Name',
    'NickName',
    'Date Of Birth',
    'Gender',
    'Purpose To Use',
    'Smail',
  ];

  const handleUpdate = async () => {
    try {
      setBooleanValue({
        ...booleanValue ,
        loader: true ,
      })

      const res = await updateUserProfile(userUid, myDetails);

      //console.log('UPDATE RESPONSE:', res);

      if (res.success) {
        triggerAlert('Profile Updated Successfully! ✨');
        setBooleanValue(prev => ({
          ...prev,
          loader: false ,
        }))
        setTimeout(() => {
          navigation.navigate('Profile');
        }, 1500);
      } else {
        triggerAlert('Update Failed: ' + res.error);
        //console.log('UPDATE ERROR:', res.error);
      }
    } catch (error) {
      //console.log('HANDLE UPDATE ERROR:', error);
      triggerAlert(error.message || 'Something went wrong');
    }
  };

  // Regenerate Recovery Code
  //   const handleRegenerate = () => {
  //     triggerConfirm(
  //       "Generate a new recovery code?",
  //       async () => {
  //         try {
  //           const newCode = crypto.randomUUID()
  //             .replace(/-/g, "")
  //             .slice(0, 12)
  //             .toUpperCase();

  //           const encoder = new TextEncoder();
  //           const encodedData = encoder.encode(newCode);
  //           const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);

  //           const recoveryCodeHash = Array.from(new Uint8Array(hashBuffer))
  //             .map((b) => b.toString(16).padStart(2, "0"))
  //             .join("");

  //           setIsLoading(true);
  //           const res = await window.updateUserProfile(
  //   userUid,
  //   {
  //     recoveryCode: newCode,
  //     recoveryCodeHash
  //   }
  // );
  //           setIsLoading(false);

  //           if (res.success) {

  //   setRecoveryCode(
  //     newCode
  //   );

  //   setDisplayRecoveryCode(
  //     "••••••••••••"
  //   );

  //   setCanCopyRecoveryCode(
  //     true
  //   );

  //   triggerAlert(
  //     "New Recovery Code Generated. Copy and save it safely."
  //   );

  // } else {

  //   triggerAlert(
  //     "Failed to Update Code"
  //   );

  // }
  //         } catch (error) {
  //           console.log(error);
  //           setIsLoading(false);
  //           triggerAlert("Something went wrong");
  //         }
  //       }
  //     );
  //   };

  const pickImage = async () => {

    setBooleanValue(prev => ({
          ...prev,
          loader: true ,
        }))

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel) return;

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        triggerAlert('Image not selected');
        return;
      }

      const file = {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `profile_${Date.now()}.jpg`,
      };

      const res = await uploadProfilePicture(userUid, file);

      if (res.success) {
        triggerAlert('Profile Picture Updated ✨');
        
        // UI lo immediate-ga image chupinchadaniki
        setMyDetails(prev => ({
          ...prev,
          profilePic: res.url,
        }));
      } else {
        triggerAlert(res.error || 'Profile picture update failed');
      }
    } catch (error) {
      triggerAlert(error.message || 'Something went wrong');
    }
    setBooleanValue(prev => ({
          ...prev,
          loader: false ,
        }))
  };

  const renderItem = ({ item, index }) => {
    const id = index++;
    const getIcon = () => {
      switch (index) {
        case 1:
          return (
            <Badge
              style={[
                booleanValue.dull
                  ? Exstyles.SecondryText
                  : Exstyles.lucideIcons,
              ]}
            />
          );

        case 2:
          return (
            <User
              style={[
                booleanValue.dull
                  ? Exstyles.SecondryText
                  : Exstyles.lucideIcons,
              ]}
            />
          );

        case 3:
          return (
            <AtSign
              style={[
                booleanValue.dull
                  ? Exstyles.SecondryText
                  : Exstyles.lucideIcons,
              ]}
            />
          );

        case 4:
          return (
            <CalendarRange
              style={[
                booleanValue.dull
                  ? Exstyles.SecondryText
                  : Exstyles.lucideIcons,
              ]}
            />
          );
        case 5:
          return (
            <VenusAndMars
              style={[
                booleanValue.dull
                  ? Exstyles.SecondryText
                  : Exstyles.lucideIcons,
              ]}
            />
          );
        case 6:
          return (
            <Target
              style={[
                booleanValue.dull
                  ? Exstyles.SecondryText
                  : Exstyles.lucideIcons,
              ]}
            />
          );
        default:
          return (
            <Mail
              style={[
                booleanValue.dull
                  ? Exstyles.SecondryText
                  : Exstyles.lucideIcons,
              ]}
            />
          );
      }
    };
    
    return (
      <View style={Exstyles.EPItemContainer}>
        <Text style={Exstyles.SecondryText}>{detileName[index - 1]}</Text>

        <View style={Exstyles.EPItem}>
          <TextInput
            style={Exstyles.TextBasic}
            value={myDetails[item] || ''}
            onChangeText={text => editProfileChange(item, text)}
            editable={item === 'smail' ? false : !booleanValue.dull}
          />
          {getIcon()}
        </View>
      </View>
    );
  };

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.AlHadder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft style={Exstyles.lucideIcons} />
        </TouchableOpacity>
        <Text style={Exstyles.TextBasic}>Manage Smail</Text>
        <TouchableOpacity
          onPress={() =>
            setBooleanValue({
              ...booleanValue,
              dull: !booleanValue.dull,
            })
          }
        >
          <Pencil style={Exstyles.lucideIcons} />
        </TouchableOpacity>
      </View>

      <View style={Exstyles.AlBody}>
        <View style={{ flex: 1 }}>
          <View style={Exstyles.EPPicContainer}>
            <Text />
            <View
              style={[
                Exstyles.BigProfile,
                { marginBottom: 40, marginLeft: 10 },
              ]}
            >
              {booleanValue.loader ?
               <View style={Exstyles. centerItem} >
                 <ActivityIndicator size={100} />
                </View> :
                <Image
                style={Exstyles.MPic}
                source={{ uri: myDetails.profilePic }}
              /> 
              }
            </View>
            <TouchableOpacity disabled={booleanValue.dull} onPress={pickImage}>
              <Plus
                style={[
                  booleanValue.dull
                    ? Exstyles.SecondryText
                    : Exstyles.lucideIcons,
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 8 }}>
            <FlatList
              data={[
                'surName',
                'name',
                'nickName',
                'dob',
                'gender',
                'purpose',
                'smail',
              ]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={handleUpdate}
                style={Exstyles.submitBtn}
                disabled={booleanValue.loader}
              >
                {booleanValue.loader ? 
                <ActivityIndicator color="#fff"  />
                  : <Text style={Exstyles.primaryIcons}>Save</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {alert.show && (
        <View style={Exstyles.alertContainer}>
          <View style={Exstyles.alertBox}>
            <Text style={Exstyles.alertText}>{alert.msg}</Text>
          </View>
        </View>
      )}
      <View style={Exstyles.AlPFooter}></View>
    </View>
  );
};

export default ManageSmail;
