import axios from "axios";
import { useState, useEffect } from "react";

// fontawsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

// Components
import { langs } from "../DataHelper";

// DataControlBox enternal component
const DataControlBox = (props) => {
    return (
        <div className="data-control-box" id={`dataInfo_${props.id}`}>
            <div className="data-box">
                <h6 className="data-name">{ props.name }</h6>
                <p className="data-des">{ props.des }</p>
            </div>
            <div className="control-box">
                <input type="hidden" />
                <button className="edit bg-success" id={`${props.id}`} onClick={ props.switchClick }>{ props.isFinshed === 0 ? "finshed" : "hold"}</button>
            </div>
        </div>
    );
}

const DPagePatient = (props) => {
    // state hooks
    const [ isShow, setShow ] = useState(false);
    const [ isLoading, setLoading ] = useState(false);
    const [ patientData, setPatientData ] = useState("");

    /*
        ====================
        -- methods helper --
        ====================
    */
    function showBox(e) {
        document.getElementById("updateTicketStatus").value = e.target.id;
        setShow(!isShow);
    }
    function updatePatientTicket(e) {
        let p = document.getElementById("updateTicketStatus").value;

        // update patient ticket
        axios({
            url: `https://queue-management-system-v1.onrender.com/doctor/control-update/${ p }`,
            method: `put`,
            headers: {
            "x-auth-token": localStorage.getItem("csrf_token")
            }
        })
        .then(
            (res) => {
                res = res.data;
                if (res.ok) {
                    setShow(false);
                }
            },
            (rej) => console.log(rej)
        )
    }
    function showPrescriptionBox() {
        setShow(false);
    }


    // get patient
    useEffect(() => {
        axios({
            url: `https://queue-management-system-v1.onrender.com/doctor/control-get-patient`,
            method: `get`,
            headers: {
            "x-auth-token": localStorage.getItem("csrf_token")
            }
        })
        .then(
            (res) => {
                res = res.data;
                if (res.ok) {
                    setPatientData(res.content);
                    setLoading(true);
                } else {
                    setPatientData(res.error);
                    setLoading(false);
                }
            },
            (rej) => console.log(rej)
        )
    });

    return (
        <div className="co-patient-page pages doctor-pages ">
            <div className="page-header">
                <div className="container-fluid">
                    <div className="header-top">
                        <h4 className="page-title">{ langs(props.pageName) + "s" }</h4>
                    </div>
                </div>
            </div>
            {/* page body */}
            <div className="page-body container-fluid">
                {
                    isLoading ?
                        patientData.map((el) => (
                            <DataControlBox 
                            key = {el.id} 
                            name = { el.name } 
                            des = { el.age }
                            id = { el.id }
                            isFinshed = { el.ticket_number }
                            switchClick = { showBox } />
                        ))
                    :
                            <h1> { patientData } </h1>
                }
            </div>
            <div className={`add-box select-type-methods ${ isShow ? "open" : ""}`}>
                <div className="add">
                    <input type="hidden" />
                    <h4 className="method-title"> {langs("confirmAppointment")} </h4>
                    <div className="data-btns">
                        <input type="hidden" id="updateTicketStatus" />
                        <button className="btn-no btn" id="sectionRegister" onClick={ showBox }>cancel</button>
                        <button className="btn-yes btn" id="sectionLogin" onClick={ updatePatientTicket }>ok</button>
                        <button className="btn-yes btn" id="sectionLogin" onClick={ showPrescriptionBox }>insert&create prescription</button>
                    </div>
                </div>
            </div>
            <div className="create-prescription-box show-box">
                <div className="box-header">
                    <h3> { langs("create", "prescription") } </h3>
                    <FontAwesomeIcon className="close-box-icon" icon={faClose} />
                </div>
                <div className="box-body">
                    <div className="prescription-area">
                        <div className="pre-header">header</div>
                        <div className="pre-body">body</div>
                        <div className="pre-footer">footer</div>
                    </div>
                    <div className="add-medical">add</div>
                </div>
                <div className="box-footer">
                    <button className="save-btn btn"> { langs("save") } </button>
                    <button className="print-btn btn"> { langs("print") } </button>
                    <button className="cancel-btn btn"> { langs("cancel") } </button>
                </div>
            </div>
        </div>
    );
}

export default DPagePatient;