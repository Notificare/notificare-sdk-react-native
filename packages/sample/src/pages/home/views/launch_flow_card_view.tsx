import React, { useContext } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import Card from '../../../components/card_view';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import mainContext from '../../../app';
import { Notificare } from 'react-native-notificare';
import { mainStyles } from '../../../styles/styles';

export const LaunchFlowCard = () => {
  const addSnackbarInfoMessage = useContext(mainContext).addSnackbarInfoMessage;
  const isReady = useContext(mainContext).isReady;

  async function launchNotificare() {
    try {
      await Notificare.launch();
    } catch (e) {
      console.log('=== Error launching Notificare ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error launching Notificare.',
        type: 'error',
      });
    }
  }

  async function unlaunchNotificare() {
    try {
      await Notificare.unlaunch();
    } catch (e) {
      console.log('=== Error unlaunching Notificare ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error unlaunching Notificare.',
        type: 'error',
      });
    }
  }

  async function showLaunchFlowInfo() {
    try {
      const isConfiguredStatus = await Notificare.isConfigured();
      const isReadyStatus = await Notificare.isReady();

      Alert.alert(
        'Notificare Status',
        `isConfiguredInfo: ${isConfiguredStatus}
isReadyInfo: ${isReadyStatus}`,
        [
          {
            text: 'Ok',
            style: 'default',
          },
        ]
      );
    } catch (e) {
      console.log('=== Error getting isConfigured / isReady  ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error getting isConfigured / isReady.',
        type: 'error',
      });
    }
  }

  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Launch Flow</Text>

        <TouchableOpacity onPress={showLaunchFlowInfo}>
          <Icon name="info" size={18} />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={mainStyles.flex_row}>
          <TouchableOpacity
            style={[mainStyles.button, !isReady && mainStyles.button_disabled]}
            disabled={!isReady}
            onPress={unlaunchNotificare}
          >
            <Text>Unlaunch</Text>
          </TouchableOpacity>

          <View style={mainStyles.vertical_divider} />

          <TouchableOpacity
            style={[mainStyles.button, isReady && mainStyles.button_disabled]}
            disabled={isReady}
            onPress={launchNotificare}
          >
            <Text>Launch</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};
