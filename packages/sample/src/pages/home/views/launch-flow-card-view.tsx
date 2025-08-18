import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import Card from '../../../components/card-view';
// @ts-ignore
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Notificare } from 'react-native-notificare';
import { mainStyles } from '../../../styles/styles';
import { useSnackbarContext } from '../../../contexts/snackbar';

type LaunchFlowCardProps = {
  isReady: boolean;
};

export const LaunchFlowCard = (props: LaunchFlowCardProps) => {
  const { addSnackbarInfoMessage } = useSnackbarContext();

  async function launchNotificare() {
    try {
      console.log('=== Launching Notificare ===');
      await Notificare.launch();

      console.log('=== Launching Notificare finished ===');
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
      console.log('=== Unlaunching Notificare ===');
      await Notificare.unlaunch();

      console.log('=== Unlaunching Notificare finished ===');
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
          <MaterialIcons name="info" size={18} />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={mainStyles.flex_row}>
          <TouchableOpacity
            style={[
              mainStyles.button,
              !props.isReady && mainStyles.button_disabled,
            ]}
            disabled={!props.isReady}
            onPress={unlaunchNotificare}
          >
            <Text>Unlaunch</Text>
          </TouchableOpacity>

          <View style={mainStyles.vertical_divider} />

          <TouchableOpacity
            style={[
              mainStyles.button,
              props.isReady && mainStyles.button_disabled,
            ]}
            disabled={props.isReady}
            onPress={launchNotificare}
          >
            <Text>Launch</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};
