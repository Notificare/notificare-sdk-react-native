import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
// @ts-ignore
import { NotificareInAppMessaging } from 'react-native-notificare-in-app-messaging';
import { useSnackbarContext } from '@/components/contexts/snackbar';
import { mainStyles } from '@/styles/styles';
import Card from '@/components/CardView';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const InAppMessagingCardView = () => {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [evaluateContext, setEvaluateContext] = useState(false);
  const [suppressed, setSuppressed] = useState(false);

  async function updateSuppressMessagesStatus(enabled: boolean) {
    setSuppressed(enabled);

    try {
      await NotificareInAppMessaging.setMessagesSuppressed(
        enabled,
        evaluateContext
      );
      console.log('=== IAM Suppress status updated successfully ===');

      addSnackbarInfoMessage({
        message: 'IAM Suppress status updated successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error updating IAM suppress status ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error updating IAM suppress status.',
        type: 'error',
      });
    }
  }

  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>In App Messaging</Text>
      </View>

      <Card>
        <View style={mainStyles.row}>
          <MaterialIcons name="mark-chat-unread" size={18} />

          <Text style={mainStyles.subtitle}>Evaluate Context</Text>

          <Switch
            style={mainStyles.switch}
            value={evaluateContext}
            onValueChange={setEvaluateContext}
          />
        </View>

        <View style={mainStyles.divider_margin} />

        <View style={mainStyles.row}>
          <MaterialIcons name="speaker-notes-off" size={18} />

          <Text style={mainStyles.subtitle}>Suppressed</Text>

          <Switch
            style={mainStyles.switch}
            value={suppressed}
            onValueChange={updateSuppressMessagesStatus}
          />
        </View>
      </Card>
    </View>
  );
};
