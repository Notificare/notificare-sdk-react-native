import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Switch } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../../../components/card_view';
import { Notificare } from 'react-native-notificare';
import { mainStyles } from '../../../styles/styles';
import mainContext from '../../../app';

export const DnDNotificationsCardView = () => {
  const addSnackbarInfoMessage = useContext(mainContext).addSnackbarInfoMessage;
  const [hasDndEnabled, setHasDndEnabled] = useState(false);

  useEffect(function checkDndStatus() {
    (async () => {
      try {
        const dnd = await Notificare.device().fetchDoNotDisturb();
        setHasDndEnabled(dnd != null);
        console.log('=== DnD fetched successfully ===');
      } catch (e) {
        console.log('=== Error fetching DnD ===');
        console.log(JSON.stringify(e));

        addSnackbarInfoMessage({
          message: 'Error cleaning DnD.',
          type: 'error',
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateDndStatus(enabled: boolean) {
    setHasDndEnabled(enabled);

    if (!enabled) {
      try {
        await Notificare.device().clearDoNotDisturb();
        console.log('=== DnD cleared successfully ===');

        addSnackbarInfoMessage({
          message: 'DnD cleared successfully.',
          type: 'success',
        });
      } catch (e) {
        console.log('=== Error cleaning DnD ===');
        console.log(JSON.stringify(e));

        addSnackbarInfoMessage({
          message: 'Error cleaning DnD.',
          type: 'error',
        });
      }

      return;
    }

    try {
      await Notificare.device().updateDoNotDisturb({
        start: '23:00',
        end: '08:00',
      });
      console.log('=== DnD updated successfully ===');

      addSnackbarInfoMessage({
        message: 'DnD updated successfully.',
        type: 'success',
      });

      return;
    } catch (e) {
      console.log('=== Error updating DnD ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error updating DnD.',
        type: 'error',
      });
    }
  }

  return (
    <View>
      <View style={mainStyles.sub_section_margin} />

      <Card>
        <View style={mainStyles.row}>
          <Icon name="do-not-disturb-on" size={18} />

          <Text style={mainStyles.subtitle}>Do Not Disturb</Text>

          <Switch
            style={mainStyles.switch}
            value={hasDndEnabled}
            onValueChange={updateDndStatus}
          />
        </View>
      </Card>
    </View>
  );
};
