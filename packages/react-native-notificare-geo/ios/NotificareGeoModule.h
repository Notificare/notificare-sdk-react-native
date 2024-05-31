#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificareGeoModuleSpec.h"

@interface NotificareGeoModule : RCTEventEmitter <NativeNotificareGeoModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificareGeoModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
