import { AppAssociations } from '@urbit/api';
import React, { ReactElement } from 'react';
import { alphabeticalOrder } from '~/logic/lib/util';
import useMetadataState from '~/logic/state/metadata';
import { Workspace } from '~/types/workspace';
import { SidebarItem } from './SidebarItem';
import { SidebarAppConfigs, SidebarListConfig, SidebarSort } from './types';

function sidebarSort(
  associations: AppAssociations,
  apps: SidebarAppConfigs
): Record<SidebarSort, (a: string, b: string) => number> {
  const alphabetical = (a: string, b: string) => {
    const aAssoc = associations[a];
    const bAssoc = associations[b];
    const aTitle = aAssoc?.metadata?.title || b;
    const bTitle = bAssoc?.metadata?.title || b;

    return alphabeticalOrder(aTitle, bTitle);
  };

  const lastUpdated = (a: string, b: string) => {
    const aAssoc = associations[a];
    const bAssoc = associations[b];
    const aAppName = aAssoc?.['app-name'];
    const bAppName = bAssoc?.['app-name'];

    const aUpdated = apps[aAppName]?.lastUpdated(a) || 0;
    const bUpdated = apps[bAppName]?.lastUpdated(b) || 0;

    return bUpdated - aUpdated || alphabetical(a, b);
  };

  return {
    asc: alphabetical,
    lastUpdated
  };
}

export function SidebarList(props: {
  apps: SidebarAppConfigs;
  config: SidebarListConfig;
  baseUrl: string;
  group?: string;
  selected?: string;
  workspace: Workspace;
}): ReactElement {
  const { selected, group, config, workspace } = props;
  const associationState = useMetadataState(state => state.associations);
  const associations = { ...associationState.graph };

  const ordered = Object.keys(associations)
    .filter((a) => {
      const assoc = associations[a];
      if (workspace?.type === 'messages') {
        return (
          !(assoc.group in associationState.groups) &&
          'graph' in assoc.metadata.config &&
          assoc.metadata.config.graph === 'chat'
        );
      } else {
        return group ? (
          assoc.group === group &&
          !assoc.metadata.hidden
        ) : (
          !(assoc.group in associationState.groups) &&
          'graph' in assoc.metadata.config &&
          assoc.metadata.config.graph !== 'chat' &&
          !assoc.metadata.hidden
        );
      }
    })
    .sort(sidebarSort(associations, props.apps)[config.sortBy]);

  return (
    <>
      {ordered.map((path) => {
        const assoc = associations[path];
        return (
          <SidebarItem
            key={path}
            path={path}
            selected={path === selected}
            association={assoc}
            apps={props.apps}
            hideUnjoined={config.hideUnjoined}
            workspace={workspace}
          />
        );
      })}
    </>
  );
}
