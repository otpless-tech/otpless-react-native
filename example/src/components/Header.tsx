import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ title }: { title: string }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const FintechItem = ({ name }: { name: string }) => {
  return (
    <View>
      <Text style={styles.fintechText}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 15,
    backgroundColor: 'darkslateblue',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  fintechText: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingStart: 16,
    paddingEnd: 16,
    fontSize: 18,
  },
});

export default Header;
export { FintechItem };
