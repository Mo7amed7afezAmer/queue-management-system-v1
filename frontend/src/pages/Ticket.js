import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// middileware
import { langs } from "../DataHelper";

// components
import MessageBox from '../components/MessageBox';
import DisplayDataScreen from '../components/DisplayDataScreen';

const Ticket = () => {
    const navigate = useNavigate();

    // state
    const [ isShow, setShow ] = useState("sectionStart");
    const [ isMsg, setMsg ] = useState("");
    const [ dataBox, setData ] = useState("");

    // methods helper
    // create ticket number
    // useEffect(() => {
    //     const fetchData = async (e) => {
    //         const result = await axios({
    //             url: `https://queue-management-system-v1.onrender.com/clinic/max-ticket-number/5`,
    //             method: `get`,
    //             headers: {
    //             "x-auth-token": localStorage.getItem("csrf_token")
    //             }
    //         });
    //         localStorage.setItem("ticket_number", result.data.content[0].higherValue)
    //     }
    //     fetchData();
    // }, []);

    function showBOX(e) {
        e.preventDefault();
        let x = e.target.id;
        setShow(x);
    }
    function moveTOconfirm(e) {
        let x = document.querySelector("#clinicIdToConfirm input[type='hidden']").value = e.target.id;
        console.log(document.querySelector("#clinicIdToConfirm input[type='hidden']"));
        document.getElementById("clinicIdToConfirm").setAttribute("style", "display: block;");
        const fetchData = async (e) => {
            const result = await axios({
                url: `https://queue-management-system-v1.onrender.com/clinic/max-ticket-number/${ x }`,
                method: `get`,
                headers: {
                "x-auth-token": localStorage.getItem("csrf_token")
                }
            });
            localStorage.setItem("ticket_number", result.data.content[0].higherValue)
        }
        fetchData();
    }
    // confirm & send data
    function okConfirm(e) {
        // data
        let c_id = document.querySelector("#clinicIdToConfirm input[type='hidden']").value;
        let count = localStorage.getItem("ticket_number");

        if (isNaN(count)) {
            count = 1;
        } else {
            count++;
        }
        console.log(count)
        // send a request
        axios({
            url: `https://queue-management-system-v1.onrender.com/clinic/add-ticket`,
            method: "post",
            data: {
                ticketNumber: count,
                clinicId: c_id,
                patientId: localStorage.getItem("patient_id")
            },
            headers : {
                "x-auth-token": localStorage.getItem("patient_token")
            }
        })
        .then(
            (res) => {
                res = res.data;
                if (res.ok) {
                    // next step
                    // window.location.assign("/media-display");
                    // <Navigate to="/media-display" replace={true} />
                    navigate("/media-display");
                } else {
                    controlMessageBox(res.error);
                }
            },
            (rej) => console.log(rej)
        )
    }
    function cancelConfirm(e) {
        document.getElementById("clinicIdToConfirm").setAttribute("style", "display: none;");
    }
    function controlMessageBox(msg) {
        if (msg !== "") {
            setMsg(msg);
            // close box after 3 seconds
            setTimeout(() => setMsg(""), 3000);
        } else {
            // close box after 5 seconds
            setTimeout(() => setMsg(""), 3000);
        }
    }

    // Methods for speeck with apis
    function isLogin(e) {
        e.preventDefault();

        // data
        let uname = document.getElementById("chname").value;
        let upass = document.getElementById("chpassword").value;

        console.log(uname, upass)
        // send a request
        axios({
            url: `https://queue-management-system-v1.onrender.com/auth/patient-login`,
            method: "post",
            data: {
                name: uname,
                password: upass
            }
        })
        .then(
            (res) => {
                res = res.data;
                if (res.ok) {
                    localStorage.setItem("patient_token", res.token);
                    localStorage.setItem("patient_id", res.profileInfo[0].id);
                    // next step
                    setShow(e.target.id);
                } else {
                    controlMessageBox(res.error);
                }
            },
            (rej) => console.log(rej)
        )
    }
    // register a new patient
    function isRegister(e) {
        e.preventDefault();

        // data
        let uname = document.getElementById("pname").value;
        let upass = document.getElementById("ppassword").value;
        let uage = document.getElementById("patage").value;

        // send a request
        axios({
            url: `https://queue-management-system-v1.onrender.com/auth/patient-register`,
            method: "post",
            data: {
                name: uname,
                password: upass,
                age: uage
            }
        })
        .then(
            (res) => {
                res = res.data;
                if (res.ok) {
                    localStorage.setItem("patient_token", res.token);
                    localStorage.setItem("patient_id", res.profileInfo[0].id);
                    // next step
                    setShow("sectionSelectClinic")
                } else {
                    controlMessageBox(res.error);
                }
            },
            (rej) => console.log(rej)
        )
    }

    // get available clinic
    useEffect(() => {
        const fetchData = async (e) => {
            const result = await axios({
                url: `https://queue-management-system-v1.onrender.com/clinic/data-for-display`,
                method: `get`,
                headers: {
                "x-auth-token": localStorage.getItem("csrf_token")
                }
            });
            setData(result.data.content);
        }
        
        fetchData();
    })

    return (
        <div className="ticket-page">
            <section className={`section-start ${isShow === "sectionStart" ? "open" : null}`}>
                <div className="inner-box">
                    <div className="inner-title">
                        <h2 className="box-title">{ langs("ticketMessage") }</h2>
                        <div className="progress-bar">
                            <span style={{width: isShow === "sectionStart" ? 0 : 0}}></span>
                        </div>
                    </div>
                    <div className="box-data">
                        <h4 className="data-title"> {langs("startTicketMessage")} </h4>
                        <div className="data-btns">
                            <button className="btn-no btn" id="sectionRegister" onClick={ showBOX }>no</button>
                            <button className="btn-yes btn" id="sectionLogin" onClick={ showBOX }>yes</button>
                        </div>
                    </div>
                </div>
            </section>
            <section className={`section-login ${isShow === "sectionLogin" ? "open" : null}`}>
                <div className="inner-box">
                    <div className="inner-title">
                        <h2 className="box-title">{ langs("ticketMessage") }</h2>
                        <div className="progress-bar">
                            <span style={{width: isShow === "sectionLogin" ? "33%" : 0}}></span>
                        </div>
                    </div>
                    <div className="box-data">
                        <form className="form" id="sectionSelectClinic" onSubmit={ isLogin }>
                            <div className="form-group mb-1">
                                <input type="text" id="chname" placeholder={langs("enter", "name")} />
                            </div>
                            <div className="form-group mb-1">
                                <input type="password" id="chpassword" placeholder={langs("password")} autoComplete="off" />
                            </div>
                            <div className="form-group mb-1">
                                <input type="submit" value={langs("login")} />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <section className={`section-register ${isShow === "sectionRegister" ? "open" : null}`}>
                <div className="inner-box">
                    <div className="inner-title">
                        <h2 className="box-title">{ langs("ticketMessage") }</h2>
                        <div className="progress-bar">
                            <span style={{width: isShow === "sectionRegister" ? "33%" : 0}}></span>
                        </div>
                    </div>
                    <div className="box-data">
                        <form className="form" onSubmit={ isRegister }>
                            <div className="form-group mb-1">
                                <input type="text" id="pname" placeholder={langs("enter", "name")} />
                            </div>
                            <div className="form-group mb-1">
                                <input type="password" id="ppassword" placeholder={langs("password")} autoComplete="off" />
                            </div>
                            <div className="form-group mb-1">
                                <input type="text" id="patage" placeholder={langs("age")} />
                            </div>
                            <div className="form-group mb-1">
                                <input type="submit" value={langs("register")} />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <section className={`section-select-clinic ${isShow === "sectionSelectClinic" ? "open" : null}`}>
                <div className="inner-box">
                    <div className="inner-title">
                        <h2 className="box-title">{ langs("ticketMessage") }</h2>
                        <div className="progress-bar">
                            <span style={{width: isShow === "sectionSelectClinic" ? "67%" : 0}}></span>
                        </div>
                    </div>
                    <div className="box-data">
                        <div className="data-btns">
                            <h4 className="data-title">select a clinic</h4>
                            {/* <button className="done">done</button> */}
                        </div>
                        <div className="row">
                            {
                                dataBox &&
                                    dataBox.map((el) => 
                                        <div className="col-sm-6">
                                            <DisplayDataScreen
                                            key = { el.id }
                                            val = { el.id }
                                            clinicName = { el.name } 
                                            doctorName = { el.d_name }
                                            doctorSpecialist = { el.specialist }
                                            cstart = { el.start_time }
                                            cend  = { el.end_time }
                                            addClick = { moveTOconfirm }
                                            />
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                    <div className="confirm-box" id="clinicIdToConfirm">
                        <input type="hidden" />
                        <h4 className="data-title"> {langs("confirmAppointment")} </h4>
                        <div className="data-btns">
                            <button className="btn-no btn" id="sectionRegister" onClick={ cancelConfirm }>cancel</button>
                            <button className="btn-yes btn" id="sectionLogin" onClick={ okConfirm }>ok</button>
                        </div>
                    </div>
                </div>
            </section>
            {/* box for display messages */}
            <MessageBox msgData={ isMsg } />
        </div>
    )

}

export default Ticket;
