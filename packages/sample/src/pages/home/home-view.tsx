import { ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LaunchFlowCard } from './views/launch-flow-card-view';
import { RemoteNotificationsCardView } from './views/remote-notifications-card-view';
import { DnDNotificationsCardView } from './views/dnd-card-view';
import { GeoCardView } from './views/geo-card-view';
import { InAppMessagingCardView } from './views/iam-card-view';
import { OtherFeaturesCardView } from './views/other-features-card-view';
import { CurrentDeviceCardView } from './views/current-device-view';
import { mainStyles } from '../../styles/styles';
import { Notificare } from 'react-native-notificare';

export const HomeView = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(function setupNotificareStatusListeners() {
    const subscriptions = [
      Notificare.onReady((_) => setIsReady(true)),

      Notificare.onUnlaunched(() => setIsReady(false)),
    ];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  return (
    <ScrollView>
      <View style={mainStyles.main_view_container}>
        <LaunchFlowCard isReady={isReady} />

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
