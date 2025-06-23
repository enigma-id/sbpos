package com.sbpos

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (Intent.ACTION_BOOT_COMPLETED == intent.action) {
      Log.d("BootReceiver", "Boot completed. Starting app...")
      val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
      launchIntent?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(launchIntent)
    }
  }
}