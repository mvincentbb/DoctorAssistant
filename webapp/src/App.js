import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";

import TopBar from './components/topBar/TopBar';
import SideBar from './components/sideBar/SideBar';
import First from './components/First/First';
import PatientList from './components/mainContent/patient/PatientList';
import AddPatient from './components/mainContent/patient/AddPatient';
import PatientDetails from './components/mainContent/patient/PatientDetails';
import Login from './components/mainContent/auth/Login';
import Register from './components/mainContent/auth/Register';
import Cookies from 'universal-cookie';
import EditPatient from './components/mainContent/patient/EditPatient';
import DoctorList from './components/mainContent/medecin/DoctorList';
import DoctorDetails from './components/mainContent/medecin/DoctorDetails';

import DoctorDashboard from './components/mainContent/dashborad/doctor/DoctorDashboard';
import HopitalList from './components/mainContent/structures_sanitaire/All';

import AddDoctor from './components/mainContent/medecin/AddDoctor';
import EditDoctor from './components/mainContent/medecin/EditDoctor';
import AddConsultation from './components/mainContent/consultation/AddConsultation';
import ConsultationList from './components/mainContent/consultation/ConsultationList';
import authService from './services/auth.service';
import Schedule from './components/mainContent/emploi_du_temps/Schedule';
import AddDemandeConsultation from './components/mainContent/demande_consultation/AddDemandeConsultation';
import DemandeConsultationList from './components/mainContent/demande_consultation/DemandeConsultationList';
import AddHospital from './components/mainContent/structures_sanitaire/Add';
import EditHospital from './components/mainContent/structures_sanitaire/Edit';
import EditConsultation from './components/mainContent/consultation/EditConsultation';
import EditDemandeConsultation from './components/mainContent/demande_consultation/EditDemandeConsultation';
import Calendar from './components/card/Calendar';


const cookies = new Cookies();

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoginPageLoaded: false,
            isRegisterPageLoaded: false,
            loggedIn: cookies.get("token") && cookies.get("loggedUser") ? true : false
        };
        this.handleLoginPageLoaded = this.handleLoginPageLoaded.bind(this);
        this.handleRegisterPageLoaded = this.handleRegisterPageLoaded.bind(this);
        
    }

    handleLoginPageLoaded() {
        this.setState({isLoginPageLoaded: true});
    }

    handleRegisterPageLoaded() {
        this.setState({isLoginPageLoaded: true});
    }

    componentWillMount() {
        const token = cookies.get("token");
        const user = cookies.get("loggedUser");
        const path = window.location.pathname;
        if ((token !== undefined && user !== undefined) && (path!=="/login" && path!=="/signup")) {
            authService.assert({token: token})
            .then(response => {
                cookies.set('loggedUser', response.data.user);
                this.setState({loggedIn: true});
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                } 
                else if (error.request) {
                    console.log(error.request);
                } 
                else {
                    console.log('Error', error.message);
                }
                this.setState({loggedIn: false});
                window.showErrorMessage("Wrong credential ! Please try to login");
                console.log(error.config);
            });
        }
    }

    componentDidMount() {
        window.$(document).ready(() =>{
            window.setTimeout( ()=> {
                window.$("#sidebar_toggler").trigger('click');
            }, 500);
        })
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route 
                        exact path="/login"
                        render={ props => (
                            <Login onLoginPageLoaded={this.handleLoginPageLoaded} {...props} />
                        )} >
                        
                    </Route>
                    <Route 
                        exact path="/signup"
                        render={ props => (
                            <Register onLoginPageLoaded={this.handleLoginPageLoaded} {...props} />
                        )} >
                    </Route>
                </Switch>

                { !this.state.isLoginPageLoaded && (
                    <div>
                        <TopBar/>
                        <div className="page-container row-fluid container-fluid">
                            <SideBar/>
                            <section id="main-content">
                                <div className="wrapper main-wrapper row">
                                    <Switch>
                                        <Route exact path={["/", "/dashboard"]}
                                            render={ props => (
                                                this.state.loggedIn ? <DoctorDashboard {...props} /> : <Redirect to="/login" />
                                            )}>
                                        </Route>

                                        <Route path="/patients">
                                            {this.state.loggedIn ? <PatientList /> : <Redirect to="/login" />}
                                        </Route>

                                        <Route 
                                            exact path={`/patients_new`}
                                            render={ props => (
                                                this.state.loggedIn ? <AddPatient {...props} /> : <Redirect to="/login" />
                                            ) } >
                                        </Route>

                                        <Route 
                                            path={`/patients_details/:id`} 
                                            render={ props => (
                                                this.state.loggedIn ? <PatientDetails {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route 
                                            path={`/patients_update/:id`} 
                                            render={ props => (
                                                this.state.loggedIn ? <EditPatient {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route path="/doctors">
                                            {this.state.loggedIn ? <DoctorList /> : <Redirect to="/login" />}
                                        </Route>
                                        <Route 
                                            exact path={`/doctors_new`}
                                            render={ props => (
                                                this.state.loggedIn ? <AddDoctor {...props} /> : <Redirect to="/login" />
                                            ) } >
                                        </Route>
                                        <Route 
                                            path={`/doctors_details/:id`} 
                                            render={ props => (
                                                this.state.loggedIn ? <DoctorDetails {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route 
                                            path={`/profile`} 
                                            render={ props => (
                                                this.state.loggedIn ? <DoctorDetails {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route 
                                            path={`/doctors_update/:id`} 
                                            render={ props => (
                                                this.state.loggedIn ? <EditDoctor {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route 
                                            path={`/consultations`} 
                                            render={ props => (
                                                this.state.loggedIn ? <ConsultationList {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route 
                                            path={`/consultation_new`} 
                                            render={ props => (
                                                this.state.loggedIn ? <AddConsultation {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route 
                                            path={`/patient/consultation/new`}
                                            render={ props => (
                                                this.state.loggedIn ? <AddConsultation {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route 
                                            path={`/consultations_update/:id`} 
                                            render={ props => (
                                                this.state.loggedIn ? <EditConsultation{...props} /> : <Redirect to="/login" />
                                            ) } />
                                        
                                        <Route 
                                            path="/hospitals"
                                            render={ props => (
                                                this.state.loggedIn ? <HopitalList {...props} /> : <Redirect to="/login" />
                                            ) }>
                                        </Route>

                                        <Route 
                                            exact path={`/hospitals_new`}
                                            render={ props => (
                                                this.state.loggedIn ? <AddHospital {...props} /> : <Redirect to="/login" />
                                            ) } >
                                        </Route>

                                        <Route 
                                            path={`/hospitals_update/:id`} 
                                            render={ props => (
                                                this.state.loggedIn ? <EditHospital {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route 
                                            path={`/hospitals_details/:id`} 
                                            render={ props => (
                                                this.state.loggedIn ? <PatientDetails {...props} /> : <Redirect to="/login" />
                                            ) } />


                                        <Route 
                                            path={`/schedules`} 
                                            render={ props => (
                                                this.state.loggedIn ? <Calendar {...props} /> : <Redirect to="/login" />
                                            ) } />

                                        <Route exact path={`/demande_consultation_new`}
                                            render={ props => (
                                                this.state.loggedIn ? <AddDemandeConsultation {...props} /> : <Redirect to="/login" />
                                            ) } >
                                        </Route>
                                        <Route exact path={`/demande_consultation_update/:id`}
                                            render={ props => (
                                                this.state.loggedIn ? <EditDemandeConsultation {...props} /> : <Redirect to="/login" />
                                            ) } >
                                        </Route>
                                        <Route 
                                            path={`/demande_consultations`} 
                                            render={ props => (
                                                this.state.loggedIn ? <DemandeConsultationList {...props} /> : <Redirect to="/login" />
                                            ) } />
                                    </Switch>
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default App;
