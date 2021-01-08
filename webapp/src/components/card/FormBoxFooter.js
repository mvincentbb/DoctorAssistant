import React from 'react';

const FormBoxFooter = ({onSaveBtnTapped, onDeleteBtnTapped, isSubmitting, fromType}) => (
    <div className="padding-bottom-30">
        { fromType === "edit" && (
        <div className="modal fade col-xs-12 in" id="deleteConfirmationModal" tabIndex="-1" role="dialog" aria-hidden="true" style={{display: 'none'}}>
            <div className="modal-dialog animated shake">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Attention</h4>
                    </div>
                    <div className="modal-body">

                        Do you really want to delete ?

                    </div>
                    <div className="modal-footer">
                        <button data-dismiss="modal" className="btn btn-default" type="button">Close</button>
                        <button className="btn btn-warning" type="button" onClick={(fromType==="edit") ? onDeleteBtnTapped : undefined}> Confirm</button>
                    </div>
                </div>
            </div>
        </div>
        )}
        

        <div className="text-left">
            <button style={{marginLeft: '20px'}}
                type="button" 
                className={`btn btn-primary gradient-blue ${isSubmitting && 'disabled'}`} 
                onClick={onSaveBtnTapped} >{fromType === "add" ? "Enregister" : "Sauvegarder"}</button>
            
            <button style={{marginLeft: '20px'}}
                type={fromType==="add" ? 'reset' : 'button'} data-toggle="modal" href="#deleteConfirmationModal"
                className={`btn ${isSubmitting && 'disabled'} ${fromType==="add" ? '' : 'btn-danger'}`}
                onClick={(fromType==="add") ? onDeleteBtnTapped : undefined} >
                {fromType==="add" ? 'Annuler' : 'Supprimer'}
            </button>
        </div>
    </div>
)

export default FormBoxFooter;