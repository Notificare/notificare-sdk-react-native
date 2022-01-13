import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NotificareBeacon } from 'react-native-notificare-geo';

export const Beacon: FC<BeaconProps> = ({ beacon }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{beacon.name}</Text>
      <Text style={styles.message}>
        {beacon.major}:{beacon.minor}
      </Text>
      <Text style={styles.caption}>{beacon.id}</Text>
      <Text style={styles.caption}>{beacon.proximity}</Text>
    </View>
  );
};

export interface BeaconProps {
  beacon: NotificareBeacon;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  message: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
  },
});
