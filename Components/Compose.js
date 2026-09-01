import React, { useContext } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  ArrowUp,
  Calendar,
  DotSquare,
  EllipsisVertical,
} from 'lucide-react-native';
const { Store } = require('./AllPages');

//import Exstyles from './Styles';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// Firebase imports
import { sendSmail, scheduleSmail } from './FireBase';

const Compose = ({ navigation }) => {
  const {
    Exstyles,
    footer,
    setFooter,
    mailList,
    mailItem,
    setMailItem,
    alert,
    setAlert,
    show,
    setShow,
    showDatePicker,
    setShowDatePicker,
    pickerMode,
    setPickerMode,
    sendMails,
    setSendMails,
    booleanValue,
    setBooleanValue,
    userUid,
    triggerAlert,
  } = useContext(Store);

  const sendMailsHandleChange = (field, value) => {
    setSendMails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSend = async () => {
    setBooleanValue({
      ...booleanValue,
      sent: false,
    });
    if (!sendMails?.receiver || !sendMails?.subject || !sendMails?.message) {
      triggerAlert('Please fill all fields');
      setBooleanValue({
        ...booleanValue,
        sent: true,
      });
      return;
    }

    const finalRecipient = sendMails.receiver.toLowerCase().trim();

    try {
      let result;

      if (sendMails.scheduleTime) {
        const mailData = {
          to: finalRecipient,
          from: sendMails.senderEmail,
          subject: sendMails.subject,
          body: sendMails.message,
          name: sendMails.senderName,
          sendAt: sendMails.scheduleTime,
        };

        result = await scheduleSmail(userUid, mailData, sendMails.scheduleTime);
      } else {
        result = await sendSmail(
          finalRecipient,
          sendMails.senderEmail,
          sendMails.subject,
          sendMails.message,
          sendMails.senderName,
        );
      }

      if (result.success) {
        triggerAlert(
          sendMails.scheduleTime
            ? 'Smail Scheduled Successfully!'
            : 'Smail Sent!',
        );

        setSendMails({
          senderEmail: '',
          subject: '',
          message: '',
          senderName: '',
          receiver: '',
          scheduleTime: '',
        });

        navigation.navigate('Home');
        setBooleanValue({
          ...booleanValue,
          sent: true,
        });
      } else {
        triggerAlert('ErrorX: ' + result.error);
        setBooleanValue({
          ...booleanValue,
          sent: true,
        });
      }
    } catch (error) {
      setBooleanValue({
        ...booleanValue,
        sent: true,
      });
      triggerAlert('ErrorY: ' + error.message);
    }
  };

  const options = name => {
    setBooleanValue({
      ...booleanValue,
      optionShow: !booleanValue.optionShow,
    });
    if (name !== 'Option') {
      if (name === 'Settings') {
        navigation.navigate('Settings');
        setBooleanValue({
          ...booleanValue,
          scheduleTimeShow: false,
        });
      } else {
        setSendMails({
          ...sendMails,
          scheduleTime: '12:00',
        });
        setBooleanValue({
          ...booleanValue,
          optionShow: false,
          scheduleTimeShow: true,
        });
      }
    }
  };

  return (
    <View style={Exstyles.Alcontainer}>
      <View style={Exstyles.AlHadder}>
        <TouchableOpacity
          onPress={() => {
            setBooleanValue({
              ...booleanValue,
              optionShow: false,
              sent: true,
            });
            navigation.goBack();
          }}
        >
          <ArrowLeft style={Exstyles.lucideIcons} />
        </TouchableOpacity>
        <Text style={Exstyles.TextBasic}>Compose</Text>
        <View style={Exstyles.settings}>
          <TouchableOpacity onPress={() => options('Option')}>
            <EllipsisVertical style={Exstyles.lucideIcons} />
          </TouchableOpacity>
        </View>
      </View>
      {booleanValue.optionShow && (
        <View style={Exstyles.CMenu}>
          <TouchableOpacity onPress={() => options('ScheduleTime')}>
            <Text style={Exstyles.TextBasic}>Schedule Mail</Text>
          </TouchableOpacity>
          <Text></Text>
          <TouchableOpacity onPress={() => options('Settings')}>
            <Text style={Exstyles.TextBasic}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={Exstyles.AlBody}>
        {booleanValue.scheduleTimeShow && (
          <View style={Exstyles.dobContainer}>
            <TouchableOpacity
              style={Exstyles.enterInput}
              onPress={() => setPickerMode('date')}
            >
              <View style={Exstyles.dobBlock}>
                <Text style={Exstyles.TextBasic}>
                  {sendMails?.scheduleTime instanceof Date
                    ? sendMails.scheduleTime.toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Select Date & Time'}
                </Text>

                <Calendar style={Exstyles.lucideIcons} />
              </View>
            </TouchableOpacity>

            {/* DATE PICKER */}
            {pickerMode === 'date' && (
              <DateTimePicker
                placeholderTextColor="#888"
                value={
                  sendMails?.scheduleTime instanceof Date
                    ? sendMails.scheduleTime
                    : new Date()
                }
                mode="date"
                display="default"
                // Old dates disabled
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (event.type === 'dismissed') {
                    setPickerMode(null);
                    return;
                  }

                  if (!selectedDate) {
                    setPickerMode(null);
                    return;
                  }

                  // Selected date save
                  sendMailsHandleChange('scheduleTime', selectedDate);

                  // Immediately open time picker
                  setPickerMode('time');
                }}
              />
            )}

            {/* TIME PICKER */}
            {pickerMode === 'time' && (
              <DateTimePicker
                placeholderTextColor="#888"
                value={
                  sendMails?.scheduleTime instanceof Date
                    ? sendMails.scheduleTime
                    : new Date()
                }
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  if (event.type === 'dismissed') {
                    setPickerMode(null);
                    return;
                  }

                  if (!selectedTime) {
                    setPickerMode(null);
                    return;
                  }

                  const selectedDate = new Date(sendMails.scheduleTime);

                  selectedDate.setHours(
                    selectedTime.getHours(),
                    selectedTime.getMinutes(),
                    0,
                    0,
                  );

                  // Past date/time check
                  if (selectedDate.getTime() <= Date.now()) {
                    triggerAlert('Please select a future date & time');

                    setPickerMode(null);
                    return;
                  }

                  // Final Date + Time
                  sendMailsHandleChange('scheduleTime', selectedDate);

                  setPickerMode(null);
                }}
              />
            )}
          </View>
        )}
        <View style={Exstyles.composeInput}>
          <TextInput
            style={Exstyles.TextBasic}
            placeholderTextColor="#888"
            multiline={true}
            placeholder="Subject"
            value={sendMails?.subject || ''}
            onChangeText={text => sendMailsHandleChange('subject', text)}
          />
          <TextInput
            style={Exstyles.TextBasic}
            placeholderTextColor="#888"
            multiline={true}
            placeholder="Compose"
            numberOfLines={10}
            value={sendMails?.message || ''}
            onChangeText={text => sendMailsHandleChange('message', text)}
          />
        </View>
      </View>
      {alert.show && (
        <View style={Exstyles.alertContainer}>
          <View style={Exstyles.alertBox}>
            <Text style={Exstyles.alertText}>{alert.msg}</Text>
          </View>
        </View>
      )}
      <View style={Exstyles.AlFooter}>
        <Text style={Exstyles.TextBasic}>To</Text>
        <View style={Exstyles.mailInput}>
          <TextInput
            style={Exstyles.TextBasic}
            placeholderTextColor="#888"
            placeholder="Enter Receiver Mail"
            value={sendMails?.receiver || ''}
            onChangeText={text => sendMailsHandleChange('receiver', text)}
          />
        </View>
        <TouchableOpacity onPress={handleSend}>
          <View style={Exstyles.sendBtn}>
            {booleanValue.sent ? (
              <ArrowUp style={Exstyles.primaryIcons} />
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Compose;
