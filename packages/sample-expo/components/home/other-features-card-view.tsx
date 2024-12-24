import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { mainStyles } from '@/styles/styles';
import Card from '@/components/CardView';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

export const OtherFeaturesCardView = () => {
  function onScannablesClicked() {
    router.navigate('/scannables');
  }

  function onAssetsClicked() {
    router.navigate('/assets');
  }

  function onCustomEventClicked() {
    router.navigate('/custom-events');
  }

  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Other Features</Text>
      </View>

      <Card>
        <TouchableOpacity onPress={onScannablesClicked}>
          <View style={mainStyles.row}>
            <MaterialIcons name="qr-code-scanner" size={18} />

            <Text style={mainStyles.subtitle}>Scannables</Text>

            <MaterialIcons
              name="arrow-forward-ios"
              size={14}
              color="#00000026"
            />
          </View>
        </TouchableOpacity>

        <View style={mainStyles.divider_margin} />

        <TouchableOpacity onPress={onAssetsClicked}>
          <View style={mainStyles.row}>
            <MaterialIcons name="folder" size={18} />

            <Text style={mainStyles.subtitle}>Assets</Text>

            <MaterialIcons
              name="arrow-forward-ios"
              size={14}
              color="#00000026"
            />
          </View>
        </TouchableOpacity>

        <View style={mainStyles.divider_margin} />

        <TouchableOpacity onPress={onCustomEventClicked}>
          <View style={mainStyles.row}>
            <MaterialIcons name="add-alert" size={18} />

            <Text style={mainStyles.subtitle}>Custom Events</Text>

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
