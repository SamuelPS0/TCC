import React, { useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import DropdownItem from '../DropdownItem/DropdownItem';

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
