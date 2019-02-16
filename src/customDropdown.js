import React from 'react';
import {Dropdown} from 'react-bootstrap';

const CustomDropdown = props => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.choices.map(choice => (
          <Dropdown.Item>{choice}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
