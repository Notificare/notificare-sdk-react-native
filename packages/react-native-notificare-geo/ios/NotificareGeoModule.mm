#import "NotificareGeoModule.h"
#import "react_native_notificare_geo-Swift.h"

@interface NotificareGeoModule () <NotificareGeoModuleDelegate>
@end

@implementation NotificareGeoModule {
    NotificareGeoModuleImpl *geo;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        geo = [NotificareGeoModuleImpl new];
        geo.delegate = self;
    }
    
    return self;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(hasLocationServicesEnabled:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [geo hasLocationServicesEnabled:resolve reject:reject];
}

RCT_EXPORT_METHOD(hasBluetoothEnabled:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [geo hasBluetoothEnabled:resolve reject:reject];
}

RCT_EXPORT_METHOD(getMonitoredRegions:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [geo getMonitoredRegions:resolve reject:reject];
}

RCT_EXPORT_METHOD(getEnteredRegions:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [geo getEnteredRegions:resolve reject:reject];
}

RCT_EXPORT_METHOD(enableLocationUpdates:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [geo enableLocationUpdates:resolve reject:reject];
}

RCT_EXPORT_METHOD(disableLocationUpdates:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [geo disableLocationUpdates:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNotificareGeoModuleSpecJSI>(params);
}
#endif

// Event Emitter

- (NSArray<NSString *> *)supportedEvents {
    return [geo supportedEvents];
}

- (void)startObserving {
    [geo startObserving];
}

- (void)stopObserving {
    [geo stopObserving];
}

- (void)broadcastEventWithName:(NSString * _Nonnull)name body:(id _Nullable)body {
    [self sendEventWithName:name body:body];
}

@end
