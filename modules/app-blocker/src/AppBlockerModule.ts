import { NativeModule, requireNativeModule } from "expo";

declare class AppBlockerModule extends NativeModule {
  hasUsagePermission(): boolean;
  requestUsagePermission(): void;
  getForegroundApp(): string;
  bringToForeground(packageName: string): void;
}

export default requireNativeModule<AppBlockerModule>("AppBlocker");
