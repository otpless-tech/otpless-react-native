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
import { OtplessModule, OtplessSimUtils } from 'otpless-react-native';

export const APP_ID = "K8K415KI2VMZV27648JJ"

type Props = {
  navigation: StackNavigationProp<any>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const module = new OtplessModule();
  const otplessSimUtils = OtplessSimUtils.getInstance();

  const [otplessResponse, setOtplessResponse] = useState<string | undefined>(undefined);
  const [simStates, setSimStates] = useState('')

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

    attachSecureSDK()
    module.enableDebugLogging(true)
    setupSimStatusChangeListener();
    
    return () => {
      otplessSimUtils.detachSimEjectionListener();
    };
  }, []);

  const attachSecureSDK = async () => {
    try {
      await module.attachSecureSDK(APP_ID);
      console.log("Secure SDK attached successfully");
    } catch (error: any) {
      console.error("Error attaching Secure SDK:", error.message);
      // Merchant can handle specific error messages or actions
    }
  };

  const setupSimStatusChangeListener = () => {
    otplessSimUtils.setupSimStatusChangeListener(handleSimStatusChange);
  };
  const handleSimStatusChange = (simEntries: any[]) => {
    console.log('Received SIM status changes:', simEntries);
    // Handle the received SIM entries here
    setSimStates(JSON.stringify(simEntries, null, 2))
  };
  
  const getEjectedSimEntries = async () => {
    try {
      const entries = await otplessSimUtils.getEjectedSimsEntries();
      console.log("Ejected SIM Entries:", entries);
      setSimStates(JSON.stringify(entries)); // Ensure we stringify the result for display
    } catch (error) {
      let errorStr = "Error fetching ejected SIM entries: " + error; // Use error.message for better error handling
      setSimStates(errorStr);
    }
  };
  

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
            getEjectedSimEntries()
          }}>
          <Text
            style={{
              color: 'white'
            }}
          >Get ejected sim entries</Text>
        </TouchableOpacity>

        {simStates && simStates.length > 0 && (
           <Text style={{ fontSize: 16, marginBottom: 10, color: 'black' }}>{simStates}</Text>
        )}

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

        <Text style={{ fontSize: 16, marginBottom: 10, color: 'black' }}>{otplessResponse}</Text>
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

