import React from 'react';
import TestRenderer from 'react-test-renderer';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { Dropdown } from '../dropdown';
import { Button } from '../button';


const createTestDropdown = (options) => {
  const testElement = TestRenderer.create(
    <Dropdown
      value={'English'}
      options={options}
      display={'Language'}
      className="btn-tertiary"
      widthClass="w160"
    />
  );
  return testElement.root;
}


it('dropdown icon is faChevronDown', () => {
  let elementInstance = createTestDropdown(
    [{label: 'English'}, {label: 'Portuguese (pt)'}]
  );
  expect(elementInstance.findByType(Button).props.icon).toBe(faChevronDown);
});


it('dropdown-content is not rendered before the user clicks on the button', () => {
  let elementInstance = createTestDropdown(
    [{label: 'English'}, {label: 'Portuguese (pt)'}]
  );
  expect(
    () => elementInstance.findByProps({'className': 'dropdown-content wmin96 round w160'})
  ).toThrow(
    new Error(
      'No instances found with props: {"className":"dropdown-content wmin96 round w160"}'
    )
  );
});


it('dropdown-content show/hide with clicks', () => {
  let elementInstance = createTestDropdown(
    [{label: 'English'}, {label: 'Portuguese (pt)'}]
  );
  elementInstance.findByType(Button).props.onClick();
  expect(
    elementInstance.findByProps(
      {'className': 'dropdown-content wmin96 round w160'}
    ).type
  ).toBe('div');
  // number of dropdown options should be 2
  expect(
    elementInstance.findAllByProps(
      {'className': 'flex-parent flex-parent--row flex-parent--center-cross py6 px12'}
    ).length
  ).toBe(2);
  // dropdown options should be an <a> element
  expect(
    elementInstance.findAllByProps(
      {'className': 'flex-parent flex-parent--row flex-parent--center-cross py6 px12'}
    )[0].children[0].type
  ).toBe('a');
  expect(
    elementInstance.findAllByProps(
      {'className': 'flex-parent flex-parent--row flex-parent--center-cross py6 px12'}
    )[0].children[0].children
  ).toEqual(["English"]);
  // dropdown-content should disappear after another button click
  elementInstance.findByType(Button).props.onClick();
  expect(
    () => elementInstance.findByProps({'className': 'dropdown-content wmin96 round w160'})
  ).toThrow(
    new Error(
      'No instances found with props: {"className":"dropdown-content wmin96 round w160"}'
    )
  );
});


it('dropdown-content disappear after click on option', () => {
  const elementInstance = createTestDropdown(
    [{label: 'English'}, {label: 'Portuguese (pt)'}]
  );
  elementInstance.findByType(Button).props.onClick();
  elementInstance.findAllByProps(
    {'className': 'flex-parent flex-parent--row flex-parent--center-cross py6 px12'}
  )[0].children[0].props.onClick();
  // dropdown-content should disappear after selecting an option
  expect(
    () => elementInstance.findByProps({'className': 'dropdown-content wmin96 round w160'})
  ).toThrow(
    new Error(
      'No instances found with props: {"className":"dropdown-content wmin96 round w160"}'
    )
  );
});


it('dropdown behaviour with href props', () => {
  const elementInstance = createTestDropdown([
    {label: 'A', href: 'http://a.co'},
    {label: 'B', href: 'http://b.co'},
    {label: 'C', href: 'http://c.co'}
  ]);
  elementInstance.findByType(Button).props.onClick();
  // dropdown-content must be rendered after the click
  expect(
    elementInstance.findByProps(
      {'className': 'dropdown-content wmin96 round w160'}
    ).type
  ).toBe('div');
  // number of dropdown options should be 3
  expect(
    elementInstance.findAllByProps(
      {'className': 'flex-parent flex-parent--row flex-parent--center-cross py6 px12'}
    ).length
  ).toBe(3);
  // dropdown options type should be an <a>
  expect(
    elementInstance.findAllByProps(
      {'className': 'flex-parent flex-parent--row flex-parent--center-cross py6 px12'}
    )[0].children[0].type
  ).toBe('a');
  // a elements should have the href property filled
  expect(
    elementInstance.findAllByProps(
      {'className': 'flex-parent flex-parent--row flex-parent--center-cross py6 px12'}
    )[0].children[0].props.href
  ).toBe('http://a.co');
});


it('dropdown behaviour with multi enabled', () => {
  const testElement = TestRenderer.create(
    <Dropdown
      value={'A'}
      options={[{label: 'A'}, {label: 'B'}, {label: 'C'} ]}
      display={'Options'}
      multi={true}
      className="btn-tertiary"
      widthClass="w160"
    />
  );
  const elementInstance = testElement.root;
  elementInstance.findByType(Button).props.onClick();
  // dropdown-content must be rendered after the click
  expect(
    elementInstance.findByProps(
      {'className': 'dropdown-content wmin96 round w160'}
    ).type
  ).toBe('div');
  // number of dropdown options should be 3
  expect(
    elementInstance.findAllByProps(
      {'className': 'flex-parent flex-parent--row flex-parent--center-cross py6 px12'}
    ).length
  ).toBe(3);
  // when multi is true element type should be input
  expect(
    elementInstance.findAllByProps(
      {'className': 'flex-parent flex-parent--row flex-parent--center-cross py6 px12'}
    )[0].children[0].type
  ).toBe('input');
});
