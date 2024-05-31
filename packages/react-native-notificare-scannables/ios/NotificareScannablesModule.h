#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNotificareScannablesModuleSpec.h"

@interface NotificareScannablesModule : RCTEventEmitter <NativeNotificareScannablesModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NotificareScannablesModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
