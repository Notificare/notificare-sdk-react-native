import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Card from '../../components/card-view';
import { mainStyles } from '../../styles/styles';
import { Notificare } from 'react-native-notificare';
import { DeviceDataFieldView } from './views/device-details-field-view';
import { useSnackbarContext } from '../../contexts/snackbar';

export const DeviceView = () => {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [deviceData, setDeviceData] = useState<Record<string, string>>({});
  const [userData, setUserData] = useState<Record<string, string>>({});

  const loadDeviceData = useCallback(async () => {
    try {
      const currentDevice = await Notificare.device().getCurrentDevice();
      console.log('=== Got device data successfully ===');

      if (currentDevice == null) {
        return;
      }

      const preferredLanguage =
        await Notificare.device().getPreferredLanguage();
      const userDataResult = await Notificare.device().fetchUserData();
      const currentDeviceData: Record<string, string> = {};

      currentDeviceData.ID = currentDevice.id;
      currentDeviceData['User Name'] = currentDevice.userName ?? '-';
      currentDeviceData.Registered = currentDevice.lastRegistered;
      currentDeviceData.DnD =
        currentDevice.dnd != null
          ? `${currentDevice.dnd.start} : ${currentDevice.dnd.end}`
          : '-';
      currentDeviceData.Region = currentDevice.region;
      currentDeviceData.Language = currentDevice.language;
      currentDeviceData['Preferred Language'] = preferredLanguage ?? '-';
      currentDeviceData.Transport = currentDevice.transport;
      currentDeviceData['OS Version'] = currentDevice.osVersion;
      currentDeviceData['SDK Version'] = currentDevice.sdkVersion;

      setDeviceData(currentDeviceData);
      setUserData(userDataResult);
    } catch (e) {
      console.log('=== Error getting device data ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error getting device data.',
        type: 'error',
      });
    }
  }, [addSnackbarInfoMessage]);

  useEffect(
    function loadInitialData() {
      (async () => {
        await loadDeviceData();
      })();
    },
    [loadDeviceData]
  );

  async function registerDeviceWithUser() {
    try {
      await Notificare.device().register('helder@notifica.re', 'Helder Pinhal');
      console.log('=== Registered device with user successfully ===');

      addSnackbarInfoMessage({
        message: 'Registered device with user successfully.',
        type: 'success',
      });

      await loadDeviceData();
    } catch (e) {
      console.log('=== Error registering device with user ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error registering device with user.',
        type: 'error',
      });
    }
  }

  async function registerDeviceAsAnonymous() {
    try {
      await Notificare.device().register(null, null);
      console.log('=== Registered device as anonymous successfully ===');

      addSnackbarInfoMessage({
        message: 'Registered device as anonymous successfully.',
        type: 'success',
      });

      await loadDeviceData();
    } catch (e) {
      console.log('=== Error registering device as anonymous ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error registering device as anonymous.',
        type: 'error',
      });
    }
  }

  async function updatePreferredLanguage() {
    try {
      await Notificare.device().updatePreferredLanguage('nl-NL');
      console.log('=== Updated preferred language successfully ===');

      addSnackbarInfoMessage({
        message: 'Updated preferred language successfully.',
        type: 'success',
      });

      await loadDeviceData();
    } catch (e) {
      console.log('=== Error updating preferred language ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error updating preferred language.',
        type: 'error',
      });
    }
  }

  async function clearPreferredLanguage() {
    try {
      await Notificare.device().updatePreferredLanguage(null);
      console.log('=== Cleared preferred language successfully ===');

      addSnackbarInfoMessage({
        message: 'Cleared preferred language successfully.',
        type: 'success',
      });

      await loadDeviceData();
    } catch (e) {
      console.log('=== Error cleaning preferred language ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error cleaning preferred language.',
        type: 'error',
      });
    }
  }

  async function updateUserData() {
    try {
      await Notificare.device().updateUserData({
        firstName: 'Helder',
        lastName: 'Pinhal',
      });
      console.log('=== Updated user data successfully ===');

      addSnackbarInfoMessage({
        message: 'Updated user data successfully.',
        type: 'success',
      });

      await loadDeviceData();
    } catch (e) {
      console.log('=== Error updating user data ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error updating user data.',
        type: 'error',
      });
    }
  }

  return (
    <ScrollView>
      <View style={mainStyles.main_view_container}>
        <View style={mainStyles.section_title_row}>
          <Text style={mainStyles.section_title}>Current Device</Text>
        </View>

        <Card>
          {Object.entries(deviceData).map(([label, value], index) => {
            return (
              <View key={label}>
                <DeviceDataFieldView label={label} value={value} />

                {index + 1 < Object.keys(deviceData).length && (
                  <View style={mainStyles.data_field_divider} />
                )}
              </View>
            );
          })}
        </Card>

        <View style={mainStyles.section_title_row}>
          <Text style={mainStyles.section_title}>User Data</Text>
        </View>

        <Card>
          {Object.keys(userData).length === 0 ? (
            <View style={mainStyles.row}>
              <Text style={mainStyles.data_field_label}>No Data</Text>
            </View>
          ) : (
            Object.entries(userData).map(([label, value], index) => {
              return (
                <View key={label}>
                  <DeviceDataFieldView label={label} value={value} />

                  {index + 1 < Object.keys(userData).length && (
                    <View style={mainStyles.data_field_divider} />
                  )}
                </View>
              );
            })
          )}
        </Card>

        <View style={mainStyles.section_title_row}>
          <Text style={mainStyles.section_title}>Register Device</Text>
        </View>

        <Card>
          <TouchableOpacity onPress={registerDeviceWithUser}>
            <View style={mainStyles.button}>
              <Text>Register with User</Text>
            </View>
          </TouchableOpacity>

          <View style={mainStyles.divider} />

          <TouchableOpacity onPress={registerDeviceAsAnonymous}>
            <View style={mainStyles.button}>
              <Text>Register as Anonymous</Text>
            </View>
          </TouchableOpacity>
        </Card>

        <View style={mainStyles.section_title_row}>
          <Text style={mainStyles.section_title}>Language</Text>
        </View>

        <Card>
          <TouchableOpacity onPress={updatePreferredLanguage}>
            <View style={mainStyles.button}>
              <Text>Update preferred language</Text>
            </View>
          </TouchableOpacity>

          <View style={mainStyles.divider} />

          <TouchableOpacity onPress={clearPreferredLanguage}>
            <View style={mainStyles.button}>
              <Text>Clear preferred language</Text>
            </View>
          </TouchableOpacity>
        </Card>

        <View style={mainStyles.section_title_row}>
          <Text style={mainStyles.section_title}>User Data</Text>
        </View>

        <Card>
          <TouchableOpacity onPress={updateUserData}>
            <View style={mainStyles.button}>
              <Text>Update user data</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
};
