import React, { useEffect } from 'react';

import {BOY_AVATAR} from '../../utils';

const AvatarPreview = ({avatar, id}) => {

    useEffect(() => {
        window.$(document).ready( () => {
            window.$(`#imagePreview-${id ? id : 1}`).hide();
            window.$(`#imagePreview-${id ? id : 1}`).fadeIn(500);
        })
    });

    return (
        <div className="avatar-upload">
            <div className="avatar-preview">
                <div id={`imagePreview-${id ? id : 1}`} style={{background: `url(${avatar ? avatar : BOY_AVATAR})`}}></div>
            </div>
        </div>
    )
}

export default AvatarPreview;