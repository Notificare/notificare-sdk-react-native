#import "NotificarePushModule.h"
#import "react_native_notificare_push-Swift.h"

@interface NotificarePushModule () <NotificarePushModuleDelegate>
@end

@implementation NotificarePushModule {
    NotificarePushPlugin *plugin;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        plugin = [NotificarePushPlugin new];
        plugin.delegate = self;
    }

    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(setAuthorizationOptions:(NSArray *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin setAuthorizationOptions:options resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(setCategoryOptions:(NSArray *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin setCategoryOptions:options resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(setPresentationOptions:(NSArray *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin setPresentationOptions:options resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(hasRemoteNotificationsEnabled:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin hasRemoteNotificationsEnabled:resolve reject:reject];
}

RCT_EXPORT_METHOD(getTransport:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin getTransport:resolve reject:reject];
}

RCT_EXPORT_METHOD(getSubscription:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin getSubscription:resolve reject:reject];
}

RCT_EXPORT_METHOD(allowedUI:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin allowedUI:resolve reject:reject];
}

RCT_EXPORT_METHOD(enableRemoteNotifications:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin enableRemoteNotifications:resolve reject:reject];
}

RCT_EXPORT_METHOD(disableRemoteNotifications:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin disableRemoteNotifications:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificarePushModuleSpecJSI>(params);
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
