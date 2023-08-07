const DisplayDataScreen = (props) => {
    return (
        <div className="display-info-box" id = { props.val } onClick={ props.addClick }>
            <div className="box-header">
                <p className="clinic-name"> { props.clinicName } </p>
            </div>
            <div className="box-body">
                <p className="doctor-name">d. { props.doctorName } </p>
                <p className="doctor-specialist"> { props.doctorSpecialist } </p>
                <p className="clinic-duration"> { props.cstart + " : " + props.cend } </p>
            </div>
            <div className="box-footer d-none">
                <span className="patient-number"> { props.patientNumber } </span>
            </div>
        </div>
    )
}

export default DisplayDataScreen;