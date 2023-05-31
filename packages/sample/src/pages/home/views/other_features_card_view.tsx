import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../../../components/card_view';
import { mainStyles } from '../../../styles/styles';
import { useNavigation } from '@react-navigation/native';

export const OtherFeaturesCardView = () => {
  const navigation = useNavigation();

  function onScannablesClicked() {
    // @ts-ignore
    navigation.navigate('Scannables');
  }

  function onAssetsClicked() {
    // @ts-ignore
    navigation.navigate('Assets');
  }

  function onMonetizeClicked() {
    // @ts-ignore
    navigation.navigate('Monetize');
  }

  function onCustomEventClicked() {
    // @ts-ignore
    navigation.navigate('Custom Event');
  }

  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Other Features</Text>
      </View>

      <Card>
        <TouchableOpacity onPress={onScannablesClicked}>
          <View style={mainStyles.row}>
            <Icon name="qr-code-scanner" size={18} />

            <Text style={mainStyles.subtitle}>Scannables</Text>

            <Icon name="arrow-forward-ios" size={14} color="#00000026" />
          </View>
        </TouchableOpacity>

        <View style={mainStyles.divider_margin} />

        <TouchableOpacity onPress={onAssetsClicked}>
          <View style={mainStyles.row}>
            <Icon name="folder" size={18} />

            <Text style={mainStyles.subtitle}>Assets</Text>

            <Icon name="arrow-forward-ios" size={14} color="#00000026" />
          </View>
        </TouchableOpacity>

        <View style={mainStyles.divider_margin} />

        <TouchableOpacity onPress={onMonetizeClicked}>
          <View style={mainStyles.row}>
            <Icon name="shopping-bag" size={18} />

            <Text style={mainStyles.subtitle}>Monetize</Text>

            <Icon name="arrow-forward-ios" size={14} color="#00000026" />
          </View>
        </TouchableOpacity>

        <View style={mainStyles.divider_margin} />

        <TouchableOpacity onPress={onCustomEventClicked}>
          <View style={mainStyles.row}>
            <Icon name="add-alert" size={18} />

            <Text style={mainStyles.subtitle}>Custom Events</Text>

            <Icon name="arrow-forward-ios" size={14} color="#00000026" />
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
