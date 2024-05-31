#import "NotificareUserInboxModule.h"
#import "react_native_notificare_user_inbox-Swift.h"

@implementation NotificareUserInboxModule {
    NotificareUserInboxModuleImpl *userInbox;
}

- (instancetype)init {
  self = [super init];
  if(self) {
      userInbox = [NotificareUserInboxModuleImpl new];
  }
  return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_METHOD(parseResponseFromJson:(NSDictionary *)json
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [userInbox parseResponseFromJson:json resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(parseResponseFromString:(NSString *)json
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [userInbox parseResponseFromString:json resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(open:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [userInbox open:item resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(markAsRead:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [userInbox markAsRead:item resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(remove:(NSDictionary *)item
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [userInbox remove:item resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificareUserInboxModuleSpecJSI>(params);
}
#endif

@end
