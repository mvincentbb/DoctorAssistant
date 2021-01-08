import React from 'react';

// import {Col} from 'react-bootstrap';

const PageTitle = ({title}) => (
    <div>
        <div className="col-xs-12">
            <div className="page-title">
                <div className="pull-left">
                    <h1 className="title">{ title }</h1>
                </div>
            </div>
        </div>
        <div className="clearfix"></div>
    </div>
)

export default PageTitle;