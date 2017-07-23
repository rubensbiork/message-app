import React from 'react';
import { shallow } from 'enzyme';
import { Message } from './Message';

const wrapper = props => shallow(<Message {...props} />);

const data = {
  message: {
    text: 'some-text',
    createdAt: '2017-07-22T18:05:26Z',
  },
  viewer: {
    avatar: 'some-url',
  },
};

describe('components/<Message />', () => {
  it('Should render', () => {
    const component = wrapper({...data});

    expect(
      component,
    ).toMatchSnapshot();
  });

  it('Should set the avatar from given URL', () => {
    const component = wrapper({...data});

    expect(
      component.find('.img-circle').props().src
    ).toBe('some-url');
  });

  it('Should display localized and formatted time', () => {
    const component = wrapper({...data});

    expect(
      component.find('.time-message').text()
    ).toBe('22-7-2017 20:05');
  });

  it('Should display input after clicking in edit icon', () => {
    const component = wrapper({...data});

    const editIcon = component.find('.rename');
    editIcon.simulate('click');

    expect(
      component.state().isEditing
    ).toBeTruthy();

    expect(
      component
    ).toMatchSnapshot();
  });
});
