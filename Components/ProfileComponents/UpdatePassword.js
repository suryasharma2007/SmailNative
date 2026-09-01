import React, { useContext, useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';

import { ArrowLeft , Eye, EyeOff, Fingerprint , } from 'lucide-react-native';

import {
  verifyUserPassword,
  changeUserPassword,
  checkBiometricSupport,
  authenticateWithBiometric,
  enableBiometricLock,
  disableBiometricLock,
  isBiometricLockEnabled,
} from '../FireBase';

const { Store } = require('../AllPages');

const UpdatePassword = ({ navigation }) => {
  const { Exstyles } = useContext(Store);

  // =========================================
  // PASSWORD
  // =========================================

  const [currentPassword, setCurrentPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updatingPassword, setUpdatingPassword] = useState(false);

  // =========================================
  // BIOMETRIC
  // =========================================

  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const [checkingBiometric, setCheckingBiometric] = useState(true);

  // This tells us whether fingerprint
  // was successfully verified in this page.
  const [biometricVerified, setBiometricVerified] = useState(false);

  // =========================================
  // PAGE OPEN
  // =========================================

  useEffect(() => {
    checkBiometric();
  }, []);

  // =========================================
  // CHECK BIOMETRIC
  // =========================================

  const checkBiometric = async () => {
    try {
      setCheckingBiometric(true);

      const support = await checkBiometricSupport();

      if (!support.success || !support.available) {
        setBiometricAvailable(false);
        setBiometricEnabled(false);
        setBiometricVerified(false);

        return;
      }

      setBiometricAvailable(true);

      const enabled = await isBiometricLockEnabled();

      setBiometricEnabled(enabled);

      // =====================================
      // IF BIOMETRIC IS ALREADY ON
      // =====================================

      if (enabled) {
        const result = await authenticateWithBiometric();

        if (!result.success) {
          Alert.alert(
            'Authentication Required',
            'Fingerprint authentication is required to continue.',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
          );

          return;
        }

        // Fingerprint success
        setBiometricVerified(true);

        Alert.alert(
          'Verified',
          'Fingerprint verified successfully. You can set a new password.',
        );
      }
    } catch (error) {
      console.log('BIOMETRIC CHECK ERROR:', error);
    } finally {
      setCheckingBiometric(false);
    }
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword = async () => {
    if (updatingPassword) {
      return;
    }

    // =====================================
    // NEW PASSWORD
    // =====================================

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Enter your new password.');

      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must contain at least 6 characters.');

      return;
    }

    // =====================================
    // CONFIRM PASSWORD
    // =====================================

    if (!confirmPassword.trim()) {
      Alert.alert('Error', 'Confirm your new password.');

      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'New password and confirm password do not match.',
      );

      return;
    }

    // =====================================
    // NO BIOMETRIC VERIFICATION
    // =====================================

    if (!biometricVerified) {
      if (!currentPassword.trim()) {
        Alert.alert(
          'Current Password Required',
          'Enter your current password or enable biometric authentication.',
        );

        return;
      }

      // ===================================
      // VERIFY CURRENT PASSWORD
      // ===================================

      setUpdatingPassword(true);

      const verify = await verifyUserPassword(currentPassword);

      if (!verify.success) {
        setUpdatingPassword(false);

        Alert.alert(
          'Incorrect Password',
          'Your current password is incorrect.',
        );

        return;
      }
    } else {
      // ===================================
      // BIOMETRIC VERIFIED
      // ===================================

      console.log('BIOMETRIC VERIFIED - CURRENT PASSWORD NOT REQUIRED BY UI');
    }

    // =====================================
    // CHANGE PASSWORD
    // =====================================

    try {
      setUpdatingPassword(true);

      const result = await changeUserPassword(currentPassword, newPassword);

      if (!result.success) {
        // =================================
        // FIREBASE RECENT LOGIN ERROR
        // =================================

        if (result.error?.includes('requires-recent-login')) {
          Alert.alert(
            'Additional Verification Required',
            'Fingerprint verification was successful, but Firebase requires a recent account login before changing your password.',
          );

          return;
        }

        Alert.alert(
          'Unable to Update',
          result.error || 'Unable to change password.',
        );

        return;
      }

      // =====================================
      // SUCCESS
      // =====================================

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      Alert.alert(
        'Password Updated',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // =========================================
  // BIOMETRIC SWITCH
  // =========================================

  const handleBiometric = async value => {
    // =====================================
    // CHECK SUPPORT
    // =====================================

    const support = await checkBiometricSupport();

    if (!support.success || !support.available) {
      setBiometricAvailable(false);
      setBiometricEnabled(false);

      Alert.alert(
        'Not Available',
        'Fingerprint or biometric authentication is not available on this device.',
      );

      return;
    }

    // =====================================
    // ENABLE
    // =====================================

    if (value === true) {
      const authResult = await authenticateWithBiometric();

      if (!authResult.success) {
        setBiometricEnabled(false);
        setBiometricVerified(false);

        Alert.alert(
          'Authentication Failed',
          'Fingerprint authentication failed or was cancelled.',
        );

        return;
      }

      const result = await enableBiometricLock();

      if (!result.success) {
        setBiometricEnabled(false);

        Alert.alert(
          'Error',
          result.error || 'Unable to enable biometric lock.',
        );

        return;
      }

      setBiometricEnabled(true);

      // Fingerprint verified
      setBiometricVerified(true);

      Alert.alert(
        'Biometric Enabled',
        'Biometric lock has been enabled successfully.',
      );

      return;
    }

    // =====================================
    // DISABLE
    // =====================================

    if (value === false) {
      const authResult = await authenticateWithBiometric();

      if (!authResult.success) {
        setBiometricEnabled(true);

        Alert.alert(
          'Authentication Failed',
          'Fingerprint authentication is required to disable biometric lock.',
        );

        return;
      }

      const result = await disableBiometricLock();

      if (!result.success) {
        setBiometricEnabled(true);

        Alert.alert(
          'Error',
          result.error || 'Unable to disable biometric lock.',
        );

        return;
      }

      setBiometricEnabled(false);
      setBiometricVerified(false);

      Alert.alert(
        'Biometric Disabled',
        'Biometric lock has been disabled successfully.',
      );
    }
  };

  // =========================================
  // ICONS
  // =========================================

  const CurrentPasswordIcon = showCurrentPassword ? EyeOff : Eye;

  const NewPasswordIcon = showNewPassword ? EyeOff : Eye;

  const ConfirmPasswordIcon = showConfirmPassword ? EyeOff : Eye;

  // =========================================
  // UI
  // =========================================

  return (
    <ScrollView
      style={Exstyles.UpdatePasswordScroll}
      contentContainerStyle={Exstyles.UpdatePasswordContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={Exstyles.AlHadder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft style={Exstyles.lucideIcons} />
        </TouchableOpacity>
        <Text style={Exstyles.TextBasic}>Settings</Text>
        <Text></Text>
      </View>

      {/* =================================
          TITLE
      ================================= */}

      <Text style={Exstyles.UpdatePasswordTitle}>Update Password</Text>

      <Text style={Exstyles.UpdatePasswordSubtitle}>
        Keep your account secure by using a strong password.
      </Text>

      {/* =================================
          CURRENT PASSWORD
      ================================= */}

      <View style={Exstyles.PasswordSection}>
        <Text style={Exstyles.PasswordLabel}>
          Current Password
          {biometricVerified && (
            <Text style={Exstyles.OptionalText}> • Optional</Text>
          )}
        </Text>

        <View style={Exstyles.PasswordInputBox}>
          <TextInput
            style={Exstyles.PasswordInput}
            placeholder={
              biometricVerified
                ? 'Not required with fingerprint'
                : 'Enter current password'
            }
            placeholderTextColor={Exstyles.PasswordPlaceholder.color}
            secureTextEntry={!showCurrentPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!biometricVerified}
          />

          {!biometricVerified && (
            <TouchableOpacity
              style={Exstyles.PasswordEyeButton}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              activeOpacity={0.7}
            >
              <CurrentPasswordIcon
                size={20}
                color={Exstyles.PasswordIcon.color}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* =================================
          NEW PASSWORD
      ================================= */}

      <View style={Exstyles.PasswordSection}>
        <Text style={Exstyles.PasswordLabel}>New Password</Text>

        <View style={Exstyles.PasswordInputBox}>
          <TextInput
            style={Exstyles.PasswordInput}
            placeholder="Enter new password"
            placeholderTextColor={Exstyles.PasswordPlaceholder.color}
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={Exstyles.PasswordEyeButton}
            onPress={() => setShowNewPassword(!showNewPassword)}
            activeOpacity={0.7}
          >
            <NewPasswordIcon size={20} color={Exstyles.PasswordIcon.color} />
          </TouchableOpacity>
        </View>
      </View>

      {/* =================================
          CONFIRM PASSWORD
      ================================= */}

      <View style={Exstyles.PasswordSection}>
        <Text style={Exstyles.PasswordLabel}>Confirm Password</Text>

        <View style={Exstyles.PasswordInputBox}>
          <TextInput
            style={Exstyles.PasswordInput}
            placeholder="Confirm new password"
            placeholderTextColor={Exstyles.PasswordPlaceholder.color}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={Exstyles.PasswordEyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            activeOpacity={0.7}
          >
            <ConfirmPasswordIcon
              size={20}
              color={Exstyles.PasswordIcon.color}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* =================================
          UPDATE BUTTON
      ================================= */}

      <TouchableOpacity
        style={[
          Exstyles.UpdatePasswordButton,
          updatingPassword && Exstyles.UpdatePasswordButtonDisabled,
        ]}
        onPress={handleChangePassword}
        disabled={updatingPassword}
        activeOpacity={0.8}
      >
        <Text style={Exstyles.UpdatePasswordButtonText}>
          {updatingPassword ? 'Updating...' : 'Update Password'}
        </Text>
      </TouchableOpacity>

      {/* =================================
          SECURITY
      ================================= */}

      <Text style={Exstyles.SecurityTitle}>Security</Text>

      {checkingBiometric ? (
        <View style={Exstyles.BiometricCard}>
          <View style={Exstyles.BiometricIconBox}>
            <Fingerprint size={22} color={Exstyles.BiometricIcon.color} />
          </View>

          <View style={Exstyles.BiometricContent}>
            <Text style={Exstyles.BiometricTitle}>Biometric Lock</Text>

            <Text style={Exstyles.BiometricSubtitle}>
              Checking biometric support...
            </Text>
          </View>
        </View>
      ) : biometricAvailable ? (
        <View style={Exstyles.BiometricCard}>
          <View style={Exstyles.BiometricIconBox}>
            <Fingerprint size={22} color={Exstyles.BiometricIcon.color} />
          </View>

          <View style={Exstyles.BiometricContent}>
            <Text style={Exstyles.BiometricTitle}>Biometric Lock</Text>

            <Text style={Exstyles.BiometricSubtitle}>
              {biometricEnabled
                ? 'Fingerprint protection is enabled'
                : 'Enable fingerprint authentication'}
            </Text>
          </View>

          <Switch value={biometricEnabled} onValueChange={handleBiometric} />
        </View>
      ) : (
        <View style={Exstyles.BiometricCard}>
          <View style={Exstyles.BiometricIconBox}>
            <Fingerprint size={22} color={Exstyles.BiometricIcon.color} />
          </View>

          <View style={Exstyles.BiometricContent}>
            <Text style={Exstyles.BiometricTitle}>Biometric Lock</Text>

            <Text style={Exstyles.BiometricSubtitle}>
              Biometric authentication is not available on this device.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default UpdatePassword;
