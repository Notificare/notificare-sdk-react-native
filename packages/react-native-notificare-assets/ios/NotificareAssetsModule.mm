#import "NotificareAssetsModule.h"

#if __has_include(<react_native_notificare_assets/react_native_notificare_assets-Swift.h>)
#import <react_native_notificare_assets/react_native_notificare_assets-Swift.h>
#else
#import "react_native_notificare_assets-Swift.h"
#endif

@implementation NotificareAssetsModule {
    NotificareAssetsPlugin *plugin;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        plugin = [NotificareAssetsPlugin new];
    }
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(fetch:(NSString *)group
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin fetch:group resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificareAssetsModuleSpecJSI>(params);
}
#endif

@end
