import React, { useState } from 'react';
import Dropdown from '../Dropdown/Dropdown'; // seu dropdown container
import DropdownItem from '../DropdownItem/DropdownItem'; // seu DropdownItem

const CustomDropdown = ({ label, options }) => {
  const [selected, setSelected] = useState(label);

  return (
    <Dropdown
      ButtonText={selected}
      content={
        <>
          {options.map((option) => (
            <DropdownItem key={option} onClick={() => setSelected(option)}>
              {option}
            </DropdownItem>
          ))}
        </>
      }
    />
  );
};

export default CustomDropdown;
