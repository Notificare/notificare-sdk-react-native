#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NotificareLoyaltyModule, NSObject)

RCT_EXTERN_METHOD(fetchPassBySerial:(NSString *)serial
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchPassByBarcode:(NSString *)barcode
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(present:(NSDictionary *)pass
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

@end
