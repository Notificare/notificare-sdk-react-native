import { ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Notificare } from 'react-native-notificare';
import { mainStyles } from '@/styles/styles';
import { LaunchFlowCard } from '@/components/home/launch-flow-card-view';
import { CurrentDeviceCardView } from '@/components/home/current-device-view';
import { RemoteNotificationsCardView } from '@/components/home/remote-notifications-card-view';
import { DnDNotificationsCardView } from '@/components/home/dnd-card-view';
import { GeoCardView } from '@/components/home/geo-card-view';
import { InAppMessagingCardView } from '@/components/home/iam-card-view';
import { OtherFeaturesCardView } from '@/components/home/other-features-card-view';
import { NotificarePush } from 'react-native-notificare-push';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
import { NotificareScannables } from 'react-native-notificare-scannables';
import { NotificareGeo } from 'react-native-notificare-geo';
import {
  BackgroundCallbackBeaconEntered,
  BackgroundCallbackBeaconExited,
  BackgroundCallbackBeaconsRanged,
  BackgroundCallbackLocationUpdated,
  BackgroundCallbackRegionEntered,
  BackgroundCallbackRegionExited,
} from '@/components/background/background-callback';

export default function HomeScreen() {
  const [isReady, setIsReady] = useState(false);

  useEffect(function setupListeners() {
    const subscriptions = [
      Notificare.onReady(async (_) => {
        setIsReady(true);

        await handleDeferredLink();
        setupBackgroundCallbacks();
      }),

      Notificare.onUnlaunched(() => setIsReady(false)),

      NotificarePush.onNotificationOpened(async (notification) => {
        await NotificarePushUI.presentNotification(notification);
      }),

      NotificarePush.onNotificationActionOpened(
        async ({ notification, action }) => {
          await NotificarePushUI.presentAction(notification, action);
        }
      ),

      NotificareScannables.onScannableDetected(async (scannable) => {
        if (scannable.notification != null) {
          await NotificarePushUI.presentNotification(scannable.notification);
        }
      }),
    ];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  useEffect(function launch() {
    (async () => {
      await NotificarePush.setPresentationOptions(['banner', 'badge', 'sound']);
      await Notificare.launch();

      Notificare.onReady(async (_) => {
        setIsReady(true);

        await handleDeferredLink();
        setupBackgroundCallbacks();
      });
    })();
  }, []);

  async function handleDeferredLink() {
    try {
      if (!(await Notificare.canEvaluateDeferredLink())) {
        return;
      }

      const evaluate = await Notificare.evaluateDeferredLink();
      console.log(`Did evaluate deferred link: ${evaluate}`);
    } catch (e) {
      console.log('=== Error evaluating deferred link ===');
      console.log(JSON.stringify(e));
    }
  }

  function setupBackgroundCallbacks() {
    NotificareGeo.setLocationUpdatedBackgroundCallback(
      BackgroundCallbackLocationUpdated
    );

    NotificareGeo.setRegionEnteredBackgroundCallback(
      BackgroundCallbackRegionEntered
    );

    NotificareGeo.setRegionExitedBackgroundCallback(
      BackgroundCallbackRegionExited
    );

    NotificareGeo.setBeaconEnteredBackgroundCallback(
      BackgroundCallbackBeaconEntered
    );

    NotificareGeo.setBeaconExitedBackgroundCallback(
      BackgroundCallbackBeaconExited
    );

    NotificareGeo.setBeaconsRangedBackgroundCallback(
      BackgroundCallbackBeaconsRanged
    );
  }

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
}
