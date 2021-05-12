#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NotificarePushUIModule, RCTEventEmitter)

RCT_EXTERN_METHOD(presentNotification:(NSDictionary *)notification
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(presentAction:(NSDictionary *)notification
                  action:(NSDictionary *)action
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

@end
