/*
Dropdown inspired and mostly taken from:
react-simple-dropdown
https://github.com/Fauntleroy/react-simple-dropdown
Copyright (c) 2015, Timothy Kempf <tim@kemp59f.info>
*/
import React, { component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import style from './dropdown.css';

const DropdownList = ({ children, className, active, ...props }) => {
    const classes = classNames(className, style.list);

    return (
      <ul {...props} className={classes}>
        {children}
      </ul>
    )
};

DropdownList.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string
};

DropdownList.defaultProps = {
	className: ''
};

export default DropdownList;