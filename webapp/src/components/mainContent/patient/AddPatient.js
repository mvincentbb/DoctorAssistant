import React, { useState } from "react";
import Cookies from "universal-cookie";

import AddHeader from "../../card/AddHeader";
import FormBox from "../../card/FormBox";

import PatientDataService from "../../../services/patient.service";

import PageTitle from "../../card/PageTitle";
import FormBoxFooter from "../../card/FormBoxFooter";
import {BOY_AVATAR, GIRL_AVATAR} from '../../../utils';

const cookies = new Cookies();

class AddPatient extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            patient: {
                id: null, 
                nom: "", 
                prenom: "", 
                adresse: "", 
                telephone: "", 
                date_naissance: "", 
                genre: "M",
                groupage: "",
                maladies: "",
                allergies: "",
                habitude_alimentaires: "",
                photo: null,
            },
            photo_preview: BOY_AVATAR,
            submitted: false,
            isSubmitting: false
        };
        this.handleInputChange = this.handleInputChange.bind(this)
        this.savePatient = this.savePatient.bind(this)
    }
    handleInputChange(name, value) {
        // const { name, value } = event.target;
        if (name === "photo") {
            this.loadImagePreview(value);
        }
        if (name === "genre"  && (this.state.photo_preview === BOY_AVATAR || this.state.photo_preview === GIRL_AVATAR)) {
            if (value === "M") 
                this.setState({ photo_preview: BOY_AVATAR });
            else if (value === "F") 
                this.setState({ photo_preview: GIRL_AVATAR });
        }
        this.setState({ patient: { ...this.state.patient, [name]: value } });
        console.log("CHANGING... ", name, value);
    }

    loadImagePreview = (file) => {
        var reader = new FileReader();
        reader.onload = (e) => {
            this.setState({ photo_preview: e.target.result });
        }
        reader.readAsDataURL(file);
    };

    savePatient() {
        let loggedDoctor = null;
        if (cookies.get("userType") === "medecin"){
            loggedDoctor = cookies.get("loggedUser");
        }
        var formData = new FormData();
        var data = {
            doctor: loggedDoctor.id,
            ...this.state.patient,
        };

        for ( var key in data ) {
            formData.append(key, data[key]);
        }

        var isFormData = this.state.patient.photo !== null && typeof this.state.patient.photo === "object";

        PatientDataService.create(isFormData ? formData : data, isFormData)
        .then(response => {
            window.showSuccess('Votre patient a été enrégistrer avec succès');
            this.props.history.push(`/patients_details/${response.data.id}`);
        })
        .catch(e => {
            window.showErrorMessage('Something went wrong');
        });
    }

  render() {
    const GenderSelectOptions = [
        { id: null, libelle: "----Sélectionnez un genre-----" },
        { id: "M", libelle: "Masculin" },
        { id: "F", libelle: "Féminin" },
    ];
    const groupageOptions = [
        { id: 'null', libelle: "----Sélectionnez un groupage-----" },
        { id: "O+", libelle: "O+" },
        { id: "A+", libelle: "A+" },
        { id: "B+", libelle: "B+" },
        { id: "O-", libelle: "O-" },
        { id: "A-", libelle: "A-" },
        { id: "AB+", libelle: "AB+" },
        { id: "B-", libelle: "B-" },
        { id: "AB-", libelle: "AB-" },
    ];
    const formBoxes = [
        {
            headerTitle: "Informations personnelles du patient",
            fields: [
                {type: "text", label: "Nom", name: "nom", value: this.state.patient.nom,},
                {type: "text", label: "Prénom",name: "prenom", value: this.state.patient.prenom,},
                {type: "text", label: "Adresse", name: "adresse", value: this.state.patient.adresse, description: 'e.g. "Agoe-cacaveli"',},
                {type: "text", label: "Téléphone", name: "telephone",value: this.state.patient.telephone,description: 'e.g. "+22898765687"',},
                {type: "date", label: "Date de naissance", name: "date_naissance", value: this.state.patient.date_naissance,},
                {type: "select",label: "Genre", name: "genre", value: this.state.patient.genre, selectOptions: GenderSelectOptions,},
            ],
        },
        {
            headerTitle: "Profil",
            fields: [
                {type: "file", label: "Photo de Profil du Patient", name: "photo", value: this.state.patient.photo, accept: ".png, .jpg, .jpeg"},
            ],
        },
        {
            headerTitle: "Informations médicales du patient",
            fields: [
                {type: "select", label: "Groupe Sanguin", name: "groupage", value: this.state.patient.groupage, selectOptions: groupageOptions},
                {type: "tagsinput", label: "Maladies", name: "maladies", value: this.state.patient.maladies},
                {type: "tagsinput", label: "Allergies", name: "allergies", value: this.state.patient.allergies},
                {type: "tagsinput", label: "Habitudes Alimentaires", name: "habitude_alimentaires", value: this.state.patient.habitude_alimentaires},
            ],
        },
    ];

    return (
        <div>
            <PageTitle title="Ajout de patient" />

            <div className="col-xs-12 ">
                <AddHeader entityName="patient" type="add" photoPreview={this.state.photo_preview} />

                <div className="bg-w">
                    {formBoxes.map((box) => (
                        <FormBox
                            key={box.headerTitle}
                            box={box}
                            fromType="add"
                            isSubmitting={this.state.isSubmitting}
                            onInputChange={this.handleInputChange}
                            onSaveBtnTapped={this.savePatient}
                        />
                    ))}

                    <div className="row">
                        <div className="col-lg-10 col-lg-offset-1 col-xs-12">
                            <FormBoxFooter
                                isSubmitting={this.state.isSubmitting}
                                onSaveBtnTapped={this.savePatient}
                                fromType="add"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default AddPatient;
