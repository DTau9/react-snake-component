import React from 'react';
import { Demo } from './Demo';

export const DemoStory = Demo.bind({});
DemoStory.storyName = 'Demo';
DemoStory.args = {
  collisionWithWalls: false,
  changeSpeed: true,
  scoreForWin: 20
}

export default {
  title: 'Demo',
  component: DemoStory,
  argTypes: {
    collisionWithWalls: {
      control: {
        type: 'boolean'
      }
    },
    changeSpeed: {
      control: {
        type: 'boolean'
      }
    },
    scoreForWin: {
      control: {
        type: 'range',
        max: 100,
        min: 1,
        step: 1
      }
    }
  }
}
