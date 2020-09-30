import React from 'react';
import EdiText from 'react-editext';
import { Edit, Check, X } from 'react-feather';
import './EditableField.css';

export default function(props) {
  return (
    <EdiText
      editButtonContent={<Edit/>}
      cancelButtonContent={<X/>}
      saveButtonContent={<Check/>}
      hideIcons={true}
      {...props}
    />
  )

}