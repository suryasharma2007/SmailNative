import React, { useContext } from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import { ArrowLeft, Forward, ReplyAll, Verified } from 'lucide-react-native';
//import Exstyles from './Styles';
const { Store } = require('./AllPages');

import RenderHTML from 'react-native-render-html';

const Mail = ({ navigation }) => {
  const {
    Exstyles,
    footer,
    setFooter,
    myDetails,
    setMyDetails,
    readMail,
    setReadMail,
    Shimmer,
    formatMailTime,
    profileCache,
    setProfileCache,
  } = useContext(Store);

  const liveProfilePic = profileCache[readMail.senderUid]?.profilePic;

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.AlHadder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft style={Exstyles.lucideIcons} />
        </TouchableOpacity>
        <View style={Exstyles.flexRow}>
          <Text style={Exstyles.TextBasic} ellipsizeMode="tail">
            {readMail.name}
          </Text>

          {readMail.verified  && (
            <Verified
              fill="#1D9BF0"
              color="#FFFFFF"
              style={Exstyles.verifiedBadg}
            />
          )}
        </View>
        <View style={Exstyles.MMProfile}>
          {liveProfilePic ? (
            <Image style={Exstyles.MPic} source={{ uri: liveProfilePic }} />
          ) : (
            <Text style={Exstyles.TextBasic}>{readMail.name.charAt(0)}</Text>
          )}
        </View>
      </View>
      <View style={Exstyles.plainBlock}>
        {readMail.subject ? (
          <Text style={Exstyles.TextBasic}>{readMail.subject}</Text>
        ) : (
          <Shimmer />
        )}

        {readMail.time ? (
          <Text style={Exstyles.TextBasic}>
            {formatMailTime(readMail.time)}
          </Text>
        ) : (
          <Shimmer />
        )}
      </View>
      <View style={Exstyles.AlBody}>
        <View style={Exstyles.mailCard}>
          <View style={Exstyles.mailSubject}></View>
          <View style={[Exstyles.mailBody, Exstyles.TextBasic]}>
            {readMail.body ? (
              <RenderHTML
                tagsStyles={{
                  body: {
                    color: Exstyles.TextBasic.color,
                    fontSize: Exstyles.TextBasic.fontSize,
                  },
                  p: {
                    margin: 0,
                  },
                  div: {
                    color: Exstyles.TextBasic.color,
                  },
                }}
                source={{ html: readMail.body || '' }}
              />
            ) : (
              <Shimmer />
            )}
          </View>
          <View style={Exstyles.mailFrom}>
            {readMail.from ? (
              <Text style={Exstyles.TextBasic}>{readMail.from}</Text>
            ) : (
              <Shimmer />
            )}
          </View>
        </View>
      </View>

      <View style={Exstyles.AlFooter}>
        <TouchableOpacity>
          <View style={Exstyles.RFBtns}>
            <ReplyAll style={Exstyles.primaryIcons} />
            <Text style={Exstyles.primaryIcons}>Replay</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={Exstyles.RFBtns}>
            <Text style={Exstyles.primaryIcons}>forword</Text>
            <Forward style={Exstyles.primaryIcons} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Mail;
