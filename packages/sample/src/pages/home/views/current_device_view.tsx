import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../../../components/card_view';
import { mainStyles } from '../../../styles/styles';
import { useNavigation } from '@react-navigation/native';

export const CurrentDeviceCardView = () => {
  const navigation = useNavigation();

  function onCurrentDeviceClicked() {
    // @ts-ignore
    navigation.navigate('Device');
  }
  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Device</Text>
      </View>

      <Card>
        <TouchableOpacity onPress={onCurrentDeviceClicked}>
          <View style={mainStyles.row}>
            <Icon name="smartphone" size={18} />

            <Text style={mainStyles.subtitle}>Current Device</Text>

            <Icon name="arrow-forward-ios" size={14} color="#00000026" />
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
