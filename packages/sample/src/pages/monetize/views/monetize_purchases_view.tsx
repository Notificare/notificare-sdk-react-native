import React, { useContext, useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Card from '../../../components/card_view';
import { mainStyles } from '../../../styles/styles';
import {
  NotificareMonetize,
  NotificarePurchase,
} from 'react-native-notificare-monetize';
import { MonetizeDataFieldView } from './monetize_data_field_view';
import mainContext from '../../../app';

export const MonetizePurchasesView = () => {
  const addSnackbarInfoMessage = useContext(mainContext).addSnackbarInfoMessage;
  const [purchases, setPurchases] = useState<NotificarePurchase[]>([]);

  useEffect(function loadInitialData() {
    (async () => {
      await getPurchases();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getPurchases() {
    try {
      const result = await NotificareMonetize.getPurchases();
      setPurchases(result);
      console.log('=== Got purchases successfully ===');

      addSnackbarInfoMessage({
        message: 'Got purchases successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error getting purchases ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error getting purchases.',
        type: 'error',
      });
    }
  }

  return (
    <View style={mainStyles.main_view_container}>
      {purchases.length === 0 ? (
        <View style={mainStyles.empty_state_container}>
          <Text>No purchases found</Text>
        </View>
      ) : (
        <ScrollView>
          {purchases.map((purchase) => {
            return (
              <View key={purchase.id}>
                <View style={mainStyles.section_title_row} />

                <Card>
                  <MonetizeDataFieldView label={'ID'} value={purchase.id} />

                  <View style={mainStyles.data_field_divider} />

                  <MonetizeDataFieldView
                    label={'Identifier'}
                    value={purchase.productIdentifier}
                  />

                  <View style={mainStyles.data_field_divider} />

                  <MonetizeDataFieldView label={'Time'} value={purchase.time} />
                </Card>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};
