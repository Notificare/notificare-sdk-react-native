import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  NotificareAsset,
  NotificareAssets,
} from 'react-native-notificare-assets';
import { useSnackbarContext } from '@/components/contexts/snackbar';
import { mainStyles } from '@/styles/styles';
import Card from '@/components/CardView';
import { AssetDetailsView } from '@/components/assets/asset-details-view';

export default function AssetsScreen() {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [assetsGroup, setAssetsGroup] = useState('');
  const [assets, setAssets] = useState<NotificareAsset[]>([]);

  async function fetchAssets() {
    setAssets([]);

    try {
      const result = await NotificareAssets.fetch(assetsGroup);
      setAssets(result);
      setAssetsGroup('');
      console.log('=== Fetched assets successfully ===');

      addSnackbarInfoMessage({
        message: 'Fetched assets successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error fetching assets ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error fetching assets.',
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
            onChangeText={setAssetsGroup}
            value={assetsGroup}
          />

          <View style={mainStyles.divider} />

          <TouchableOpacity
            style={assetsGroup.length === 0 && mainStyles.button_disabled}
            disabled={assetsGroup.length === 0}
            onPress={fetchAssets}
          >
            <View style={mainStyles.button}>
              <Text>Search</Text>
            </View>
          </TouchableOpacity>
        </Card>

        {Object.values(assets).map((asset) => {
          return <AssetDetailsView key={asset.title} asset={asset} />;
        })}
      </View>
    </ScrollView>
  );
}
