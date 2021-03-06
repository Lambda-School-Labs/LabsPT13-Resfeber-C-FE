import React from 'react';
import PropTypes from 'prop-types';
import { Button as AntButton } from 'antd';

const FormButton = props => {
  // notice we don't pass a click handler to this component. It's supposed to be used as a FormButton only.
  // You'd want to use an onSubmit on the Form Element itself to keep your forms organized.
  return (
    <AntButton
      disabled={props.isDisabled}
      htmlType={props.htmlType}
      type={props.type || 'primary'}
    >
      {props.buttonText}
    </AntButton>
  );
};

export default FormButton;

FormButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.string,
};
