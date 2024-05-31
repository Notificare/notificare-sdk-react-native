#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificareInAppMessagingModuleSpec.h"

@interface NotificareInAppMessagingModule : RCTEventEmitter <NativeNotificareInAppMessagingModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificareInAppMessagingModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
