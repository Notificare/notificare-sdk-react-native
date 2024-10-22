#import "NotificareScannablesModule.h"

#if __has_include(<react_native_notificare_scannables/react_native_notificare_scannables-Swift.h>)
#import <react_native_notificare_scannables/react_native_notificare_scannables-Swift.h>
#else
#import "react_native_notificare_scannables-Swift.h"
#endif

@interface NotificareScannablesModule () <NotificareScannablesModuleDelegate>
@end

@implementation NotificareScannablesModule {
    NotificareScannablesPlugin *plugin;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        plugin = [NotificareScannablesPlugin new];
        plugin.delegate = self;
    }
    
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(canStartNfcScannableSession:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin canStartNfcScannableSession:resolve reject:reject];
}

RCT_EXPORT_METHOD(startScannableSession:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin startScannableSession:resolve reject:reject];
}

RCT_EXPORT_METHOD(startNfcScannableSession:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin startNfcScannableSession:resolve reject:reject];
}

RCT_EXPORT_METHOD(startQrCodeScannableSession:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin startQrCodeScannableSession:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetch:(NSString *)tag
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin fetch:tag resolve:resolve reject:reject];
}


// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificareScannablesModuleSpecJSI>(params);
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
