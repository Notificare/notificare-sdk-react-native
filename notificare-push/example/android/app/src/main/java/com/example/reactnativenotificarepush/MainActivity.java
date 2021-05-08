package com.example.reactnativenotificarepush;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;

import re.notifica.push.NotificarePush;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "NotificarePushExample";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    NotificarePush.INSTANCE.handleTrampolineIntent(getIntent());
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    NotificarePush.INSTANCE.handleTrampolineIntent(intent);
  }
}
