import React from "react";
import {WEEKDAYS, MONTHS, LitteralDate, literalHour, fillZero, BOY_AVATAR, GIRL_AVATAR} from "../../utils";
import CustomSelect from "./CustomSelect";
import PatientDataService from "../../services/patient.service";
import HospitalService from "../../services/structureSanitaire.service";
import AppointmentService from "../../services/demande_consultation.service";
import scheduleService from '../../services/schedule.service';
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";


const cookies = new Cookies();

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: [[], [], []],
            currentMonth: (new Date()).getMonth(),
            currentYear: (new Date()).getFullYear(),
            showNewAppointmentModal: false,
            patients: [],
            hospitals: [],
            consultations: [],
            demande_consultations: [],
            structure_sanitaires: [],
            orderedRDVs: {},
            grid: [],

            appointment: {
                id: null,
                medecin: cookies.get("loggedUser").id,
                patient: null,
                centre_medical: null,
                date: new Date(),
                time: literalHour(new Date()),
                status: 1,
            },
            modal_type: 'add',
        };
        
        this.getDatesArray = this.getDatesArray.bind(this);
        this.showNextMonth = this.showNextMonth.bind(this);
        this.showPreviousMonth = this.showPreviousMonth.bind(this);
        this.toggleAppointmentModal = this.toggleAppointmentModal.bind(this);
        this.handleAppointmentModalClick = this.handleAppointmentModalClick.bind(this);
        this.getOrderedRDVs = this.getOrderedRDVs.bind(this);
        this.getGrid = this.getGrid.bind(this);
    }

    getDatesArray() {
        // console.log(this.state.currentYear, this.state.currentMonth);
        var start = new Date();
        start.setFullYear(this.state.currentYear, this.state.currentMonth, 1);
        var end = new Date(start);

        end.setFullYear(this.state.currentYear, this.state.currentMonth+1, 1);
        end.setDate(end.getDate() - 1);
        // console.log(start, end);

        var days = [[], [], []];

        var d = new Date(start);
        while(d.getDay() > 1) {
            d.setDate(d.getDate()-1);
            days[0].push(d.getDate());
        }

        days[0] = days[0].reverse();

        for (let i = 0; i < end.getDate(); i++) {
            days[1].push(i+1);
        }

        d = new Date(end);
        while(d.getDay() !== 0) {
            d.setDate(d.getDate()+1);
            days[2].push(d.getDate());
        }
        
        scheduleService.getByMonth(this.state.currentMonth, this.state.currentYear)
        .then(response => {
            this.setState({...response.data}, this.getOrderedRDVs);
            
        })
        .catch(error => {
            window.showErrorMessage("something wents wrong !!!");
        });

        this.setState({dates: days}, this.getGrid);
    }

    getOrderedRDVs() {
        var rdvs = {};

        this.state.demande_consultations.map( (rdv) => {
            var date = (new Date(rdv.date_consultation)).getDate().toString();

            if ( rdvs.hasOwnProperty(date) ) {
                rdvs[date].push(rdv);
            }
            else {
                rdvs[date] = [rdv];
            }
        });

        // console.log(rdvs);
        this.setState({orderedRDVs: rdvs});
    }

    getGrid() {
        var dates = this.state.dates[0].concat(this.state.dates[1]).concat(this.state.dates[2]),
            grid = [],
            row = [];
        
        var rowscount = dates.length / 7;
        for (let index = 0; index < rowscount; index++) {
            row = dates.splice(0, 7);
            

            for (let i = 0; i < row.length; i++) {
                if ( (index === 0 && this.state.dates[0].includes(row[i])) || (index === rowscount-1 && this.state.dates[2].includes(row[i])) ) {
                    // console.log(index);
                }else {
                    grid.push({row: index + 2, column: i+1});
                }
            }
        }

        // console.log(grid);
        this.setState({grid: grid});
    }

    componentWillMount() {
        PatientDataService.getAll()
        .then(response => {
            this.setState({patients: response.data});
        }).catch(e => {
            window.showErrorMessage("something wents wrong !!!");
        });

        HospitalService.getAll()
        .then(response => {
            this.setState({hospitals: response.data});
        }).catch(e => {
            window.showErrorMessage("something wents wrong !!!");
        });
    }

    componentDidMount() {
        this.getDatesArray();
    }

    showNextMonth() {
        this.setState({
            currentMonth: this.state.currentMonth < 11 ? (this.state.currentMonth + 1) : 0,
            currentYear: this.state.currentMonth < 11 ? this.state.currentYear : (this.state.currentYear+1),
        }, this.getDatesArray);
    }

    showPreviousMonth() {
        this.setState({
            currentMonth: this.state.currentMonth > 0 ? (this.state.currentMonth - 1) : 11,
            currentYear: this.state.currentMonth > 0 ? this.state.currentYear : (this.state.currentYear-1),
            
        }, this.getDatesArray);
    }

    toggleAppointmentModal(date, data) {
        date = `${this.state.currentYear}-${fillZero(this.state.currentMonth+1, 2)}-${fillZero(date, 2)}`
        window.$(".task__detail").css("display", "none");
        this.setState({
            showNewAppointmentModal: !this.state.showNewAppointmentModal,
            appointment: {...this.state.appointment, ...data, date: date},
            modal_type: data === undefined ? 'add' : 'edit',
        });
    }

    handleAppointmentModalClick(event) {
        window.$(event.target).addClass("hide-modal");
        setTimeout( () => {
            this.toggleAppointmentModal();
        }, 400);
    }

    handleTaskContainerClick = (event) => {
        event.stopPropagation();
    }

    handleTaskClick = (event) => {
        window.$(".task__container").css('overflow', 'scroll');
        var detail = window.$(event.target).find(".task__detail");
        var display = window.getComputedStyle(detail[0], null).getPropertyValue("display");
        if (display === "block") {
            detail.css("display", "none");
            window.$(event.target).parent().css('overflow', 'scroll');
        }
        else {
            window.$(".task__detail").css("display", "none");
            detail.css("display", "block");
            window.$(event.target).parent().css('overflow', 'visible');
        }
    }

    handleTaskDetailClick = (event) => {
        event.stopPropagation();
    }

    handleInputChange = (name, value) => {
        console.log("CHANGE", name, value);
        this.setState({ appointment: { ...this.state.appointment, [name]: value } });
    }

    saveAppointment = () => {
        var data = {
            ...this.state.appointment,
            date_consultation: `${this.state.appointment.date}T${this.state.appointment.time}:00`
        };
        
        AppointmentService.create(data)
        .then((response) => {
            window.showSuccess("demande de consultation effectuee");
            this.setState({
                showNewAppointmentModal: !this.state.showNewAppointmentModal,
            }, this.getDatesArray);
        })
        .catch((e) => {
            window.showErrorMessage("Echec !!!!");
        });
    }

    updateAppointment = () => {
        var data = {
            ...this.state.appointment,
            date_consultation: `${this.state.appointment.date}T${this.state.appointment.time}:00`
        };
        
        AppointmentService.update(data.id, data)
        .then((response) => {
            window.showSuccess("demande de consultation modifier");
            this.setState({
                showNewAppointmentModal: !this.state.showNewAppointmentModal,
            }, this.getDatesArray);
        })
        .catch((e) => {
            window.showErrorMessage("Echec !!!!");
        });
    }

    deleteAppointment = (id) => {
        AppointmentService.delete(id)
        .then((response) => {
            window.showSuccess("demande de consultation supprimée");
            this.getDatesArray();
        })
        .catch((e) => {
            window.showErrorMessage("Echec !!!!");
        });
    }

    clearAppointmentForm = () => {
        this.setState({appointment: {
            medecin: cookies.get("loggedUser").id,
            patient: null,
            centre_medical: null,
            date: null,
            time: literalHour(new Date()),
            status: 1,
        }})
    }

    getAppointmentConsultation = (rdv) => {
        for (let consultation of this.state.consultations) {
            if (rdv.id === consultation.demande_consultation) 
                return consultation;
        }
        return null;
    }

    getAppointmentFlag = (rdv) => {
        let consultation = this.getAppointmentConsultation(rdv);
        var date = new Date(rdv.date_consultation);
        var today = new Date();

        if (consultation !== null) {
            return "danger";
        }
        if (date < today) {
            return "warning";
        }
        if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
            return "primary";
        }
        if (date > today) {
            return "info";
        }
    }

    isToday = (date) => {
        var today = new Date();
        return today.getFullYear() === this.state.currentYear && today.getMonth() === this.state.currentMonth && today.getDate() === date;
    }

    render() {

        return (
            <div className="calendar-container">
                
                <div className={`new-appointment-modal ${ this.state.showNewAppointmentModal ? 'd-block show-modal' : 'd-none hide-modal'}` } onClick={ this.handleAppointmentModalClick }>
                    <div className="first-child" onClick={ (event) => { event.stopPropagation(); }}>
                        <h1 className="new-appointment-modal-header">
                            { this.state.modal_type === "add" ? "nouveau rendez-vous" : "modifier rendez-vous" }
                        </h1>

                        <div style={{padding: '0 10px'}}>
                            
                            <div className="row">
                                
                                <div className="col-lg-6">
                                    <CustomSelect 
                                        options={ this.state.patients.map( (patient) => (
                                            {
                                                id: patient.id, 
                                                value: `${patient.nom} ${patient.prenom}`, 
                                                photo: patient.photo ? patient.photo : patient.genre === "M" ? BOY_AVATAR : GIRL_AVATAR
                                            }
                                        )) }
                                        withAvatar={1} default="---Selectioner un patient---" 
                                        onInputChange={this.handleInputChange}
                                        value={this.state.appointment.patient || 0}
                                        name="patient"
                                    />
                                </div>
                                
                                <div className="col-lg-6">
                                    <CustomSelect 
                                        options={ this.state.hospitals.map( (hospital) => (
                                            {
                                                id: hospital.id, 
                                                value: `${hospital.denomination} `,
                                            }
                                        )) }
                                        withAvatar={0} default="---Selectioner un hopital---" 
                                        onInputChange={this.handleInputChange}
                                        value={this.state.appointment.centre_medical || 0}
                                        name="centre_medical"
                                    />
                                </div>

                            </div>

                            <div className="row" style={{margin: '20px 0'}}>
                                <div className="col-lg-8">
                                    <input 
                                        type='date' name="appointment_date" 
                                        value={ this.state.appointment.date } 
                                        onChange={ (e) => { this.handleInputChange("date", e.target.value) }}
                                        className="form-control" />
                                </div>

                                <div className="col-lg-4">
                                    <input 
                                        type='time' name="appointment_time" 
                                        value={ this.state.appointment.time } 
                                        onChange={ (e) => { this.handleInputChange("time", e.target.value) }}
                                        className="form-control" />
                                </div>
                            </div>
                            
                            <div onClick={ this.state.modal_type === "add" ? this.saveAppointment : this.updateAppointment} className="new-appointment-btn">
                                { this.state.modal_type === "add" ? "ajouter" : "modifier" }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="calendar-header">
                    <i className="fas fa-caret-left fa-3x month-chevron" style={{float: 'left'}} onClick={this.showPreviousMonth}></i>
                    <i className="fas fa-caret-right fa-3x month-chevron" style={{float: 'right'}} onClick={this.showNextMonth}></i>
                    <h1>{MONTHS[this.state.currentMonth]}</h1>
                    <p>{this.state.currentYear}</p>
                </div>

                <div className="calendar">
                    { WEEKDAYS.map( (dayname) => (
                        <span className="day-name" key={dayname}>{dayname}</span>
                    ))}

                    { this.state.dates[0].map( (date) => (
                        <div key={date} className="day day--disabled">{date}</div>
                    ))}

                    { this.state.dates[1].map( (date) => (
                        <div key={date} className={`day ${ this.isToday(date) ? "today" : "" } ${ (new Date(this.state.appointment.date)).getDate() === date ? "day--active" : ""}`} onClick={ () => { this.toggleAppointmentModal(date) } }>{date}</div>
                    ))}

                    { this.state.dates[2].map( (date) => (
                        <div key={date} className="day day--disabled">{date}</div>
                    ))}

                    { this.state.dates[1].map( (date) => {
                        var rdvs = this.state.orderedRDVs[date];
                        if (rdvs !== undefined)
                            return (
                                <div key={date} onClick={this.handleTaskContainerClick} className="task__container" style={{gridColumn: `${this.state.grid[date-1].column} / span 1`, gridRow: this.state.grid[date-1].row}}>
                                    { rdvs.map( (rdv) => {
                                        
                                        var flag = this.getAppointmentFlag(rdv);

                                        return (
                                            <section onClick={this.handleTaskClick} key={rdv.id} className={`task task--${flag}`}>
                                                { flag === "danger" && (<i className="fas fa-lock"></i>)} {rdv.patient.prenom} -- {rdv.hopital.denomination}
                                                
                                                <div onClick={this.handleTaskDetailClick} className="task__detail">
                                                    <h2><i className="fas fa-user"></i> {rdv.patient.prenom} {rdv.patient.nom}</h2>
                                                    <p><i className="fas fa-calendar"></i> {LitteralDate(rdv.date_consultation)} à {literalHour(rdv.date_consultation)}</p>
                                                    <p><i className="fas fa-hospital"></i> {rdv.hopital.denomination}</p>

                                                    { (flag === "primary" || flag === "warning") && !this.getAppointmentConsultation(rdv) && (
                                                        <div style={{width: '100%', height: '25px'}}>
                                                            <Link className="appointment-action" to={`/patient/consultation/new/?appointment=${rdv.id}`} style={{ float: 'right', background: "#8ee2c6"}} > Passer la consultation </Link>
                                                        </div>
                                                    )}

                                                    { this.getAppointmentConsultation(rdv) && (
                                                        <div style={{width: '100%', height: '25px'}}>
                                                            <Link className="appointment-action" to={`/consultations_update/${this.getAppointmentConsultation(rdv).id}`} style={{ float: 'right', background: "#8ee2c6"}} > Modifier la consultation </Link>
                                                        </div>
                                                    )}

                                                    { flag !== "danger" && (
                                                        <div className="row task__detail__actions">
                                                            <div onClick={ () => { this.toggleAppointmentModal(date, {
                                                                    id: rdv.id, 
                                                                    patient: rdv.patient.id, 
                                                                    centre_medical: rdv.hopital.id, 
                                                                    time: literalHour(rdv.date_consultation)
                                                                }) }} 
                                                                className="col-lg-6 task__detail__action disabled">
                                                                <i className="fas fa-marker"></i> Modifier
                                                            </div>
                                                            <div onClick={ () => { this.deleteAppointment(rdv.id) }} className="col-lg-6 task__detail__action">
                                                                <i className="fas fa-trash"></i> Supprimer
                                                            </div>
                                                        </div>
                                                    )}
                                                        
                                                </div>
                                            </section>
                                        )
                                            
                                    }) }
                                </div>
                            );
                    })}
                </div>
                
            </div>
        );
    }
}

export default Calendar;
