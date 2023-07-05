import React from 'react';
import { Image, Text, View } from 'react-native';
import { mainStyles } from '../../../styles/styles';

export const AssetUrlContentFieldView = (props: {
  label: string;
  url: string | undefined;
}) => {
  return (
    <View style={mainStyles.row}>
      <Text style={mainStyles.data_field_label}>{props.label}</Text>

      {props.url !== undefined ? (
        <Attachment url={props.url} />
      ) : (
        <Text>-</Text>
      )}
    </View>
  );
};

const Attachment = (props: { url: string }) => {
  return <Image source={{ uri: props.url, width: 96, height: 64 }} />;
};
