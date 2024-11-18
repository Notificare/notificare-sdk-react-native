import React, { FC } from 'react';
import { NotificareInboxItem } from 'react-native-notificare-inbox';
import { Image, Text, View } from 'react-native';
import { NotificareNotificationAttachment } from 'react-native-notificare';
import TimeAgo from 'react-native-timeago';
import { inboxItemStyles } from '@/styles/styles-inbox';

export const InboxItem: FC<InboxItemProps> = ({ item }) => {
  return (
    <View style={inboxItemStyles.container}>
      <View style={inboxItemStyles.attachmentContainer}>
        {item.notification.attachments.length > 0 ? (
          <Attachment attachment={item.notification.attachments[0]} />
        ) : (
          <EmptyAttachment />
        )}
      </View>

      <View style={inboxItemStyles.detailsContainer}>
        <Text style={inboxItemStyles.title}>
          {item.notification.title ?? '---'}
        </Text>

        <Text style={inboxItemStyles.message}>{item.notification.message}</Text>

        <Text style={inboxItemStyles.caption}>{item.notification.type}</Text>
      </View>

      <View style={inboxItemStyles.unreadContainer}>
        <Text style={inboxItemStyles.caption}>
          <TimeAgo time={item.time} hideAgo={true} />
        </Text>

        {!item.opened && <View style={inboxItemStyles.unreadIndicator} />}
        <View style={inboxItemStyles.emptyView} />
      </View>
    </View>
  );
};

export interface InboxItemProps {
  item: NotificareInboxItem;
}

const Attachment: FC<AttachmentProps> = ({ attachment }) => {
  return <Image source={{ uri: attachment.uri, width: 64, height: 42 }} />;
};

const EmptyAttachment = () => {
  return <View style={inboxItemStyles.emptyAttachment} />;
};

interface AttachmentProps {
  attachment: NotificareNotificationAttachment;
}
