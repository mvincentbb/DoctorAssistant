import React from 'react';
import StructureSanitaireForm from '../dashborad/doctor/StructureSanitaireForm';
import doctorService from '../../../services/doctor.service';
import structureSanitaireService from '../../../services/structureSanitaire.service';
import PageTitle from '../../card/PageTitle';
import AddHeader from '../../card/AddHeader';
import loading from '../../../data/icons/loading.svg';
import building from '../../../data/profile/building.jpg'
import NotFound from '../error/404';

class EditHospital extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            denomination: "",
            telephone: "",
            adresse: "",
            description: "",
            email: "",
            username: "",
            send_btn_text: "Enregister",
            delete_btn_text: "Supprimer",
        };
    }

    componentWillMount() {
        const { match: { params } } = this.props;
        structureSanitaireService.get(params.id)
        .then(response => {
            console.log(response.data);
            this.setState({...response.data});
        }).catch(e => {
            console.log(e);
            this.setState({id: 0});
        });
    }

    handleInputChange = (name, value) => {
        // const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    update = () => {
        this.setState({send_btn_text: "En cours..."});
        let data = {
            denomination: this.state.denomination,
            telephone: this.state.telephone,
            description: this.state.description,
            adresse: this.state.adresse,
            email: this.state.email,
        };
        structureSanitaireService.update(this.state.id, data)
        .then(response => {
            window.showSuccess("Structure sanitaire mise à jour");
            this.setState({send_btn_text: "Enregister"});
            this.props.history.push("/hospitals/");
        })
        .catch(error => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } 
            else if (error.request) {
                console.log(error.request);
            } 
            else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

    delete = () => {
        this.setState({delete_btn_text: "En cours..."});
        structureSanitaireService.update(this.state.id)
        .then(response => {
            window.showSuccess("Structure sanitaire supprimée");
            this.setState({delete_btn_text: "Supprimer"});
            this.props.history.push("/hospitals/");
        })
        .catch(error => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } 
            else if (error.request) {
                console.log(error.request);
            } 
            else {
                console.log('Error', error.message);
            }
            console.log(error.config);
            window.showErrorMessage("Something wents wrong !!!");
        });
    }

    render() {
        return (
            <div>

                { this.state.id === null && (
                    <div>
                        <img src={loading} style={{width: '300px', margin: 'auto', display: 'block'}} />
                    </div>
                )}

                { (this.state.id === 0) && (
                    <NotFound />
                )}

                { this.state.id > 0 && (
                    <div>
                        <PageTitle title="Modifier Structure Sanitaire" />
                    
                        <div className="col-xs-12 ">
                            <AddHeader entityName="structure sanitaire" type="edit" photoPreview={building} />

                            <div className="bg-w">
                                <StructureSanitaireForm 
                                    hospital={this.state}
                                    onUpdateClick={this.update} 
                                    onDeleteClick={this.delete}
                                    onInputChange={this.handleInputChange} 
                                    send_btn_text={this.state.send_btn_text} 
                                    delete_btn_text={this.state.delete_btn_text} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) }
}

export default EditHospital;