import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Card from '../../components/card_view';
import { mainStyles } from '../../styles/styles';
import { NotificareScannables } from 'react-native-notificare-scannables';
import mainContext from '../../app';

export const ScannablesView = () => {
  const addSnackbarInfoMessage = useContext(mainContext).addSnackbarInfoMessage;
  const [isNfcAvailable, setIsNfcAvailable] = useState(false);

  useEffect(function loadInitialData() {
    (async () => {
      try {
        const canStartNfc =
          await NotificareScannables.canStartNfcScannableSession();
        setIsNfcAvailable(canStartNfc);
      } catch (e) {
        console.log('=== Error checking NFC availability ===');
        console.log(JSON.stringify(e));
      }
    })();
  }, []);

  async function startQrCodeScannableSession() {
    try {
      await NotificareScannables.startQrCodeScannableSession();
    } catch (e) {
      console.log('=== Error starting QR Code scannable session ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error starting QR Code scannable session.',
        type: 'error',
      });
    }
  }

  async function startNfcScannableSession() {
    try {
      await NotificareScannables.startNfcScannableSession();
    } catch (e) {
      console.log('=== Error starting NFC scannable session ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error starting NFC scannable session.',
        type: 'error',
      });
    }
  }

  return (
    <ScrollView>
      <View style={mainStyles.main_view_container}>
        <View style={mainStyles.section_title_row} />

        <Card>
          <TouchableOpacity onPress={startQrCodeScannableSession}>
            <View style={mainStyles.button}>
              <Text>QR Code Scannable Session</Text>
            </View>
          </TouchableOpacity>

          <View style={mainStyles.divider} />

          <TouchableOpacity
            style={!isNfcAvailable && mainStyles.button_disabled}
            disabled={!isNfcAvailable}
            onPress={startNfcScannableSession}
          >
            <View style={mainStyles.button}>
              <Text>NFC Scannable Session</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
};
