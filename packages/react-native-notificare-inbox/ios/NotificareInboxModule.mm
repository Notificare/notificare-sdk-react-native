#import "NotificareInboxModule.h"
#import "react_native_notificare_inbox-Swift.h"

@interface NotificareInboxModule () <NotificareInboxModuleDelegate>
@end

@implementation NotificareInboxModule {
    NotificareInboxModuleImpl *inbox;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        inbox = [NotificareInboxModuleImpl new];
        inbox.delegate = self;
    }
    
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(getItems:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [inbox getItems:resolve reject:reject];
}

RCT_EXPORT_METHOD(getBadge:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [inbox getBadge:resolve reject:reject];
}

RCT_EXPORT_METHOD(refresh:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [inbox refresh:resolve reject:reject];
}

RCT_EXPORT_METHOD(open:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [inbox open:item resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(markAsRead:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [inbox markAsRead:item resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(markAllAsRead:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [inbox markAllAsRead:resolve reject:reject];
}

RCT_EXPORT_METHOD(remove:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [inbox remove:item resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(clear:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [inbox clear:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificareInboxModuleSpecJSI>(params);
}
#endif

// Event Emitter

- (NSArray<NSString *> *)supportedEvents {
    return [inbox supportedEvents];
}

- (void)startObserving {
    [inbox startObserving];
}

- (void)stopObserving {
    [inbox stopObserving];
}

- (void)sendEventWithName:(NSString * _Nonnull)name result:(id _Nullable)result {
    [self sendEventWithName:name body:result];
}

@end
