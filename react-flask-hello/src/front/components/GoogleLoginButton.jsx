import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError, text = "signin_with" }) => {
    return (
        <div className="w-full">
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onError}
                useOneTap={false}
                auto_select={false}
                theme="outline"
                size="large"
                text={text}
                shape="rectangular"
                locale="es"
                width="100%"
            />
        </div>
    );
};

export default GoogleLoginButton;