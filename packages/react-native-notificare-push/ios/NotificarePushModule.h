#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificarePushModuleSpec.h"

@interface NotificarePushModule : RCTEventEmitter <NativeNotificarePushModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificarePushModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
