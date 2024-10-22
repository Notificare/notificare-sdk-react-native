#import "NotificareModule.h"

#import <CoreData/NSManagedObject.h>
#import <NotificareKit/NotificareKit-Swift.h>

#if __has_include(<react_native_notificare/react_native_notificare-Swift.h>)
#import "react_native_notificare/react_native_notificare-Swift.h"
#else
#import "react_native_notificare-Swift.h"
#endif

@interface NotificareModule () <NotificareModuleDelegate>
@end

@implementation NotificareModule {
    NotificarePlugin *plugin;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        plugin = [NotificarePlugin shared];
        plugin.delegate = self;
    }
    
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(isConfigured:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin isConfigured:resolve reject:reject];
}

RCT_EXPORT_METHOD(isReady:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin isReady:resolve reject:reject];
}

RCT_EXPORT_METHOD(launch:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin launch:resolve reject:reject];
}

RCT_EXPORT_METHOD(unlaunch:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin unlaunch:resolve reject:reject];
}

RCT_EXPORT_METHOD(getApplication:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin getApplication:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchApplication:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin fetchApplication:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchNotification:(NSString *)notificationId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin fetchNotification:notificationId resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchDynamicLink:(NSString *)url
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin fetchDynamicLink:url resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(canEvaluateDeferredLink:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin canEvaluateDeferredLink:resolve reject:reject];
}

RCT_EXPORT_METHOD(evaluateDeferredLink:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin evaluateDeferredLink:resolve reject:reject];
}

// MARK: - Device module

RCT_EXPORT_METHOD(getCurrentDevice:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin getCurrentDevice:resolve reject:reject];
}

RCT_EXPORT_METHOD(getPreferredLanguage:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin getPreferredLanguage:resolve reject:reject];
}

RCT_EXPORT_METHOD(updatePreferredLanguage:(NSString *)language
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin updatePreferredLanguage:language resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(registerUser:(NSString *)userId
                  userName:(NSString *)userName
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin registerUser:userId userName:userName resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(updateUser:(NSString *)userId
                  userName:(NSString *)userName
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin updateUser:userId userName:userName resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchTags:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin fetchTags:resolve reject:reject];
}

RCT_EXPORT_METHOD(addTag:(NSString *)tag
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin addTag:tag resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(addTags:(NSArray *)tags
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin addTags:tags resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(removeTag:(NSString *)tag
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin removeTag:tag resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(removeTags:(NSArray *)tags
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin removeTags:tags resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(clearTags:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin clearTags:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchDoNotDisturb:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin fetchDoNotDisturb:resolve reject:reject];
}

RCT_EXPORT_METHOD(updateDoNotDisturb:(NSDictionary *)dnd
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin updateDoNotDisturb:dnd resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(clearDoNotDisturb:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin clearDoNotDisturb:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchUserData:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin fetchUserData:resolve reject:reject];
}

RCT_EXPORT_METHOD(updateUserData:(NSDictionary *)userData
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin updateUserData:userData resolve:resolve reject:reject];
}

// MARK: - Events module

RCT_EXPORT_METHOD(logCustom:(NSString *)event
                  data:(NSDictionary *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin logCustom:event data:data resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificareModuleSpecJSI>(params);
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
