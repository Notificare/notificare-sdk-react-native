#import "NotificarePushUIModule.h"

#if __has_include(<react_native_notificare_push_ui/react_native_notificare_push_ui-Swift.h>)
#import <react_native_notificare_push_ui/react_native_notificare_push_ui-Swift.h>
#else
#import "react_native_notificare_push_ui-Swift.h"
#endif

@interface NotificarePushUIModule () <NotificarePushUIModuleDelegate>
@end

@implementation NotificarePushUIModule {
    NotificarePushUIPlugin *plugin;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        plugin = [NotificarePushUIPlugin new];
        plugin.delegate = self;
    }
    
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(presentNotification:(NSDictionary *)notification
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin presentNotification:notification resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(presentAction:(NSDictionary *)notification
                  action:(NSDictionary *)action
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin presentAction:notification action:action resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificarePushUIModuleSpecJSI>(params);
}
#endif

// Event Emitter

- (NSArray<NSString *> *)supportedEvents {
    return [plugin supportedEvents];
}

- (void)startObserving {
    [plugin startObserving];
}

- (void)stopObserving {
    [plugin stopObserving];
}

- (void)broadcastEventWithName:(NSString * _Nonnull)name body:(id _Nullable)body {
    [self sendEventWithName:name body:body];
}

@end
