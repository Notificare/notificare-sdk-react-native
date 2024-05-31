#import "NotificareScannablesModule.h"
#import "react_native_notificare_scannables-Swift.h"

@interface NotificareScannablesModule () <NotificareScannablesModuleDelegate>
@end

@implementation NotificareScannablesModule {
    NotificareScannablesModuleImpl *scannables;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        scannables = [NotificareScannablesModuleImpl new];
        scannables.delegate = self;
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
    [scannables canStartNfcScannableSession:resolve reject:reject];
}

RCT_EXPORT_METHOD(startScannableSession:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [scannables startScannableSession:resolve reject:reject];
}

RCT_EXPORT_METHOD(startNfcScannableSession:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [scannables startNfcScannableSession:resolve reject:reject];
}

RCT_EXPORT_METHOD(startQrCodeScannableSession:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [scannables startQrCodeScannableSession:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetch:(NSString *)tag
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [scannables fetch:tag resolve:resolve reject:reject];
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
    return [scannables supportedEvents];
}

- (void)startObserving {
    [scannables startObserving];
}

- (void)stopObserving {
    [scannables stopObserving];
}

- (void)sendEventWithName:(NSString * _Nonnull)name result:(id _Nullable)result {
    [self sendEventWithName:name body:result];
}

@end
