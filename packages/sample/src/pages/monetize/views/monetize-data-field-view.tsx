import { Text, View } from 'react-native';
import { mainStyles } from '../../../styles/styles';
import React from 'react';

export const MonetizeDataFieldView = (props: {
  label: string;
  value: string | undefined | null;
}) => {
  return (
    <View style={mainStyles.row}>
      <Text style={mainStyles.data_field_label}>{props.label}</Text>

      <Text
        style={mainStyles.data_field_value}
        ellipsizeMode={'head'}
        numberOfLines={1}
      >
        {props.value ?? '-'}
      </Text>
    </View>
  );
};
