import { IndexedNotification, NotificationGraphConfig, Unreads } from '@urbit/api';
import bigInt, { BigInteger } from 'big-integer';
import _ from 'lodash';
import f from 'lodash/fp';

export function getLastSeen(
  unreads: Unreads,
  path: string,
  index: string
): BigInteger | undefined {
  const lastSeenIdx = unreads.graph?.[path]?.[index]?.unreads;
  if (!(typeof lastSeenIdx === 'string')) {
    return bigInt.zero;
  }
  return f.flow(f.split('/'), f.last, x => (x ? bigInt(x) : undefined))(
    lastSeenIdx
  );
}

export function getUnreadCount(
  unreads: Unreads,
  path: string,
  index: string
): number {
  const graphUnreads = unreads.graph?.[path]?.[index]?.unreads ?? 0;
  return typeof graphUnreads === 'number' ? graphUnreads : graphUnreads.size;
}

export function getNotificationCount(
  unreads: Unreads,
  path: string
): number {
  const unread = unreads.graph?.[path] || {};
  return Object.keys(unread)
    .map(index => _.get(unread[index], 'notifications.length', 0))
    .reduce(f.add, 0);
}

export function isWatching(
  config: NotificationGraphConfig,
  graph: string,
  index = '/'
) {
  return Boolean(config.watching.find(
    watch => watch.graph === graph && watch.index === index
  ));
}

export function getNotificationKey(time: BigInteger, notification: IndexedNotification): string {
  const base = time.toString();
  if('graph' in notification.index) {
    const { graph, index } = notification.index.graph;
    return `${base}-${graph}-${index}`;
  } else if('group' in notification.index) {
    const { group } = notification.index.group;
    return `${base}-${group}`;
  }
  return `${base}-unknown`;
}

