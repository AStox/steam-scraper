import React from 'react';
import {Dropdown} from 'react-bootstrap';

const CustomDropdown = props => {
  function handleChange(e) {
    props.onChange(e);
  }

  return (
    <Dropdown>
      <Dropdown.Toggle as={React.Button} variant="link" id="dropdown-basic">
        {props.text}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.choices.map((choice, i) => (
          <Dropdown.Item
            key={i}
            eventKey={choice}
            onSelect={() => handleChange(choice)}>
            {choice.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
