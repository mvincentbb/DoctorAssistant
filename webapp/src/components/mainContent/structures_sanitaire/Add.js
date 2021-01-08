import React from 'react';
import StructureSanitaireForm from '../dashborad/doctor/StructureSanitaireForm';
import doctorService from '../../../services/doctor.service';
import PageTitle from '../../card/PageTitle';
import AddHeader from '../../card/AddHeader';
import building from '../../../data/profile/building.jpg'

class AddHospital extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hopital: {
              denomination: "s",
              telephone: "",
              adresse: "",
              description: "",
              email: "",
              username: "",
            },
            send_btn_text: "Enregister",
        };
    }

    handleInputChange = (name, value) => {
        // const { name, value } = event.target;
        this.setState({ hopital: {...this.state.hopital, [name]: value} });
    }

    add = () => {
        this.setState({send_btn_text: "En cours..."});
        let data = {
            denomination: this.state.hopital.denomination,
            telephone: this.state.hopital.telephone,
            description: this.state.hopital.description,
            adresse: this.state.hopital.adresse,
            email: this.state.hopital.email,
            username: this.state.hopital.denomination.replace(/\s+/g, ''),
        };
        doctorService.addHospital(data)
        .then(response => {
            window.showSuccess("Structure sanitaire ajoutée");
            this.setState({send_btn_text: "Ajouter"});
            this.props.history.push(`/hospitals/`);
            // this.props.history.push(`/hospitals_details/${response.data.id}`);
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

    cancel = () => {
        this.props.history.push("/hospitals/");
    }

  render() {
        return (
            <div>
                <PageTitle title="Nouvelle Structure Sanitaire" />
                
                <div className="col-xs-12 ">
                    <AddHeader entityName="structure sanitaire" type="add" photoPreview={building} />

                    <div className="bg-w">
                        <StructureSanitaireForm 
                            hospital={this.state.hopital}
                            onAddClick={this.add} 
                            onCancelClick={this.cancel} 
                            onInputChange={this.handleInputChange} 
                            send_btn_text={this.state.send_btn_text} />
                    </div>
                </div>
            </div>
        )
    }
}

export default AddHospital;