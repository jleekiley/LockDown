import { registerWebModule, NativeModule } from 'expo';

// AppBlockerModule is not available on the web platform.
class AppBlockerModule extends NativeModule<{}> {}

export default registerWebModule(AppBlockerModule, 'AppBlockerModule');
