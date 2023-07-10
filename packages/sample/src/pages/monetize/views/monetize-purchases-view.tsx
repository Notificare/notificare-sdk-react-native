import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Card from '../../../components/card-view';
import { mainStyles } from '../../../styles/styles';
import {
  NotificareMonetize,
  NotificarePurchase,
} from 'react-native-notificare-monetize';
import { MonetizeDataFieldView } from './monetize-data-field-view';
import { useSnackbarContext } from '../../../contexts/snackbar';

export const MonetizePurchasesView = () => {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [purchases, setPurchases] = useState<NotificarePurchase[]>([]);

  useEffect(
    function loadPurchases() {
      (async () => {
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
      })();
    },
    [addSnackbarInfoMessage]
  );

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
