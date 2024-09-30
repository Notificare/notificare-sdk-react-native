import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../../../components/card-view';
import { mainStyles } from '../../../styles/styles';
import { useSnackbarContext } from '../../../contexts/snackbar';

type AuthenticationCardProps = {
  isLoggedIn: boolean;
  isDeviceRegistered: boolean;
  startLoginFLow: () => void;
  startLogoutFlow: () => void;
};

export const AuthenticationCardView = (props: AuthenticationCardProps) => {
  const { isLoggedIn, isDeviceRegistered, startLoginFLow, startLogoutFlow } =
    props;

  const { addSnackbarInfoMessage } = useSnackbarContext();

  async function showAuthenticationFlowInfo() {
    try {
      Alert.alert(
        'Authentication Status',
        `isLoggedIn: ${isLoggedIn}
isDeviceRegistered: ${isDeviceRegistered}`,
        [
          {
            text: 'Ok',
            style: 'default',
          },
        ]
      );
    } catch (e) {
      console.log('=== Error getting isConfigured / isReady  ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error getting isConfigured / isReady.',
        type: 'error',
      });
    }
  }

  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Authentication Flow</Text>

        <TouchableOpacity onPress={showAuthenticationFlowInfo}>
          <Icon name="info" size={18} />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={mainStyles.flex_row}>
          <TouchableOpacity
            style={[
              mainStyles.button,
              isLoggedIn && mainStyles.button_disabled,
            ]}
            disabled={isLoggedIn}
            onPress={startLoginFLow}
          >
            <Text>Login</Text>
          </TouchableOpacity>

          <View style={mainStyles.vertical_divider} />

          <TouchableOpacity
            style={[
              mainStyles.button,
              !isLoggedIn && mainStyles.button_disabled,
            ]}
            disabled={!isLoggedIn}
            onPress={startLogoutFlow}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};
