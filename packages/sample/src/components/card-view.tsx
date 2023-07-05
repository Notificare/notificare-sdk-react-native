import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = (props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => {
  return <View style={{ ...styles.card }}>{props.children}</View>;
};
const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    elevation: 1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
export default Card;
