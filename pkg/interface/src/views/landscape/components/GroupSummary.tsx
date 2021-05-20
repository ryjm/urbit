import { Col, Row, Text } from '@tlon/indigo-react';
import { Metadata } from '@urbit/api';
import React, { ReactElement, ReactNode, useRef } from 'react';
import { TUTORIAL_GROUP, TUTORIAL_HOST } from '~/logic/lib/tutorialModal';
import { PropFunc } from '~/types';
import { useTutorialModal } from '~/views/components/useTutorialModal';
import { MetadataIcon } from './MetadataIcon';

interface GroupSummaryProps {
  metadata: Metadata;
  memberCount: number;
  channelCount: number;
  resource?: string;
  children?: ReactNode;
  gray?: boolean;
}

export function GroupSummary(props: GroupSummaryProps & PropFunc<typeof Col>): ReactElement {
  const { channelCount, memberCount, metadata, resource, children, ...rest } = props;
  const anchorRef = useRef<HTMLElement | null>(null);
  useTutorialModal(
    'group-desc',
    resource === `/ship/${TUTORIAL_HOST}/${TUTORIAL_GROUP}`,
    anchorRef
  );
  return (
    <Col {...rest} ref={anchorRef} gapY={4} maxWidth={['100%', '288px']}>
      <Row gapX={2} width="100%">
        <MetadataIcon
          width="40px"
          height="40px"
          metadata={metadata}
          flexShrink={0}
        />
        <Col justifyContent="space-between" flexGrow={1} overflow="hidden">
          <Text
            fontSize={1}
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >{metadata.title}</Text>
          <Row gapX={4} >
            <Text fontSize={1} gray>
              {memberCount} participants
            </Text>
            <Text fontSize={1} gray>
              {channelCount} channels
            </Text>
          </Row>
        </Col>
      </Row>
      <Row width="100%">
        {metadata.description &&
        <Text
            gray
            width="100%"
            fontSize={1}
            textOverflow="ellipsis"
            overflow="hidden"
        >
            {metadata.description}
          </Text>
        }
      </Row>
      {children}
    </Col>
  );
}
