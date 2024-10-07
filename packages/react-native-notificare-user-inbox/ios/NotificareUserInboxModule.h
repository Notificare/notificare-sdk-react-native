#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificareUserInboxModuleSpec.h"

@interface NotificareUserInboxModule : NSObject <NativeNotificareUserInboxModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificareUserInboxModule : NSObject <RCTBridgeModule>
#endif

@end
