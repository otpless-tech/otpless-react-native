import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Clipboard, Keyboard } from 'react-native';
import { OtplessHeadlessModule } from 'otpless-react-native';
import { APP_ID } from './Home';

export default function HeadlessPage() {
    const headlessModule = new OtplessHeadlessModule();
    const [result, setResult] = useState('Result view');
    const [form, setForm] = useState({
        phoneNumber: '',
        countryCode: '',
        otp: '',
        channelType: '',
        email: ''
    });

    useEffect(() => {
        headlessModule.initHeadless(APP_ID);
        headlessModule.setHeadlessCallback(onHeadlessResult);
        return () => {
            headlessModule.clearListener();
        };
    }, []);

    const handleChange = (fieldName: string, value: string) => {
        setForm((prevForm) => ({
            ...prevForm,
            [fieldName]: value,
        }));
    };

    const startHeadless = () => {
        let headlessRequest: any = {};
        const { phoneNumber, countryCode, otp, channelType } = form;
        if (phoneNumber) {
            headlessRequest = {
                phone: phoneNumber,
                countryCode,
                otp,
            };
        } else {
            headlessRequest = { channelType };
        }
        headlessModule.startHeadless(headlessRequest);
    };

    const onHeadlessResult = (data: any) => {
        const dataStr = JSON.stringify(data);
        setResult(dataStr);
    };

    const copyToClipboard = () => {
        Clipboard.setString(result);
        // alert("Result copied to clipboard!");
    };

    const showPhoneHintLib = async () => {
        const result = await headlessModule.showPhoneHint(true);
        console.log(result);

        // headlessModule.showPhoneHint(true, (result: any) => {
        //     console.log("Result: ", result)
        //     if (result.phoneNumber) {
        //         handleChange("phoneNumber", result.phoneNumber)
        //     } else {
        //         setResult(result.error)
        //     }
        // })

    }

    return (
        <ScrollView >

            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                placeholderTextColor="#999"
                value={form.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Country Code"
                placeholderTextColor="#999"
                value={form.countryCode}
                onChangeText={(text) => handleChange('countryCode', text)}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter email"
                placeholderTextColor="#999"
                value={form.email}
                onChangeText={(text) => handleChange('email', text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#999"
                value={form.otp}
                onChangeText={(text) => handleChange('otp', text)}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Channel Type"
                placeholderTextColor="#999"
                value={form.channelType}
                onChangeText={(text) => handleChange('channelType', text.toUpperCase())}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={startHeadless}>
                <Text style={styles.buttonText}>Start Headless</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={showPhoneHintLib}>
                <Text style={styles.buttonText}>Show phone hint lib</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={copyToClipboard}>
                <Text style={styles.buttonText}>Copy Result</Text>
            </TouchableOpacity>

            <Text style={styles.resultText}>{result}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        color: '#000000',
        borderRadius: 8,
        padding: 15,
        marginVertical: 10, 
        backgroundColor: '#fff',
        fontSize: 16,
    },
    primaryButton: {
        marginVertical: 10,
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultText: {
        marginTop: 20,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        maxWidth: 400, 
        textAlign: 'center',
    },
});
