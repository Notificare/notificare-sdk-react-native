#import "NotificareLoyaltyModule.h"
#import "react_native_notificare_loyalty-Swift.h"

@implementation NotificareLoyaltyModule {
    NotificareLoyaltyModuleImpl *loyalty;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        loyalty = [NotificareLoyaltyModuleImpl new];
    }
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(fetchPassBySerial:(NSString *)serial
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [loyalty fetchPassBySerial:serial resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchPassByBarcode:(NSString *)barcode
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [loyalty fetchPassByBarcode:barcode resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(present:(NSDictionary *)pass
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [loyalty present:pass resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificareLoyaltyModuleSpecJSI>(params);
}
#endif

@end
