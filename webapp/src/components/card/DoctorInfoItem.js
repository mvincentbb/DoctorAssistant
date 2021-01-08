import React from 'react';


const DoctorInfoItem = ({title, value}) => (
    <div className="col-sm-4 col-xs-12 no-padding-right">
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

export default DoctorInfoItem;