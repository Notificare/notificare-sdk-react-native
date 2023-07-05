import React from 'react';
import { View } from 'react-native';
import Card from '../../../components/card-view';
import { mainStyles } from '../../../styles/styles';
import { NotificareAsset } from 'react-native-notificare-assets';
import { AssetDataFieldView } from './asset-data-field-view';
import { AssetUrlContentFieldView } from './asset-url-content-field-view';

export const AssetDetailsView = (props: { asset: NotificareAsset }) => {
  return (
    <View>
      <View style={mainStyles.section_title_row} />

      <Card>
        <AssetDataFieldView label={'Title'} value={props.asset.title} />

        <View style={mainStyles.data_field_divider} />

        <AssetDataFieldView
          label={'Description'}
          value={props.asset.description}
        />

        <View style={mainStyles.data_field_divider} />

        <AssetDataFieldView label={'Key'} value={props.asset.key} />

        <View style={mainStyles.data_field_divider} />

        <AssetUrlContentFieldView label={'Url'} url={props.asset.url} />

        <View style={mainStyles.data_field_divider} />

        <AssetDataFieldView
          label={'Button label'}
          value={props.asset.button?.label}
        />

        <View style={mainStyles.data_field_divider} />

        <AssetDataFieldView
          label={'Button Action'}
          value={props.asset.button?.action}
        />

        <View style={mainStyles.data_field_divider} />

        <AssetDataFieldView
          label={'Content type'}
          value={props.asset.metaData?.contentType}
        />

        <View style={mainStyles.data_field_divider} />

        <AssetDataFieldView
          label={'Original File Name'}
          value={props.asset.metaData?.originalFileName}
        />

        <View style={mainStyles.data_field_divider} />

        <AssetDataFieldView
          label={'Content Length'}
          value={props.asset.metaData?.contentLength.toString()}
        />

        <View style={mainStyles.data_field_divider} />

        <AssetDataFieldView
          label={'Extra'}
          value={Object.keys(props.asset.extra).length > 0 ? '' : null}
        />

        {Object.entries(props.asset.extra).map(([label, value], index) => {
          return (
            <View key={label}>
              <AssetDataFieldView label={label} value={value.toString()} />
              {index + 1 < Object.keys(props.asset.extra).length && (
                <View style={mainStyles.data_field_divider} />
              )}
            </View>
          );
        })}
      </Card>
    </View>
  );
};
