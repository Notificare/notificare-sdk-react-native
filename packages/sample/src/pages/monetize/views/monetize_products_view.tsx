import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Card from '../../../components/card_view';
import { mainStyles } from '../../../styles/styles';
import {
  NotificareMonetize,
  NotificareProduct,
} from 'react-native-notificare-monetize';
// @ts-ignore
import { MonetizeDataFieldView } from './monetize_data_field_view';
import mainContext from '../../../app';

export const MonetizeProductsView = () => {
  const addSnackbarInfoMessage = useContext(mainContext).addSnackbarInfoMessage;
  const [products, setProducts] = useState<NotificareProduct[]>([]);

  useEffect(function loadInitialData() {
    (async () => {
      await getProducts();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getProducts() {
    try {
      const result = await NotificareMonetize.getProducts();

      setProducts(result);
      console.log('=== Got products successfully ===');

      addSnackbarInfoMessage({
        message: 'Got products successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error getting product ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error getting product.',
        type: 'error',
      });
    }
  }

  async function purchase(product: NotificareProduct) {
    try {
      await NotificareMonetize.startPurchaseFlow(product);
      console.log('=== Product purchased successfully ===');

      addSnackbarInfoMessage({
        message: 'Product purchased successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error purchasing product ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error purchasing product.',
        type: 'error',
      });
    }
  }

  return (
    <View style={mainStyles.main_view_container}>
      {products.length === 0 ? (
        <View style={mainStyles.empty_state_container}>
          <Text>No products found</Text>
        </View>
      ) : (
        <ScrollView>
          {products.map((product) => {
            return (
              <View key={product.id}>
                <View style={mainStyles.section_title_row} />

                <Card>
                  <MonetizeDataFieldView label={'ID'} value={product.id} />

                  <View style={mainStyles.data_field_divider} />

                  <MonetizeDataFieldView label={'Name'} value={product.name} />

                  <View style={mainStyles.data_field_divider} />

                  <MonetizeDataFieldView label={'Type'} value={product.type} />

                  <View style={mainStyles.data_field_divider} />

                  <MonetizeDataFieldView
                    label={'Identifier'}
                    value={product.identifier}
                  />

                  <View style={mainStyles.data_field_divider} />

                  <MonetizeDataFieldView
                    label={'Price'}
                    value={product.storeDetails?.price.toString()}
                  />

                  <View style={mainStyles.divider} />

                  <TouchableOpacity onPress={() => purchase(product)}>
                    <View style={mainStyles.button}>
                      <Text>Buy</Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};
