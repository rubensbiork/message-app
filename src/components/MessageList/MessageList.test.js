import React from 'react';
import { shallow } from 'enzyme';

import { MessageList } from './MessageList';

const wrapper = props => shallow(<MessageList {...props} />);

const messageData = {
  viewer: {
    totalCount: 2,
    messages: {
      edges: [
        {
          node: {
            id: 'some-id',
            text: 'some-text',
            createdAt: 'some-date',
          },
        },
        {
          node: {
            id: 'some-id2',
            text: 'some-text2',
            createdAt: 'some-date2',
          },
        },
      ],
    },
  },
};

describe('components/<MessageList />', () => {
  it('Should render', () => {
    const component = wrapper({...messageData});

    expect(
      component,
    ).toMatchSnapshot();
  });

  it('Should display the counter with 2 items', () => {
    const component = wrapper({...messageData});

    expect(
      component.find('.counter').text()
    ).toBe('2 items');
  });

  it('Should display no data message', () => {
    const noMessage = {
      viewer: {
        totalCount: 0,
        messages: {
          edges: [],
        },
      },
    };

    const component = wrapper({...noMessage});

    expect(
      component.find('.no-message').text()
    ).toBe('No message here yet!');

    expect(
      component.find('.no-message')
    ).toMatchSnapshot();
  });

});
