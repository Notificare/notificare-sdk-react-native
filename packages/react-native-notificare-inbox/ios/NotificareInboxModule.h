#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificareInboxModuleSpec.h"

@interface NotificareInboxModule : RCTEventEmitter <NativeNotificareInboxModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificareInboxModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
