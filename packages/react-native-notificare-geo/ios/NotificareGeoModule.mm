#import "NotificareGeoModule.h"

#if __has_include(<react_native_notificare_geo/react_native_notificare_geo-Swift.h>)
#import <react_native_notificare_geo/react_native_notificare_geo-Swift.h>
#else
#import "react_native_notificare_geo-Swift.h"
#endif

@interface NotificareGeoModule () <NotificareGeoModuleDelegate>
@end

@implementation NotificareGeoModule {
    NotificareGeoPlugin *plugin;
}

- (instancetype)init {
    self = [super init];
    if(self) {
        plugin = [NotificareGeoPlugin new];
        plugin.delegate = self;
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
    [plugin hasLocationServicesEnabled:resolve reject:reject];
}

RCT_EXPORT_METHOD(hasBluetoothEnabled:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin hasBluetoothEnabled:resolve reject:reject];
}

RCT_EXPORT_METHOD(getMonitoredRegions:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin getMonitoredRegions:resolve reject:reject];
}

RCT_EXPORT_METHOD(getEnteredRegions:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin getEnteredRegions:resolve reject:reject];
}

RCT_EXPORT_METHOD(enableLocationUpdates:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin enableLocationUpdates:resolve reject:reject];
}

RCT_EXPORT_METHOD(disableLocationUpdates:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [plugin disableLocationUpdates:resolve reject:reject];
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
