import React from 'react';
import AvatarPreview from '../../card/AvatarPreview';
import building from '../../../data/profile/building.jpg'

const DemandeConsultationHeader = ({entityName, patientPhoto, hospitalPhoto}) => (
    <div className="add-header-wrapper gradient-blue curved-section text-center">
        <h2 className="uppercase bold w-text">  {entityName}</h2>
        <div className="before-text"> {entityName}</div>        

        <div className="row">
            <div className="col-lg-offset-2 col-xs-offset-1 col-lg-4 col-xs-5">
                <AvatarPreview avatar={patientPhoto} />
            </div>
            <div className="col-lg-4 col-xs-5">
                <AvatarPreview avatar={hospitalPhoto ? hospitalPhoto : building } />
            </div>
        </div>
    </div>
)

export default DemandeConsultationHeader;