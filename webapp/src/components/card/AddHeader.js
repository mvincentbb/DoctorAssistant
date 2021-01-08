import React from 'react';
import AvatarPreview from './AvatarPreview';

const AddHeader = ({entityName,  type, photoPreview, }) => (
    <div className="add-header-wrapper gradient-blue curved-section text-center">
        <h2 className="uppercase bold w-text">  {entityName}</h2>
        <div className="before-text"> {entityName}</div>        

        <AvatarPreview avatar={photoPreview} />
    </div>
)

export default AddHeader;