import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';

const CustomDropdown = (props) => {
  function handleChange(e) {
    props.onChange(e);
  }

  return (
    <Dropdown style={{ display: 'inline-block', verticalAlign: 'top' }}>
      <Dropdown.Toggle as={React.Button} variant="link" id="dropdown-basic">
        <span className="title-font">{props.text}</span>
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


CustomDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired,
};

export default CustomDropdown;
