import React from 'react';
import {Dropdown} from 'react-bootstrap';

const CustomDropdown = props => {
  function handleChange(e) {
    //this.setState({value: e.target.value.toLowerCase().trim()});
    props.onYChange(e);
  }

  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.choices.map((choice, i) => (
          <Dropdown.Item key={i} eventKey={choice} onSelect={handleChange}>
            {choice}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
