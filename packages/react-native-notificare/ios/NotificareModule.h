#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificareModuleSpec.h"

@interface NotificareModule : RCTEventEmitter <NativeNotificareModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificareModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
