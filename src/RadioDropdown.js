import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button } from 'react-bootstrap';

const RadioDropdown = (props) => {
  function handleChange(e) {
    props.onClick(e);
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
            as={Button}
            variant="primary"
            eventKey={choice}
            onSelect={() => handleChange(choice)}>
            {choice}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};


RadioDropdown.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired,
};

export default RadioDropdown;
