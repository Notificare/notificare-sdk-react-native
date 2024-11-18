import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { mainStyles } from '@/styles/styles';
import Card from '@/components/CardView';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

export const CurrentDeviceCardView = () => {
  function onCurrentDeviceClicked() {
    router.navigate('/device');
  }
  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Device</Text>
      </View>

      <Card>
        <TouchableOpacity onPress={onCurrentDeviceClicked}>
          <View style={mainStyles.row}>
            <MaterialIcons name="smartphone" size={18} />

            <Text style={mainStyles.subtitle}>Current Device</Text>

            <MaterialIcons
              name="arrow-forward-ios"
              size={14}
              color="#00000026"
            />
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
