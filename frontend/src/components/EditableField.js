import React from 'react';
import EdiText from 'react-editext';
import {Edit2, Check, X} from 'react-feather';

export default function(props) {
  return (
    <EdiText
      {...props}
      editButtonContent={<Edit2/>}
      saveButtonContent={<Check/>}
      cancelButtonContent={<X/>}
      hideIcons
    />
  )
}