import React from 'react';


const PatientInfoItem = ({title, value}) => (
    <div className="col-sm-6 col-lg-6 col-xs-6">
        <div className="patient-card has-shadow2">
            <div className="doc-info-wrap">
                <div className="patient-info">
                    <h5 className="bold">{value}</h5>
                    <h6>{title}</h6>
                </div>
            </div>
        </div>
    </div>
)

export default PatientInfoItem;