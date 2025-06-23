package com.sbpos

import android.app.Activity
import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class KioskModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "Kiosk"

  @ReactMethod
  fun startKioskMode() {
    val activity: Activity? = currentActivity
    if (activity != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      Log.d("Kiosk", "Starting Kiosk Mode...")
      activity.startLockTask()
    }
  }

  @ReactMethod
  fun stopKioskMode() {
    val activity: Activity? = currentActivity
    if (activity != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      Log.d("Kiosk", "Stopping Kiosk Mode...")
      activity.stopLockTask()
    }
  }

  @ReactMethod
  fun restartApp() {
    val context = reactApplicationContext
    val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
    launchIntent?.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
    context.startActivity(launchIntent)
  }
}
