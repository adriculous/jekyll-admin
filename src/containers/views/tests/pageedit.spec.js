import React from 'react';
import { Link } from 'react-router';
import { shallow } from 'enzyme';
import expect from 'expect';

import { PageEdit } from '../PageEdit';

import { page } from './fixtures';

const defaultProps = {
  page: page,
  errors: [],
  fieldChanged: false,
  updated: false,
  isFetching: false,
  params: { id: "page.md"}
};

function setup(props = defaultProps) {
  const actions = {
    fetchPage: expect.createSpy(),
    putPage: expect.createSpy(),
    deletePage: expect.createSpy(),
    updateTitle: expect.createSpy(),
    updateBody: expect.createSpy(),
    updatePath: expect.createSpy(),
    updateDraft: expect.createSpy(),
    clearErrors: expect.createSpy()
  };

  const component = shallow(
    <PageEdit {...actions} {...props} />
  );

  return {
    component,
    actions,
    saveButton: component.find('.content-side a').first(),
    deleteButton: component.find('.content-side .delete'),
    errors: component.find('.error-messages'),
    props
  };
}

describe('Containers::PageEdit', () => {
  it('should call clearErrors before mount', () => {
    const { actions } = setup();
    expect(actions.clearErrors).toHaveBeenCalled();
  });

  it('should render correctly', () => {
    let { component } = setup(Object.assign(
      {}, defaultProps, { isFetching: true }
    ));
    component = setup(Object.assign(
      {}, defaultProps, { page: {} }
    )).component;
    expect(component.find('h1').node).toExist();
  });

  it('should not render error messages initially', () => {
    const { errors } = setup();
    expect(errors.node).toNotExist();
  });

  it('should render error messages', () => {
    const { errors } = setup(Object.assign({}, defaultProps, {
      errors: ['The title field is required!']
    }));
    expect(errors.node).toExist();
  });

  it('should not call putPage if a field is not changed.', () => {
    const { saveButton, actions } = setup();
    saveButton.simulate('click');
    expect(actions.putPage).toNotHaveBeenCalled();
  });

  it('should call putPage if a field is changed.', () => {
    const { saveButton, actions } = setup(Object.assign({}, defaultProps, {
      fieldChanged: true
    }));
    saveButton.simulate('click');
    expect(actions.putPage).toHaveBeenCalled();
  });

  it('should call deletePage', () => {
    const { deleteButton, actions } = setup();
    deleteButton.simulate('click');
    expect(actions.deletePage).toNotHaveBeenCalled(); // TODO pass prompt
  });
});