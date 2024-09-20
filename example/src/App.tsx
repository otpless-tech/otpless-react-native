import React, { useEffect, useState } from 'react';

import { OtplessHeadlessModule, OtplessModule } from 'otpless-react-native';
import { Button, StyleSheet, Text, View, TextInput, Platform, Switch } from 'react-native';

import Header from './components/Header';
import { useColorScheme } from 'react-native';

export default function App() {
  const colorScheme = useColorScheme(); 

  const module = new OtplessModule();
  const headlessModule = new OtplessHeadlessModule();
  let isIosHeadlessInit = false;

  const appId = "APP_ID"

  const[form, setForm] = useState({
    result: 'result view',
    phoneNumber: '',
    countryCode: '',
    otp: '',
    channelType: '',
  })

  useEffect(() => {
    if(Platform.OS == 'android') {
      headlessModule.initHeadless(appId)
      headlessModule.setHeadlessCallback(onHeadlessResult)
      console.log("Otpless: android headless init done")
    }
    headlessModule.setWebViewInspectable(true);
    module.enableDebugLogging(true);
    return () => {
      headlessModule.clearListener();
    }
  }, []);

  var loaderVisibility = true;
  
  const handleResult = (data: any) => {
    let dataString = JSON.stringify(data);
    handleChange('result', dataString);
  };

  const loginPage = () => {
    let request = {
      appId: appId
    }
    module.showLoginPage(handleResult, request);
  };

  const isWhatsappInstalled = () => {
    module.isWhatsappInstalled((hasWhatsapp) => {
      let message = "Whatsapp installation status: " + hasWhatsapp;
      console.log(message);
      handleChange('result', message);
    });
  };

  const toggleLoaderVisibility = () => {
    loaderVisibility = !loaderVisibility;
    module.setLoaderVisibility(loaderVisibility);
  }

  const startHeadless = () => {
    if(Platform.OS == 'ios' && !isIosHeadlessInit) {
      headlessModule.initHeadless(appId)
      headlessModule.setHeadlessCallback(onHeadlessResult)
      isIosHeadlessInit = true;
      console.log("Otpless: ios headless init done and returning");
      return
    }
    let headlessRequest = {}
    let phoneNumber = form.phoneNumber;
    if (phoneNumber != null && phoneNumber.length != 0) {
      if (isNaN(Number(phoneNumber))) {
        headlessRequest = {
          "email": phoneNumber
        }
        let otp = form.otp;
        if (otp != null && otp.length != 0) {
          headlessRequest = {
            "email": phoneNumber,
            "otp": otp
          }
        }
      } else {
        headlessRequest = {
          "phone": phoneNumber,
          "countryCode": form.countryCode
        }
        let otp = form.otp;
        if (otp != null && otp.length != 0) {
          headlessRequest = {
            "phone": phoneNumber,
            "countryCode": form.countryCode,
            "otp": otp
          }
        }
      }
} else {
      headlessRequest = {
        "channelType": form.channelType
      }
    }
    headlessModule.startHeadless(headlessRequest);
  }

  const onHeadlessResult = (data: any) => {
    let dataStr = JSON.stringify(data);
    console.log("=====onHeadlessResult======")
    console.log(dataStr)
    handleChange('result', dataStr);
  }

  const handleChange = (fieldName: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm, // Keep existing fields
      [fieldName]: value, // Update the specific field
    }));
  };

  return (
    <View style={styles.container}>
      <Header title="Otpless RN Example" />

      <View style={styles.otplessButtonContainer}>
        <Button title="Open OTP-less Login Page" onPress={() => loginPage()} />
      </View>


      <View style={styles.otplessButtonContainer}>
        <Button
          title="Is Whatsapp Installed"
          onPress={() => isWhatsappInstalled()}
        />
      </View>

      <View style={styles.otplessButtonContainer}>
        <Button
          title="Toggle Loader Visibility"
          onPress={() => toggleLoaderVisibility()}
        />
      </View>

      <View>
      </View>

      <TextInput
        style={styles.otplessInputContainer}
        placeholder="Enter Phone Number or email"
        value={form.phoneNumber}
        onChangeText={(text) => handleChange( 'phoneNumber' , text)}
      />

      <TextInput
        style={styles.otplessInputContainer}
        placeholder="Enter Country Code"
        value={form.countryCode}
        onChangeText={(text) => handleChange('countryCode', text)}
      />

      <TextInput
        style={styles.otplessInputContainer}
        placeholder="Enter OTP"
        value={form.otp}
        onChangeText={(text) => handleChange('otp', text)}
      />

      <TextInput
        style={styles.otplessInputContainer}
        placeholder="Enter Channel Type"
        value={form.channelType}
        onChangeText={(text) => handleChange('channelType', text)}
      />

      <View style={styles.otplessButtonContainer}>
        <Button title="Start Headless" onPress={() => startHeadless()} />
      </View>

      <View style={{ padding: 24 }}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{ padding: 24, color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
        {form.result}
      </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  container: {
    paddingTop: 25,
    flex: 1,
  },
  otplessButtonContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingStart: 24,
    paddingEnd: 24,
  },
  otplessInputContainer: {
    paddingTop: 12,
    paddingStart: 24,
    paddingEnd: 24,
  },
});
