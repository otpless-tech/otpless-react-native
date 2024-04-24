import React, { useState } from 'react';

import { OtplessModule } from 'otpless-react-native';
import { Button, StyleSheet, Text, View } from 'react-native';

import Header from './components/Header';

export default function App() {

  const module = new OtplessModule();

  const [result, setOtplessResult] = useState('Result from OTPESS');
  var loaderVisibility = true;
  
  const handleResult = (data: any) => {
    setOtplessResult(JSON.stringify(data));
  };

  const loginPage = () => {
    let request = {
      appId: "APP_ID"
    }
    module.showLoginPage(handleResult, request);
  };

  const isWhatsappInstalled = () => {
    module.isWhatsappInstalled((hasWhatsapp) => {
      let message = 'Whatsapp installation status: ' + hasWhatsapp;
      setOtplessResult(message);
    });
  };

  const toggleLoaderVisibility = () => {
    loaderVisibility = !loaderVisibility;
    module.setLoaderVisibility(loaderVisibility);
  }

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

      <View style={{ padding: 24 }}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{ padding: 24 }}>{result}</Text>
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
});
