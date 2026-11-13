import AppBlockerModule from "./src/AppBlockerModule";

export function hasUsagePermission(): boolean {
  return AppBlockerModule.hasUsagePermission();
}

export function requestUsagePermission(): void {
  AppBlockerModule.requestUsagePermission();
}

export function getForegroundApp(): string {
  return AppBlockerModule.getForegroundApp();
}

export function bringToForeground(packageName: string): void {
  AppBlockerModule.bringToForeground(packageName);
}

export default AppBlockerModule;
