#import "NotificareModuleBootstrap.h"

#import <CoreData/NSManagedObject.h>
#import <NotificareKit/NotificareKit-Swift.h>

#if __has_include(<react_native_notificare/react_native_notificare-Swift.h>)
#import <react_native_notificare/react_native_notificare-Swift.h>
#else
#import "react_native_notificare-Swift.h"
#endif

@implementation NotificareModuleBootstrap {

}
+ (void)load {
     [NotificareModuleBootstrapImpl setup];
}

@end
