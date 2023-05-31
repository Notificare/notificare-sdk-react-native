import { ScrollView, View } from 'react-native';
import React, { useContext } from 'react';
import { LaunchFlowCard } from './views/launch_flow_card_view';
import { RemoteNotificationsCardView } from './views/remote_notifications_card_view';
import { DnDNotificationsCardView } from './views/dnd_card_view';
import { GeoCardView } from './views/geo_card_view';
import { InAppMessagingCardView } from './views/iam_card_view';
import { OtherFeaturesCardView } from './views/other_features_card_view';
import { CurrentDeviceCardView } from './views/current_device_view';
import { mainStyles } from '../../styles/styles';
import mainContext from '../../app';

export const HomeView = () => {
  const isReady = useContext(mainContext).isReady;
  return (
    <ScrollView>
      <View style={mainStyles.main_view_container}>
        <LaunchFlowCard />

        {isReady && (
          <>
            <CurrentDeviceCardView />

            <RemoteNotificationsCardView />

            <DnDNotificationsCardView />

            <GeoCardView />

            <InAppMessagingCardView />

            <OtherFeaturesCardView />
          </>
        )}
      </View>
    </ScrollView>
  );
};
