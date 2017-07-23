import React from 'react';
import { shallow } from 'enzyme';

import MessageInput from './MessageInput';

const wrapper = props => shallow(<MessageInput {...props} />);

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

describe('components/<MessageInput />', () => {
  it('Should render', () => {
    const component = wrapper({});

    expect(
      component,
    ).toMatchSnapshot();
  });

  it('Should display a given placeholder in the input', () => {
    const component = wrapper({
      placeholder: 'some placeholder'
    });

    expect(
      component.find('input').props().placeholder,
    ).toBe('some placeholder');
  });

  it('Should render the input with existing value from the ballon', () => {
    const component = wrapper({
      existingValue: 'some existing value'
    });

    expect(
      component.state().text,
    ).toBe('some existing value');

    expect(
      component.find('input').props().value,
    ).toBe('some existing value');
  });


  it('Should update text state via onChange', () => {
    const component = wrapper({});
    const data = {
      target: {
        value: 'some value',
      },
    };

    component.find('input').simulate('change', data);

    expect(
      component.state().text
    ).toBe('some value');

    expect(
      component,
    ).toMatchSnapshot();
  });

  it('Should call onSave after pressing Enter key in the input', () => {
    const onSaveMock = jest.fn(value => value);
    const component = wrapper({
      onSave: onSaveMock,
    });
    const enterKey = {
      keyCode: ENTER_KEY_CODE,
    };
    const data = {
      target: {
        value: 'some value',
      },
    };

    component.find('input').simulate('change', data);
    component.find('input').simulate('keyDown', enterKey);

    expect(
      onSaveMock.mock.calls,
    ).toHaveLength(1);

    expect(
      onSaveMock.mock.calls[0],
    ).toEqual([data.target.value]);

    expect(
      component.state().text
    ).toEqual('');

    expect(
      component,
    ).toMatchSnapshot();
  });

  it('Should call onCancel after pressing Esc key in the input', () => {
    const onCancelMock = jest.fn(value => value);
    const component = wrapper({
      onCancel: onCancelMock,
    });
    const escKey = {
      keyCode: ESC_KEY_CODE,
    };
    const data = {
      target: {
        value: 'some value',
      },
    };

    component.find('input').simulate('change', data);
    component.find('input').simulate('keyDown', escKey);

    expect(
      onCancelMock.mock.calls,
    ).toHaveLength(1);

    expect(
      onCancelMock.mock.calls[0],
    ).toEqual([]);

    expect(
      component,
    ).toMatchSnapshot();
  });
});
