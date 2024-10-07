#import "NotificareModuleBootstrap.h"
#import "CoreData/NSManagedObject.h"
#import "NotificareKit/NotificareKit-Swift.h"
#import "react_native_notificare-Swift.h"

@implementation NotificareModuleBootstrap {

}
+ (void)load {
     [NotificareModuleBootstrapImpl setup];
}

@end
