#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificareLoyaltyModuleSpec.h"

@interface NotificareLoyaltyModule : NSObject <NativeNotificareLoyaltyModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificareLoyaltyModule : NSObject <RCTBridgeModule>
#endif

@end
