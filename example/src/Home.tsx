import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Clipboard,
} from 'react-native';
import 'react-native-gesture-handler';
import { OtplessModule } from 'otpless-react-native';

export const APP_ID = ""

type Props = {
  navigation: StackNavigationProp<any>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const module = new OtplessModule();

  const [otplessResponse, setOtplessResponse] = useState<string | undefined>(undefined);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'white',
  };

  const showOtplessLoginPage = () => {
    let request = {
      appId: APP_ID
    };
    module.showLoginPage((data) => {
      let response: string = '';
      if (data.data === null || data.data === undefined) {
        response = data.errorMessage;
      } else {
        response = JSON.stringify(data.data);
      }
      setOtplessResponse(response);
    }, request);
  };

  useEffect(() => {
    module.setWebViewInspectable(true)
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Choose Your Test Mode</Text>
        <TouchableOpacity
          style={{
            marginVertical: 10,
            backgroundColor: "#007AFF",
            padding: 10,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={showOtplessLoginPage}>
          <Text
            style={{
              color: 'white'
            }}
          >Pre Built UI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginVertical: 10,
            backgroundColor: "#007AFF",
            padding: 10,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {
            navigation.navigate('Headless')
          }}>
          <Text
            style={{
              color: 'white'
            }}
          >Headless</Text>
        </TouchableOpacity>

        {otplessResponse && otplessResponse.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 10 }}>
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}>Otpless Response</Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                padding: 10,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => {
                if (otplessResponse) {
                  Clipboard.setString(otplessResponse);
                }
              }}>
              <Text style={{ color: 'white', paddingHorizontal: 20 }}>Copy Response</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={{ fontSize: 16, marginBottom: 10 }}>{otplessResponse}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    color: 'black',
  },
});

export default HomeScreen;

