import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError, text = "signin_with" }) => {
    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            theme="filled_blue"
            size="large"
            text={text}
            shape="rectangular"
            locale="es"
            useOneTap={false}
        />
    );
};

export default GoogleLoginButton;