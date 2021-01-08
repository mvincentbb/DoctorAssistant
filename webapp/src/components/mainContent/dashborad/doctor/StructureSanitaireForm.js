import React, {} from 'react';
import FormBoxItem from '../../../card/FormBoxItem';
import doctorService from '../../../../services/doctor.service';
import structureSanitaireService from '../../../../services/structureSanitaire.service';


class StructureSanitaireForm extends React.Component {

    constructor(props) {
        super(props);
    }

    handleAddClick = event => {
        this.props.onAddClick();
    }
    handleUpdateClick = event => {
        this.props.onUpdateClick();
    }
    handleDeleteClick = event => {
        this.props.onDeleteClick();
    }
    handleCancelClick = event => {
        this.props.onCancelClick();
    }

    render() {
        return (
            <div style={{padding: '10px'}}>
                <div className="row">
                    <div className="col-lg-6 col-xs-12">
                        <FormBoxItem type="text" label="Dénomination" onInputChange={this.props.onInputChange} name="denomination" value={this.props.hospital.denomination}/>
                    </div>
                    <div className="col-lg-6 col-xs-12">
                        <FormBoxItem type="email" label="Adresse Email" onInputChange={this.props.onInputChange} name="email" value={this.props.hospital.email}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-xs-12">
                        <FormBoxItem type="text" label="Téléphone" onInputChange={this.props.onInputChange} name="telephone" value={this.props.hospital.telephone}/>
                    </div>
                    <div className="col-lg-6 col-xs-12">
                        <FormBoxItem type="text" label="Adresse" onInputChange={this.props.onInputChange} name="adresse" value={this.props.hospital.adresse} description="'ville, quartier, boite postale...'" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12 col-xs-12">
                        <FormBoxItem type="textarea" label="Description" onInputChange={this.props.onInputChange} name="description" value={this.props.hospital.description}/>
                    </div>
                </div>

                { this.props.hospital.id ? (
                    <div className="row" style={{padding: '15px'}}>
                        <span className="btn btn-primary gradient-blue" onClick={this.handleUpdateClick} >{ this.props.send_btn_text}</span>
                        <span className="btn btn-default" onClick={this.handleDeleteClick} >{ this.props.delete_btn_text}</span>
                    </div>
                ) : (
                    <div className="row" style={{padding: '15px'}}>
                        <span className="btn btn-primary gradient-blue" onClick={this.handleAddClick} >{ this.props.send_btn_text}</span>
                        <span className="btn btn-default" onClick={this.handleCancelClick} >Annuler</span>
                    </div>
                )}
            </div>
        )
    }
    
}

export default StructureSanitaireForm;