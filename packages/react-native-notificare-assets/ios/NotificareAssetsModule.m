#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NotificareAssetsModule, NSObject)

RCT_EXTERN_METHOD(fetch:(NSString *)group
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

@end
