#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificareAssetsModuleSpec.h"

@interface NotificareAssetsModule : NSObject <NativeNotificareAssetsModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificareAssetsModule : NSObject <RCTBridgeModule>
#endif

@end
