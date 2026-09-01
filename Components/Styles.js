//import React , {useContext ,  useState} from "react";
import { StyleSheet } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
//import { Colors } from './AllPages';

export const getColors = lightTheme => ({
  bg: lightTheme ? '#e1e1e1' : '#1E1E1E',
  fg: lightTheme ? '#000000' : '#FFFFFF',
  cart: lightTheme ? '#ffffff' : '#121212',
  primary: lightTheme ? '#6200EE' : '#BB86FC',
  text: lightTheme ? '#212121' : '#FFFFFF',
  textSecondary: lightTheme ? '#757575' : '#B0B0B0',
  Shimmer: lightTheme ? '#d2d2d2' : '#252525',
});

const styles = isLight => {
  const Colors = getColors(isLight);

  return StyleSheet.create({
    // app container
    container: {
      flex: 1,
      //alignItems: "center",
      //justifyContent:"center" ,
      backgroundColor: Colors.bg,
      color: Colors.text,
      borderWidth: 2,
    },
    // all pages container
    Acontainer: {
      flex: 1,
      //b
    },
    // home container
    Alcontainer: {
      flex: 1,
      backgroundColor: Colors.bg,
      padding: 5,
    },
    TextBasic: {
      color: Colors.text,
    },
    // hadder block
    HHadder: {
      flex: 1,
      flexDirection: 'row',
      //padding: 10,
      margin: 5,
      borderRadius: 25,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingBottom: 5,
    },
    tmpHadder: {
      flex: 0.2,
      flexDirection: 'row',
      //padding: 10,
      margin: 5,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 5,
    },

    HHbtns: {
      height: 50,
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
    searchBlock: {
      paddingLeft: 10,
      alignItems: 'flex-start',
      justifyContent: 'center',
      height: 60,
      width: 260,
      // borderWidth: 2,
      borderRadius: 110,
      backgroundColor: Colors.cart,
    },
    searchInput: {
      padding: 10,
      color: 'white',
    },
    // body block
    Hbody: {
      flex: 9,
      backgroundColor: Colors.bg,
    },
    // Mail list and Mail card
    HmailList: {
      flex: 8,
      marginTop: 20,
      backgroundColor: Colors.bg,
    },
    MProfile: {
      height: 50,
      width: 50,
      borderRadius: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: Colors.primary,
    },
    MMProfile: {
      height: 40,
      width: 40,
      borderRadius: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: Colors.primary,
    },
    MPic: {
      //flex: 1 ,
      width: '100%',
      height: '100%',
    },
    lucideIcons: {
      color: Colors.fg,
    },
    HmailItem: {
      flexDirection: 'row',
      padding: 10,
      height: 80,
      backgroundColor: Colors.cart,
      margin: 2,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'space-between',
      //borderWidth: 2,
    },
    HMShimmerCard: {
      height: 80,
      width: '100%',
      margin: 2,
      backgroundColor: Colors.Shimmer,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    HMail: {
      // borderWidth: 2 ,
      flex: 3.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'white',
    },
    mailCard: {
      // borderWidth: 2 ,
      flex: 1,
      backgroundColor: Colors.cart,
      borderRadius: 20,
    },

    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    verifiedBadg: {
      margin: 2,
      borderRadius: '50%',
      fontSize: 10,

      //backgroundColor: Colors.primary ,
    },
    mailSubject: {
      flex: 1,
    },
    mailBody: {
      flex: 8,
      padding: 10,
      color: Colors.text,
    },
    mailFrom: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mailTextBox: {
      flex: 1,
      marginLeft: 20,
    },
    HmailSubject: {
      flex: 1,
      fontWeight: 'bold',
      fontSize: 16,
      color: Colors.text,
      //flexShrink: 1,
    },

    HmailSender: {
      flex: 1,
      fontSize: 14,
      color: Colors.textSecondary,
      ellipsizeMode: 'tail',
    },

    HmailBody: {
      flex: 1,
      fontSize: 14,
      color: Colors.textSecondary,
      //flexShrink: 1,
    },
    HMView: {
      // borderWidth: 2 ,
      flex: 0.5,
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginRight: 5,
    },

    blankMails: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      // borderWidth: 2,
    },
    timeBlock: {
      height: 60,
      width: 50,
      //borderWidth: 2 ,
      flex: 'row',
      //borderColor: "white" ,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    mailTime: {
      fontSize: 12,
      color: Colors.text,
      flexWrap: 'nowrap',
      width: 60,
      height: 15,
    },
    Hfooter: {
      position: 'absolute',
      bottom: 5,
      width: '90%',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: Colors.bg,
      padding: 12,
      margin: 20,
      borderRadius: 50,
      //borderWidth: 2 ,
      //borderColor: "gray" ,
      zIndex: 9,
    },
    HFbtns: {
      position: 'relative',
      height: 50,
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: Colors.cart,
      borderRadius: 50,
    },
    userProfilePic: {
      position: 'absolute',
      top: 0,
      left: 0,
      resizeMode: 'contain',
      height: '100%',
      width: '100%',
      //mixBlendMode: "multiply" ,
    },
    testText: {
      color: '#FFB100',
      fontSize: 20,
    },

    box: {
      height: 100,
      width: 100,
      backgroundColor: 'green',
    },

    // Compose styling
    Ccontainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    AlHadder: {
      flex: 1,
      flexDirection: 'row',
      //padding: 10,
      // margin: 5,
      borderRadius: 25,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingBottom: 5,
    },
    AlBody: {
      flex: 8,
      padding: 10,
      //borderWidth: 2,
    },
    centerItem: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    AlFooter: {
      flex: 1,
      flexDirection: 'row',
      //padding: 10,
      //margin: 5,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingBottom: 5,
      // borderWidth: 2,
    },
    // Mail styling
    plainBlock: {
      padding: 10,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      //borderWidth: 2 ,
    },
    RFBtns: {
      padding: 10,
      paddingLeft: 45,
      paddingRight: 45,
      flexDirection: 'row',
      borderRadius: 50,
      backgroundColor: Colors.primary,
      color: '#fff',
    },
    primaryIcons: {
      color: '#fff',
      margin: 2,
    },
    // Compose styling
    CMenu: {
      position: 'absolute',
      top: 100,
      right: 20,
      padding: 20,
      backgroundColor: Colors.cart,
      borderTopLeftRadius: 20,
      borderEndEndRadius: 20,
      borderBottomStartRadius: 20,
      zIndex: 99,
    },
    composeInput: {
      padding: 10,
      //backgroundColor: Colors.cart ,
      flex: 0.8,
    },
    suggestSenderMail: {
      padding: 15,
      backgroundColor: Colors.cart,
      margin: 40,
      borderRadius: 20,
    },
    mailInput: {
      flex: 0.8,
      padding: 10,
      paddingLeft: 22,
      backgroundColor: Colors.cart,
      borderRadius: 50,
    },
    sendBtn: {
      padding: 10,
      backgroundColor: Colors.primary,
      borderRadius: '50%',
    },
    // login & singup styling
    submitBlock: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // borderWidth: 2 ,
    },
    enterInput: {
      marginBottom: 10,
      padding: 18,
      width: 300,
      borderRadius: 40,
      color: Colors.text,
      backgroundColor: Colors.cart,
    },
    passwordBlock: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: 10,
      padding: 6,
      width: 300,
      borderRadius: 40,
      //borderWidth: 2 ,
      backgroundColor: Colors.cart,
    },
    marginAround: {
      marginRight: 5,
      marginLeft: 5,
      color: Colors.text,
    },
    submitBtn: {
      margin: 10,
      padding: 12,
      width: 300,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
    },
    textBlock: {
      width: 300,
      marginLeft: 10,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    pickerBlock: {
      height: 60,
      width: 120,
      backgroundColor: Colors.cart,
      borderRadius: 20,
    },
    pickerContainer: {
      width: 300,
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 10,
    },
    dobBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    errorMsg: {
      width: 300,
      alignItems: 'flex-start',
      color: 'brown',
    },
    // popups stylings
    alertOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      //backgroundColor: 'rgba(0, 0, 0, 0.45)',

      justifyContent: 'center',
      alignItems: 'center',

      zIndex: 999,
      // elevation: 999,
    },

    confirmBox: {
      width: '86%',
      backgroundColor: Colors.cart,

      borderRadius: 18,
      padding: 22,

      // elevation: 12,

      //shadowColor: Colors.fg,
      //shadowOffset: {
      // width: 0,
      //  height: 5,
      // },
      //shadowOpacity: 0.20,
      //shadowRadius: 10,
    },

    confirmTitle: {
      fontSize: 21,
      fontWeight: '700',
      color: Colors.text,

      marginBottom: 10,
    },

    confirmMessage: {
      fontSize: 15,
      lineHeight: 22,
      color: Colors.textSecondary,

      marginBottom: 25,
    },

    confirmButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',

      gap: 10,
    },

    cancelButton: {
      minWidth: 85,

      paddingVertical: 11,
      paddingHorizontal: 18,

      borderRadius: 10,

      backgroundColor: Colors.bg,

      alignItems: 'center',
      justifyContent: 'center',
    },

    cancelButtonText: {
      fontSize: 14,
      fontWeight: '600',

      color: Colors.text,
    },

    confirmButton: {
      minWidth: 90,

      paddingVertical: 11,
      paddingHorizontal: 18,

      borderRadius: 10,

      backgroundColor: Colors.primary,

      alignItems: 'center',
      justifyContent: 'center',
    },

    confirmButtonText: {
      fontSize: 14,
      fontWeight: '600',

      color: Colors.cart,
    },

    alertContainer: {
      position: 'absolute',

      left: 0,
      right: 0,
      bottom: 125,

      alignItems: 'center',

      zIndex: 999,
      elevation: 999,
    },

    alertBox: {
      width: '82%',
      minHeight: 64,

      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor: Colors.cart,

      borderWidth: 1,
      //borderColor: '#444444 ',

      borderRadius: 16,

      paddingHorizontal: 18,
      paddingVertical: 14,

      elevation: 8,

      shadowColor: Colors.fg,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },

    alertText: {
      flex: 1,

      marginLeft: 18,

      color: Colors.text,

      fontSize: 15,
      fontWeight: '600',

      letterSpacing: 2,

      textTransform: 'none',
    },
    // Profile stiling
    PPicContainer: {
      flex: 0.6,
      //borderWidth: 2 ,
      alignItems: 'center',
      justifyContent: 'center',
    },
    BigProfile: {
      height: 160,
      width: 160,
      overflow: 'hidden',
      borderRadius: '50%',
      //borderWidth: 2 ,
    },

    PCardContainer: {
      flex: 1.4,
      //borderWidth: 2 ,
    },
    POPtionCards: {
      margin: 10,
      padding: 20,
      backgroundColor: Colors.cart,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    // Settins styling
    SettingsOptions: {
      margin: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      //backgroundColor: Colors.cart ,
    },
    // Edit Profile Styling

    EPPicContainer: {
      flexDirection: 'row',
      margin: 10,
      padding: 5,
      flex: 4,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      backgroundColor: Colors.cart,
      borderRadius: 10,
    },
    EPItemContainer: {
      backgroundColor: Colors.cart,
      padding: 8,
      margin: 10,
      borderRadius: 10,
    },
    EPItem: {
      margin: 10,
      color: Colors.textSecondary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    SecondryText: {
      color: Colors.textSecondary,
    },
    loaderBtn: {
      flex: 1,
      padding: 10,
      borderWidth: 4,
      borderLeftColor: 'transparent',
      color: Colors.text,
      borderRadius: '50%',
    },

    // Update password styling

    UpdatePasswordScroll: {
      flex: 1,
      backgroundColor: Colors.bg,
    },

    UpdatePasswordContent: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 40,
    },

    UpdatePasswordTitle: {
      fontSize: 25,
      fontWeight: '700',
      color: Colors.text,
      marginBottom: 6,
    },

    UpdatePasswordSubtitle: {
      fontSize: 14,
      color: Colors.textSecondary,
      lineHeight: 20,
      marginBottom: 25,
    },

    PasswordSection: {
      marginBottom: 18,
    },

    PasswordLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.text,
      marginBottom: 8,
    },

    PasswordInputBox: {
      height: 52,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 15,
      paddingRight: 5,
      backgroundColor: Colors.card,
    },

    PasswordInput: {
      flex: 1,
      fontSize: 15,
      color: Colors.text,
      paddingVertical: 0,
    },

    PasswordPlaceholder: {
      color: Colors.textSecondary,
    },

    PasswordIcon: {
      color: Colors.textSecondary,
    },

    PasswordEyeButton: {
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },

    UpdatePasswordButton: {
      height: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
      marginTop: 4,
    },

    UpdatePasswordButtonDisabled: {
      opacity: 0.6,
    },

    UpdatePasswordButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.buttonText,
    },

    SecurityTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors.text,
      marginTop: 30,
      marginBottom: 12,
    },

    BiometricCard: {
      minHeight: 74,
      borderRadius: 16,
      paddingHorizontal: 15,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
    },

    BiometricIconBox: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primaryLight,
      marginRight: 12,
    },

    BiometricIcon: {
      color: Colors.primary,
    },

    BiometricContent: {
      flex: 1,
    },

    BiometricTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.text,
    },

    BiometricSubtitle: {
      fontSize: 12,
      color: Colors.textSecondary,
      lineHeight: 17,
      marginTop: 3,
    },

    //help & support

    header: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    },

    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: Colors.text,
    },

    headerSpacer: {
      width: 40,
      height: 40,
    },

    /* Content */

    content: {
      flex: 1,
    },

    contentContainer: {
      paddingBottom: 30,
    },

    helpContainer: {
      paddingHorizontal: 16,
    },

    /* Section */

    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 15,
      marginBottom: 12,
    },

    sectionTitleText: {
      fontSize: 17,
      fontWeight: '700',
      color: Colors.text,
    },

    /* FAQ */

    faqList: {
      gap: 10,
    },

    faqCard: {
      backgroundColor: Colors.cart,
      borderRadius: 14,
      padding: 15,
    },

    faqCardActive: {
      backgroundColor: Colors.cart,
    },

    faqQuestion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    questionText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: Colors.text,
      paddingRight: 10,
    },

    arrow: {
      transform: [{ rotate: '0deg' }],
    },

    arrowOpen: {
      transform: [{ rotate: '180deg' }],
    },

    faqAnswer: {
      fontSize: 14,
      lineHeight: 21,
      color: Colors.textSecondary,
      marginTop: 12,
    },

    /* Divider */

    divider: {
      height: 1,
      backgroundColor: Colors.bg,
      marginVertical: 25,
    },

    /* Feedback */

    feedbackBox: {
      backgroundColor: Colors.cart,
      borderRadius: 14,
      padding: 14,
    },

    feedbackInput: {
      minHeight: 120,
      fontSize: 14,
      color: '#111',
      padding: 12,
      backgroundColor: Colors.bg,
      borderRadius: 10,
      marginBottom: 12,
    },

    sendButton: {
      height: 45,
      borderRadius: 10,
      backgroundColor: Colors.text,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },

    sendButtonText: {
      color: Colors.cart,
      fontSize: 14,
      fontWeight: '600',
    },

    /* Contact */

    contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.cart,
      borderRadius: 14,
      padding: 16,
      marginTop: 20,
    },

    contactText: {
      marginLeft: 12,
    },

    contactTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.text,
    },

    email: {
      fontSize: 14,
      color: Colors.textSecondary,
      marginTop: 3,
    },

    // create group styling

    // =========================================
    // PAGE
    // =========================================

    SmailGroupsPage: {
      flex: 1,
      backgroundColor: Colors.bg,
    },

    // =========================================
    // HEADER
    // =========================================

    SmailGroupsHeader: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

      paddingHorizontal: 12,

      backgroundColor: Colors.cart,

      borderBottomWidth: 1,
      borderBottomColor: Colors.Shimmer,
    },

    SmailGroupsHeaderButton: {
      width: 42,
      height: 42,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 21,
    },

    SmailGroupsHeaderTitle: {
      flex: 1,

      marginHorizontal: 10,

      fontSize: 20,
      fontWeight: '700',

      color: Colors.fg,

      textAlign: 'center',
    },

    // =========================================
    // CONTENT
    // =========================================

    SmailGroupsContent: {
      flex: 1,
    },

    SmailGroupsContentContainer: {
      padding: 15,
      paddingBottom: 25,
    },

    // =========================================
    // CREATE GROUP CARD
    // =========================================

    SmailGroupsCreateCard: {
      backgroundColor: Colors.cart,

      borderRadius: 14,

      padding: 16,

      marginBottom: 15,

      borderWidth: 1,
      borderColor: Colors.Shimmer,
    },

    SmailGroupsCreateTitle: {
      fontSize: 18,
      fontWeight: '700',

      color: Colors.text,

      marginBottom: 15,
    },

    // =========================================
    // GROUP NAME INPUT
    // =========================================

    SmailGroupsGroupInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',

      minHeight: 48,

      backgroundColor: Colors.bg,

      borderRadius: 10,

      borderWidth: 1,
      borderColor: Colors.Shimmer,

      paddingHorizontal: 12,
    },

    SmailGroupsGroupInput: {
      flex: 1,

      height: 48,

      fontSize: 15,

      color: Colors.text,

      paddingVertical: 0,
    },

    SmailGroupsDomainHint: {
      fontSize: 13,

      color: Colors.textSecondary,

      marginLeft: 5,
    },

    // =========================================
    // BUTTON ROW
    // =========================================

    SmailGroupsButtonRow: {
      flexDirection: 'row',

      justifyContent: 'flex-end',

      marginTop: 15,

      gap: 10,
    },

    SmailGroupsSecondaryButton: {
      minWidth: 90,
      height: 42,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 9,

      backgroundColor: Colors.bg,

      borderWidth: 1,
      borderColor: Colors.Shimmer,
    },

    SmailGroupsSecondaryButtonText: {
      fontSize: 14,
      fontWeight: '600',

      color: Colors.text,
    },

    SmailGroupsPrimaryButton: {
      minWidth: 90,
      height: 42,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 9,

      backgroundColor: Colors.primary,
    },

    SmailGroupsPrimaryButtonText: {
      fontSize: 14,
      fontWeight: '700',

      color: '#FFFFFF',
    },

    // =========================================
    // GROUP LIST
    // =========================================

    SmailGroupsList: {
      width: '100%',
    },

    SmailGroupsEmptyText: {
      fontSize: 15,

      color: Colors.textSecondary,

      textAlign: 'center',

      marginTop: 40,
    },

    // =========================================
    // GROUP CARD
    // =========================================

    SmailGroupsGroupCard: {
      backgroundColor: Colors.cart,

      borderRadius: 14,

      marginBottom: 12,

      overflow: 'hidden',

      borderWidth: 1,
      borderColor: Colors.Shimmer,
    },

    SmailGroupsGroupInfo: {
      flexDirection: 'row',

      alignItems: 'center',

      padding: 15,
    },

    SmailGroupsGroupIcon: {
      width: 46,
      height: 46,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 23,

      backgroundColor: Colors.bg,

      marginRight: 12,
    },

    SmailGroupsGroupDetails: {
      flex: 1,
    },

    SmailGroupsGroupName: {
      fontSize: 16,
      fontWeight: '700',

      color: Colors.text,

      marginBottom: 4,
    },

    SmailGroupsGroupMembers: {
      fontSize: 13,

      color: Colors.textSecondary,
    },

    // =========================================
    // GROUP MANAGEMENT
    // =========================================

    SmailGroupsManagement: {
      paddingHorizontal: 15,
      paddingBottom: 15,

      borderTopWidth: 1,
      borderTopColor: Colors.Shimmer,
    },

    // =========================================
    // ADD MEMBER
    // =========================================

    SmailGroupsMemberAddBox: {
      flexDirection: 'row',

      alignItems: 'center',

      marginTop: 15,

      backgroundColor: Colors.bg,

      borderRadius: 10,

      borderWidth: 1,
      borderColor: Colors.Shimmer,

      paddingLeft: 12,

      overflow: 'hidden',
    },

    SmailGroupsMemberInput: {
      flex: 1,

      height: 46,

      fontSize: 14,

      color: Colors.text,

      paddingVertical: 0,
    },

    SmailGroupsAddMemberButton: {
      width: 48,
      height: 46,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: Colors.cart,
    },

    // =========================================
    // MEMBERS LIST
    // =========================================

    SmailGroupsMembersList: {
      marginTop: 10,
    },

    SmailGroupsMemberRow: {
      minHeight: 45,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'space-between',

      paddingVertical: 5,

      borderBottomWidth: 1,
      borderBottomColor: Colors.Shimmer,
    },

    SmailGroupsMemberMeta: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      gap: 6,
    },

    SmailGroupsMemberEmail: {
      flex: 1,

      fontSize: 14,

      color: Colors.text,
    },

    // =========================================
    // REMOVE MEMBER
    // =========================================

    SmailGroupsRemoveButton: {
      width: 36,
      height: 36,

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 18,
    },

    // =========================================
    // DELETE GROUP
    // =========================================

    SmailGroupsDeleteButton: {
      height: 42,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',

      gap: 7,

      marginTop: 12,

      borderRadius: 9,

      backgroundColor: Colors.bg,

      borderWidth: 1,
      borderColor: Colors.Shimmer,
    },

    SmailGroupsDeleteText: {
      fontSize: 14,

      fontWeight: '600',

      color: '#E53935',
    },

    // =========================================
    // FOOTER
    // =========================================

    SmailGroupsFooter: {
      height: 45,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: Colors.cart,

      borderTopWidth: 1,
      borderTopColor: Colors.Shimmer,
    },

    SmailGroupsFooterText: {
      fontSize: 12,

      color: Colors.textSecondary,
    },
  });
};
export default styles;
