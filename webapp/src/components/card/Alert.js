import React from 'react';


const Alert = ({type, isDismissible, mode, msg}) => (
    <div className={`alert alert-${type} ${isDismissible? "alert-dismissible": ""} ${mode}`}>
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
        <strong className="capitalize">{type}:</strong> {msg}
    </div>
)

export default Alert;