import React from "react";

import PageTitle from "../../card/PageTitle";
import PatientItem from "./PatientItem";

class PatientList extends React.Component {
  render() {
    const patients = this.props.patients;

    return (
      <div>
        <PageTitle title="Liste des patients" />

        {patients.map((patient) => (
          <PatientItem
            fullname={patient.fullname}
            gender={patient.gender}
            age={patient.age}
            key={patient.id}
          />
        ))}
      </div>
    );
  }
}

export default PatientList;
