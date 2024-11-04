import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Notificare } from 'react-native-notificare';
import { useSnackbarContext } from '@/components/contexts/snackbar';
import { mainStyles } from '@/styles/styles';
import Card from '@/components/CardView';
import { Checkbox } from 'expo-checkbox';

export default function CustomEventsScreen() {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [eventName, setEventName] = useState('');
  const [shouldIncludeDataFields, setShouldIncludeDataFields] = useState(false);
  const dataFields = {
    key_one: 'value_one',
    key_two: 'value_two',
  };

  async function registerCustomEvent() {
    try {
      if (shouldIncludeDataFields) {
        await Notificare.events().logCustom(eventName, dataFields);

        setShouldIncludeDataFields(false);
      } else {
        await Notificare.events().logCustom(eventName);
      }

      setEventName('');
      console.log('=== Logged custom event successfully ===');

      addSnackbarInfoMessage({
        message: 'Logged custom event successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error logging custom event ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error logging custom event.',
        type: 'error',
      });
    }
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={mainStyles.main_view_container}>
        <View style={mainStyles.section_title_row} />

        <Card>
          <TextInput
            style={mainStyles.input_text}
            placeholder={'Enter Asset Group'}
            onChangeText={setEventName}
            value={eventName}
          />

          <View style={mainStyles.divider} />

          <TouchableOpacity
            style={eventName.length === 0 && mainStyles.button_disabled}
            disabled={eventName.length === 0}
            onPress={registerCustomEvent}
          >
            <View style={mainStyles.button}>
              <Text>Register</Text>
            </View>
          </TouchableOpacity>
        </Card>

        <View style={mainStyles.check_box_row}>
          <Checkbox
            style={mainStyles.checkBox}
            value={shouldIncludeDataFields}
            onValueChange={setShouldIncludeDataFields}
          />

          <Text>Include data fields</Text>
        </View>
      </View>
    </ScrollView>
  );
}
