import React from 'react';
import { shallow } from 'enzyme';

import MessageInput from './MessageInput';

const wrapper = props => shallow(<MessageInput {...props} />);

describe('components/<MessageInput />', () => {
  it('Should render', () => {
    const component = wrapper({});

    expect(
      component,
    ).toMatchSnapshot();
  });
});
