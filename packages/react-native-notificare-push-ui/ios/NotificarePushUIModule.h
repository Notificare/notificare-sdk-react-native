#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificarePushUIModuleSpec.h"

@interface NotificarePushUIModule : RCTEventEmitter <NativeNotificarePushUIModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificarePushUIModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
