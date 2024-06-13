#import "NotificarePushModule.h"
#import "react_native_notificare_push-Swift.h"

@interface NotificarePushModule () <NotificarePushModuleDelegate>
@end

@implementation NotificarePushModule {
    NotificarePushModuleImpl *push;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        push = [NotificarePushModuleImpl new];
        push.delegate = self;
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
    [push setAuthorizationOptions:options resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(setCategoryOptions:(NSArray *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [push setCategoryOptions:options resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(setPresentationOptions:(NSArray *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [push setPresentationOptions:options resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(hasRemoteNotificationsEnabled:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [push hasRemoteNotificationsEnabled:resolve reject:reject];
}

RCT_EXPORT_METHOD(allowedUI:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [push allowedUI:resolve reject:reject];
}

RCT_EXPORT_METHOD(enableRemoteNotifications:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [push enableRemoteNotifications:resolve reject:reject];
}

RCT_EXPORT_METHOD(disableRemoteNotifications:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [push disableRemoteNotifications:resolve reject:reject];
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
    return [push supportedEvents];
}

- (void)startObserving {
    [push startObserving];
}

- (void)stopObserving {
    [push stopObserving];
}

- (void)broadcastEventWithName:(NSString * _Nonnull)name body:(id _Nullable)body {
    [self sendEventWithName:name body:body];
}

@end
