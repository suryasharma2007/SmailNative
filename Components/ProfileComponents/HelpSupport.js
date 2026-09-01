import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  ArrowLeft,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Send,
  Mail,
} from 'lucide-react-native';

const { Store } = require('../AllPages');

const HelpAndFeedback = ({ navigation }) => {
  const { triggerAlert, Exstyles } = useContext(Store);

  const [openFaq, setOpenFaq] = useState(null);
  const [feedback, setFeedback] = useState('');

  const faqs = [
    {
      q: 'How to schedule a Smail?',
      a: "Go to 'Compose', write your message, and click the 'Clock' icon to set your preferred time.",
    },
    {
      q: 'Where can I see deleted mails?',
      a: "All deleted mails are moved to the 'Bin' folder. You can restore them or delete them permanently from there.",
    },
    {
      q: 'How to create custom labels?',
      a: "Open the sidebar, click on 'Add Label', enter a name, and your new category is ready to use.",
    },
  ];

  const toggleFaq = index => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      return triggerAlert('Please write something first!');
    }

    //setIsLoading(true);

    setTimeout(() => {
      //setIsLoading(false);
      triggerAlert('Thank you! Feedback sent. ✨');
      setFeedback('');
    }, 1500);
  };

  return (
    <View style={Exstyles.Alcontainer}>
      {/* Header */}
      <View style={Exstyles.tmpHadder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft style={Exstyles.lucideIcons} />
        </TouchableOpacity>
        <Text style={Exstyles.TextBasic}>Settings</Text>
        <Text></Text>
      </View>

      {/* Content */}
      <ScrollView
        style={Exstyles.AlBody}
        contentContainerStyle={Exstyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={Exstyles.helpContainer}>
          {/* FAQ Title */}
          <View style={Exstyles.sectionTitle}>
            <HelpCircle size={18} style={Exstyles.lucideIcons} />

            <Text style={Exstyles.sectionTitleText}>Common Questions</Text>
          </View>

          {/* FAQ List */}
          <View style={Exstyles.faqList}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <TouchableOpacity
                  key={index}
                  style={[Exstyles.faqCard, isOpen && Exstyles.faqCardActive]}
                  onPress={() => toggleFaq(index)}
                  activeOpacity={0.8}
                >
                  <View style={Exstyles.faqQuestion}>
                    <Text style={Exstyles.questionText}>{faq.q}</Text>

                    <ChevronDown
                      size={18}
                      style={[
                        Exstyles.lucideIcons,
                        isOpen ? Exstyles.arrowOpen : Exstyles.arrow,
                      ]}
                    />
                  </View>

                  {isOpen && <Text style={Exstyles.faqAnswer}>{faq.a}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Divider */}
          <View style={Exstyles.divider} />

          {/* Feedback Title */}
          <View style={Exstyles.sectionTitle}>
            <MessageSquare size={18} style={Exstyles.lucideIcons} />

            <Text style={Exstyles.sectionTitleText}>Send Feedback</Text>
          </View>

          {/* Feedback Box */}
          <View style={Exstyles.feedbackBox}>
            <TextInput
              style={Exstyles.feedbackInput}
              placeholder="Tell us what we can improve..."
              placeholderTextColor="#888"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={Exstyles.sendButton}
              onPress={handleFeedbackSubmit}
              activeOpacity={0.8}
            >
              <Send size={16} style={Exstyles.lucideIcons} />

              <Text style={Exstyles.sendButtonText}>Send Feedback</Text>
            </TouchableOpacity>
          </View>

          {/* Contact */}

          <TouchableOpacity>
            <View style={Exstyles.contactCard}>
              <Mail size={20} style={Exstyles.lucideIcons} />

              <View style={Exstyles.contactText}>
                <Text style={Exstyles.contactTitle}>Need more help?</Text>

                <Text style={Exstyles.email}>Smails@smails.in</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpAndFeedback;
