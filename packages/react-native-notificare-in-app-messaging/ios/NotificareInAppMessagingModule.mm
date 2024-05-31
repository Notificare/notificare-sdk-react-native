#import "NotificareInAppMessagingModule.h"
#import "react_native_notificare_in_app_messaging-Swift.h"

@interface NotificareInAppMessagingModule () <NotificareInAppMessagingModuleDelegate>
@end

@implementation NotificareInAppMessagingModule {
    NotificareInAppMessagingModuleImpl *iam;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        iam = [NotificareInAppMessagingModuleImpl new];
        iam.delegate = self;
    }
    
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(hasMessagesSuppressed:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [iam hasMessagesSuppressed:resolve reject:reject];
}

RCT_EXPORT_METHOD(setMessagesSuppressed:(NSDictionary *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [iam setMessagesSuppressed:data resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificareInAppMessagingModuleSpecJSI>(params);
}
#endif

// Event Emitter

- (NSArray<NSString *> *)supportedEvents {
    return [iam supportedEvents];
}

- (void)startObserving {
    [iam startObserving];
}

- (void)stopObserving {
    [iam stopObserving];
}

- (void)sendEventWithName:(NSString * _Nonnull)name result:(id _Nullable)result {
    [self sendEventWithName:name body:result];
}

@end
