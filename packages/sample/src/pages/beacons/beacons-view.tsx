import { FlatList, Text, View } from 'react-native';
import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  NotificareBeacon,
  NotificareGeo,
  NotificareRegion,
} from 'react-native-notificare-geo';
import { Beacon } from './views/beacon';
import { beaconsStyles } from '../../styles/styles-beacons';

export const BeaconsView: FC = () => {
  const navigation = useNavigation();
  const [data, setData] = useState<{
    region: NotificareRegion;
    beacons: NotificareBeacon[];
  }>();

  useEffect(function setupListeners() {
    const subscriptions = [NotificareGeo.onBeaconsRanged(setData)];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  useLayoutEffect(
    function setupToolbarActions() {
      navigation.setOptions({ title: data?.region?.name ?? 'Beacons' });
    },
    [navigation, data]
  );

  return (
    <>
      {(data == null || data.beacons.length === 0) && (
        <View style={beaconsStyles.emptyStateContainer}>
          <Text>No beacons in range.</Text>
        </View>
      )}

      {data != null && data.beacons.length > 0 && (
        <FlatList
          data={data.beacons}
          renderItem={({ item }) => <Beacon beacon={item} />}
        />
      )}
    </>
  );
};
