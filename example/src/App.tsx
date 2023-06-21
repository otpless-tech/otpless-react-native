import React, { useState } from 'react';

import { OtplessEventModule, OtplessModule } from 'otpless-react-native';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

import Header, { FintechItem } from './components/Header';

export default function App() {
  const [items, _] = useState([
    { id: 1, name: 'Paytm' },
    { id: 2, name: 'PhonePe' },
    { id: 3, name: 'GPay' },
    { id: 4, name: 'Mobikwik' },
    { id: 5, name: 'PayPal' },
    { id: 6, name: 'BharatPe' },
  ]);

  const eventModule = new OtplessEventModule((result: any) => {
    handleResult(result);
  });

  const module = new OtplessModule();

  const [result, setOtplessResult] = useState('Result from OTPESS');

  // to get onetime callback
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const _handleButtonPress = () => {
    console.log(OtplessModule);
    module.start(handleResult);
  };
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const handleResult = (data: any) => {
    let message: string = '';
    if (data.data === null || data.data === undefined) {
      message = data.errorMessage;
    } else {
      message = `token: ${data.data.token}`;
      // todo here
    }
    setOtplessResult(message);
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const _handleButtonPressEvent = () => {
    eventModule.start();
  };
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const onSignInCompleted = () => {
    eventModule.onSignInCompleted;
  };

  const startEventWithParams = () => {
    eventModule.start(createParams());
  };

  const startCallbackWithParams = () => {
    module.startWithParams(createParams(), handleResult);
  };

  const createParams = () => {
    const params = {
      method: 'get',
      params: {
        uxmode: 'autoclick',
      },
    };
    return params;
  };

  return (
    <View style={styles.container}>
      <Header title="React Fintech List" />
      <FlatList
        data={items}
        renderItem={({ item }) => <FintechItem name={item.name} />}
      />
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{ padding: 24 }}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{ padding: 24 }}>{result}</Text>
      </View>

      <View style={styles.otplessButtonContainer}>
        <Button
          title="Open OTP-less SDK"
          onPress={() => startCallbackWithParams()}
        />
      </View>

      <View style={styles.otplessButtonContainer}>
        <Button
          title="Open OTP-less With Event"
          onPress={() => startEventWithParams()}
        />
      </View>

      <View style={styles.otplessButtonContainer}>
        <Button
          title="Call OTPLESS Complete"
          onPress={() => onSignInCompleted()}
        />
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
    paddingBottom: 16,
    paddingStart: 24,
    paddingEnd: 24,
  },
});
