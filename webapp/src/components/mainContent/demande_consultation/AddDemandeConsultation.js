import React from "react";
import AddHeader from "../../card/AddHeader";
import FormBox from "../../card/FormBox";

import PageTitle from "../../card/PageTitle";

import DemandeConsultationsDataService from "../../../services/demande_consultation.service";
import PatientDataService from "../../../services/patient.service";
import StructureSanitaireDataService from "../../../services/structureSanitaire.service";
import Cookies from "universal-cookie";
import FormBoxFooter from "../../card/FormBoxFooter";
import DemandeConsultationHeader from "./DemandeConsultationHeader";

const cookies = new Cookies();

class AddDemandeConsultation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            demmande_consultation: {
            medecin: cookies.get("loggedUser").id,
            status: null,
            patient: null,
            centre_medical: null,
            },
            submitted: false,
            isSubmitting: false,
            centre_medicals: [],
            patients: [],
            selectedPatient: null,
            selectedHospital: null,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.saveDemandeConsultation = this.saveDemandeConsultation.bind(this);
        this.newDemandeConsultation = this.newDemandeConsultation.bind(this);
    }
    saveDemandeConsultation() {
    var data = {
        ...this.state.demmande_consultation,
    };
    console.log(data);
    DemandeConsultationsDataService.create(data)
        .then((response) => {
          window.showSuccess("demande de consultation effectuee");
          this.props.history.push(`/demande_consultations/`);
          this.newDemandeConsultation();
        })
        .catch((e) => {
          console.log(e.response);
        });
    }
    newDemandeConsultation() {
    this.setState({
        demmande_consultation: {
        status: 1,
        centre_medical: -1,
        patient: -1,
        },
    });
    }

    componentWillMount() {
    StructureSanitaireDataService.getMine()
        .then((response) => {
        this.setState({ centre_medicals: response.data });
        })
        .catch((e) => {
        console.log(e);
        });

    PatientDataService.getAll()
        .then((response) => {
        this.setState({ patients: response.data });
        })
        .catch((e) => {
        console.log(e);
        });
    }

    changePatientPhoto = (id) => {
        let patient = null;
        for (patient in this.state.patients) {
            console.log(patient);
            if (this.state.patients[patient].id == id) {
                console.log(id);
                this.setState({selectedPatient: this.state.patients[patient]});
            }
        }
    }

    changeHospitalPhoto = (id) => {
        
    }

  handleInputChange(name, value) {
    if (name === "patient") {
        console.log("CHANGING... ", value);
        this.changePatientPhoto(value);
    }
    this.setState({ demmande_consultation: { ...this.state.demmande_consultation, [name]: value, }, });
    // console.log("CHANGING... ", name, value);
  }
  render() {
    const patient = {};
    const StatusSelectOptions = [
      { id: -1, libelle: "--------Choisir le status-------" },
      { id: 1, libelle: "accepte" },
    ];
    const PatientSelectOptions = [
      { id: -1, libelle: "--------Choisir le patient--------" },
    ].concat(
      this.state.patients.map((patient) => ({
        id: patient.id,
        libelle: patient.nom + " " + patient.prenom,
      }))
    );
    const CenterSelectOptions = [
      { id: -1, libelle: "--------Choisir le centre medical-------" },
    ].concat(
      this.state.centre_medicals.map((centre_medical) => ({
        id: centre_medical.id,
        libelle: centre_medical.denomination,
      }))
    );
    const formBoxes = [
      {
        headerTitle: "Ajouter une demande de consultation",
        fields: [
          {
            type: "select",
            name: "centre_medical",
            label: "Centre medical",
            selectOptions: CenterSelectOptions,
          },
          {
            type: "select",
            name: "patient",
            label: "Patient",
            selectOptions: PatientSelectOptions,
          },
          {
            type: "select",
            name: "status",
            label: "Status",
            selectOptions: StatusSelectOptions,
          },
        ],
      },
    ];

    return (
      <div>
        <PageTitle title="Ajouter une demande de consultation" />

        <div className="col-xs-12 ">
        <DemandeConsultationHeader 
            entityName="Demande de consultation" 
            patientPhoto={this.state.selectedPatient ? this.state.selectedPatient.photo : null} 
            hospitalPhoto={null} />

          <div className="bg-w">
            {formBoxes.map((box) => (
                <FormBox
                    key={box.headerTitle}
                    box={box}
                    fromType="add"
                    isSubmitting={this.state.isSubmitting}
                    onInputChange={this.handleInputChange}
                    onSaveBtnTapped={this.saveDemandeConsultation}
                />
            ))}

            <div className="row">
                <div className="col-lg-10 col-lg-offset-1 col-xs-12">
                    <FormBoxFooter
                        isSubmitting={this.state.isSubmitting}
                        onSaveBtnTapped={this.saveDemandeConsultation}
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

export default AddDemandeConsultation;
