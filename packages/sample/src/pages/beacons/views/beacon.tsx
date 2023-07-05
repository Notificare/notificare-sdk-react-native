import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { NotificareBeacon } from 'react-native-notificare-geo';
import { beaconDetailsStyles } from '../../../styles/styles-beacons';

export const Beacon: FC<BeaconProps> = ({ beacon }) => {
  return (
    <View style={beaconDetailsStyles.container}>
      <Text style={beaconDetailsStyles.title}>{beacon.name}</Text>

      <Text style={beaconDetailsStyles.message}>
        {beacon.major}:{beacon.minor}
      </Text>

      <Text style={beaconDetailsStyles.caption}>{beacon.id}</Text>

      <Text style={beaconDetailsStyles.caption}>{beacon.proximity}</Text>
    </View>
  );
};

export interface BeaconProps {
  beacon: NotificareBeacon;
}
