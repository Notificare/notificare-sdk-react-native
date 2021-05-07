import * as React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export const TextButton: React.FC<TextButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableHighlight>
  );
};

export interface TextButtonProps {
  text: string;
  onPress: () => void;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    padding: 16,
  },
});
