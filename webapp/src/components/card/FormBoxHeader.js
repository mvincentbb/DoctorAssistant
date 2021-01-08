import React from 'react';

const FormBoxHeader = ({title}) => (
    <header className="panel_header">
        <h2 className="title pull-left">{title}</h2>
        <div className="actions panel_actions pull-right">
            {/* <a className="box_toggle fa fa-chevron-down"></a>
            <a className="box_setting fa fa-cog" data-toggle="modal" href="#section-settings"></a>
            <a className="box_close fa fa-times"></a> */}
        </div>
    </header>
)

export default FormBoxHeader;