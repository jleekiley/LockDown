package expo.modules.appblocker

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Process
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppBlockerModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("AppBlocker")

        Function("hasUsagePermission") {
            val context = appContext.reactContext ?: return@Function false
            val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode =
                    appOps.checkOpNoThrow(
                            AppOpsManager.OPSTR_GET_USAGE_STATS,
                            Process.myUid(),
                            context.packageName
                    )
            mode == AppOpsManager.MODE_ALLOWED
        }

        Function("requestUsagePermission") {
            appContext.reactContext?.let { context ->
                val intent =
                        Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        }
                context.startActivity(intent)
            }
        }

        Function("getForegroundApp") {
            val context = appContext.reactContext ?: return@Function ""
            val usageStatsManager =
                    context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val startTime = endTime - 1000 * 10 // Last 10 seconds

            val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
            val event = UsageEvents.Event()
            var foregroundPackage = ""

            while (usageEvents.hasNextEvent()) {
                usageEvents.getNextEvent(event)
                if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
                    foregroundPackage = event.packageName
                }
            }
            foregroundPackage
        }

        Function("bringToForeground") { packageName: String ->
            appContext.reactContext?.let { context ->
                val pm = context.packageManager
                val appName =
                        try {
                            val appInfo = pm.getApplicationInfo(packageName, 0)
                            pm.getApplicationLabel(appInfo).toString()
                        } catch (e: Exception) {
                            packageName
                        }

                val encodedAppName = Uri.encode(appName)
                val uri =
                        Uri.parse("lockdown://shield?package=$packageName&appName=$encodedAppName")

                val intent =
                        Intent(Intent.ACTION_VIEW, uri).apply {
                            setPackage(context.packageName)
                            addFlags(
                                    Intent.FLAG_ACTIVITY_NEW_TASK or
                                            Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
                            )
                        }
                context.startActivity(intent)
            }
        }
    }
}
