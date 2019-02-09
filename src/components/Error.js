import React from 'react';
import {Alert} from 'reactstrap';


const Error = ({error}) => {
    if (!error) return null;

    return (
        <Alert className="pl-0 pr-0" color="danger">{error}</Alert>
    )
};
export default Error