import React, { FC } from 'react';
import { NotificareInboxItem } from 'react-native-notificare-inbox';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NotificareNotificationAttachment } from 'react-native-notificare';
import TimeAgo from 'react-native-timeago';

export const InboxItem: FC<InboxItemProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      {item.notification.attachments.length > 0 && (
        <View style={styles.attachmentContainer}>
          <Attachment attachment={item.notification.attachments[0]} />
        </View>
      )}

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.notification.title ?? '---'}</Text>
        <Text style={styles.message}>{item.notification.message}</Text>
        <Text style={styles.caption}>{item.notification.type}</Text>
      </View>

      <View style={styles.unreadContainer}>
        <Text style={styles.caption}>
          <TimeAgo time={item.time} hideAgo={true} />
        </Text>
        {!item.opened && <View style={styles.unreadIndicator} />}
      </View>
    </View>
  );
};

export interface InboxItemProps {
  item: NotificareInboxItem;
}

const Attachment: FC<AttachmentProps> = ({ attachment }) => {
  return <Image source={{ uri: attachment.uri, width: 96, height: 64 }} />;
};

interface AttachmentProps {
  attachment: NotificareNotificationAttachment;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  attachmentContainer: {
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    flexGrow: 1,
  },
  unreadContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  message: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#2B43F7',
    marginTop: 8,
  },
});
