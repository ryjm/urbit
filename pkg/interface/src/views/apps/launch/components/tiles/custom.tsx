import { BaseImage, Box } from '@tlon/indigo-react';
import React from 'react';
import Tile from './tile';

export default class CustomTile extends React.PureComponent {
  render() {
    return (
      <Tile>
        <Box
          width='100%'
          height='100%'
          position='relative'
          backgroundColor='white'
          border='1px solid'
          borderColor='lightGray'
          borderRadius={2}
        >
          <BaseImage
            position='absolute'
            style={{ left: 38, top: 38 }}
            src='/~launch/img/UnknownCustomTile.png'
            width='48px'
            height='48px'
          />
        </Box>
      </Tile>
    );
  }
}
