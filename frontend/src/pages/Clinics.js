import axios from "axios";
import { useState, useEffect, useReducer } from "react";

// Components
import DataControlBox from "../components/DataControlBox";
import MessageBox from "../components/MessageBox";
import { langs } from "../DataHelper";

// reducer hooks config
const initialState = [
    {
        id: 1,
        type: "add",
        complete: false
    },
    {
        id: 2,
        type: "update",
        complete: false
    },
    {
        id: 3,
        type: "delete",
        complete: false
    },
    {
        id: 4,
        type: "openBox",
        complete: false
    },
];

const changeAction = (state, action) => {
    switch (action.type) {
      case "add":
        return state.map((el) => {
          if (el.id === action.id) {
            return { ...el, complete: !el.complete };
          } else {
            return { ...el, complete: false };
          }
        });
      case "update":
        return state.map((el) => {
          if (el.id === action.id) {
            return { ...el, complete: !el.complete };
          } else {
            return { ...el, complete: false };
          }
        });
      case "delete":
        return state.map((el) => {
          if (el.id === action.id) {
            return { ...el, complete: !el.complete };
          } else {
            return { ...el, complete: false };
          }
        });
      default:
        return state;
    }
  };

const Clinics = (props) => {
    // state hooks
    const [ isMsg, setMsg ] = useState("");
    const [ isUpdate, setUpdate ] = useState(false);
    const [ isLoading, setLoading ] = useState(false);
    const [ clinicData, setClinicData ] = useState("");
    const [ doctorData, setDoctorData ] = useState("");
    const [ isCheckBox, setCheckBox ] = useState(false);
    // reducer hook
    const [ actionType, dispatch ] = useReducer(changeAction, initialState)

    /*
        ====================
        -- methods helper --
        ====================
    */
    function showAddBox() {
        dispatch({ type: "add", id: 1 })
    }
    function showUpdateBox(e) {
        let oldParent = document.getElementById(`dataInfo_${e.target.id}`).id;
        let oldName = document.querySelector("#" + oldParent + " h6").innerText;
        // insert old value ===
        document.getElementById("ename").value = oldName;
        document.getElementById("formUpdateClinic").value = e.target.id;
        console.log(e.target.id)
        // toggle display box ===
        dispatch({ type: "update", id: 2 });

        // fetch not available doctor in one clinic
        axios({
            url: `https://queue-management-system-v1.onrender.com/doctor/get-doctor-not-available/${ e.target.id }`,
            method: `get`,
            headers: {
            "x-auth-token": localStorage.getItem("csrf_token")
            }
        })
        .then(
            (res) => {
                setDoctorData(res.data.content);
                setCheckBox(true);
            },
            (rej) => console.log(rej)
        )
    }
    function showDeleteBox(e) {
        e.preventDefault();
        document.getElementById("formDeleteDoctor").value = e.target.id;
        dispatch({ type: "delete", id: 3 })
    }
    function controlMessageBox(msg) {
        if (msg !== "") {
            setMsg(msg);
            // close box after 5 seconds
            setTimeout(() => setMsg(""), 3000);
        } else {
            // close box after 5 seconds
            setTimeout(() => setMsg(""), 3000);
        }
    }

    /*
        ==================================================================
        -- crud operation [ get - add - update - delete] on API methods --
        ==================================================================
    */

    // 1. get clinic
    useEffect(() => {
        const fetchClinic = async (e) => {
            axios({
                url: `https://queue-management-system-v1.onrender.com/clinic/get-custom/1`,
                method: `get`,
                headers: {
                "x-auth-token": localStorage.getItem("csrf_token")
                }
            })
            .then(
                (res) => {
                    res = res.data;
                    console.log(res);
                    if (res.ok) {
                        setLoading(true);
                        setClinicData(res.content);
                    } else {
                        setLoading(false);
                    }
                },
                (rej) => console.log(rej)
            )
        }

        fetchClinic();
    }, [ isUpdate ])
    // 2. add
    function addObject(e) {

        // prevent reload page
        e.preventDefault();

        // a. collection data
        let cname = document.getElementById("aname").value;

        // d. send data to server
        axios({
            url: "https://queue-management-system-v1.onrender.com/clinic/add",
            method: "post",
            data: {
                name: cname,
                stime: "",
                etime: ""
            },
            headers: {
                "x-auth-token": localStorage.getItem("csrf_token")
            }
        })
        .then(
            (res) => {
                res = res.data;
                if (res.ok) {
                    // clear fields
                    document.getElementById("aname").value = "";
                    // store message
                    controlMessageBox(res.message);
                    // close box
                    dispatch({ type: "add", id: 1 });
                    // update pages
                    setUpdate(!isUpdate);
                } else {
                    // store message
                    controlMessageBox(res.error);
                }
            },
            (rej) => console.log(rej)
        )

    }
    // 3. update
    function updateObject(e) {

        // prevent reload page
        e.preventDefault();
        let cid = document.getElementById("formUpdateClinic").value;
        // a. collection data
        let cname = document.getElementById("ename").value;
        let stime = document.getElementById("stime").value;
        let etime = document.getElementById("etime").value;
        let cstatus = document.getElementById("cstatus").checked;
        let doctorId = document.getElementById("edoctor").value;

        console.log(cname, stime, etime, cstatus, doctorId, cid)

        // d. send data to server
        axios({
            url: `https://queue-management-system-v1.onrender.com/clinic/update/${doctorId}`,
            method: "put",
            data: {
                cname: cname,
                cstart: stime,
                cend: etime,           
                clinicId: cid          
            },
            headers: {
                "x-auth-token": localStorage.getItem("csrf_token")
            }
        })
        .then(
            (res) => {
                res = res.data;
                if (res.ok) {
                    // clear fields
                    document.getElementById("aname").value = "";
                    document.getElementById("stime").value = "";
                    document.getElementById("etime").value = "";
                    document.getElementById("cstatus").checked = false;
                    // store message
                    controlMessageBox(res.message);
                    // close box
                    dispatch({ type: "update", id: 2 })
                    // update pages
                    setUpdate(!isUpdate);
                } else {
                    // store message
                    controlMessageBox(res.error);
                }
            },
            (rej) => console.log(rej)
        )

    }
    // 4. delete
    function deleteObject(e) {
        
        // pervent reload page
        e.preventDefault();
        let id = document.getElementById("formDeleteDoctor").value;

        axios({
            url: `https://queue-management-system-v1.onrender.com/clinic/delete/${id}`,
            method: "delete",
            headers: {
                "x-auth-token": localStorage.getItem("csrf_token")
            }
        })
        .then(
            (res) => {
                console.log(res.data, "**********");
                // close box after delete operation
                dispatch({ type: "delete", id: 3 });
                // update page and message
                controlMessageBox(res.data.message);
                setUpdate(!isUpdate)
            },
            (rej) => console.log(rej)
        )
    }

    // custom methods
    function filterDisplayData(e) {
        // prevent reload page
        e.preventDefault();
        // variables
        let query =document.getElementById("filterDisplayData").value;
        axios({
            url: `https://queue-management-system-v1.onrender.com/clinic/get-custom/${query}`,
            method: `get`,
            headers: {
            "x-auth-token": localStorage.getItem("csrf_token")
            }
        })
        .then(
            (res) => {
                res = res.data;
                console.log(res);
                if (res.ok) {
                    setLoading(true);
                    setClinicData(res.content);
                } else {
                    setLoading(false);
                }
            },
            (rej) => console.log(rej)
        )

    }

    return (
        <div className="clinic-page pages">
            <div className="page-header">
                <div className="container-fluid">
                    <div className="header-top">
                        <h4 className="page-title">{ langs(props.pageName) + "s" }</h4>
                        <div className="add" id="openBox" onClick={ showAddBox }>
                            { langs("add") }
                        </div>
                    </div>
                    <div className="header-bottom">
                        <div className="filter-box">
                            <form onSubmit={ filterDisplayData }>
                                <select defaultValue="1" id="filterDisplayData">
                                    <option value="01"> { langs("all") } </option>
                                    <option value="1"> { langs("available") } </option>
                                    <option value="0"> { langs("notAvailable") } </option>
                                </select>
                                <input type="submit" value={ langs("filter") } />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* page body */}
            <div className="page-body container-fluid">
                {
                    isLoading ?
                        clinicData.map((el) => (
                            <DataControlBox 
                            key={el.id} 
                            name={ el.name } 
                            des={ el.start_time + " | " + el.end_time }
                            id={ el.id }
                            editClick = { showUpdateBox }
                            delClick = { showDeleteBox } />
                        ))
                    : <h1>there is not available clinics</h1>
                }
            </div>
            {/* boxes for [ add - update - delete ] */}
            <div className={`add-box ${actionType[0].complete || actionType[1].complete || actionType[2].complete  ? "open" : ""}`}>
                <div className={ `add ${actionType[0].complete ? "" : " d-none"}` }>
                    <div className="box-header">
                        <p>{ langs("add", "clinic") }</p>
                        <i className="fa fa-close" onClick={ showAddBox }></i>
                    </div>
                    <form className="form-add" onSubmit={ addObject }>
                        <div className="form-group">
                            <label htmlFor="aname">{ langs("clinic", "name") }</label>
                            <input type="text" id="aname" />
                        </div>
                        <div className="form-group">
                            <input type="submit" value={ langs("add") } />
                        </div>
                    </form>
                </div>
                <div className={ `edit ${actionType[1].complete ? "" : " d-none"}` }>
                    <div className="box-header">
                        <p>{ langs("edit", "clinic") }</p>
                        <i className="fa fa-close" onClick={ () => dispatch({ type: "update", id: 2 }) }></i>
                    </div>
                    <form className="form-add" onSubmit={ updateObject }>
                        <div className="form-group">
                            <label htmlFor="ename">{ langs("clinic", "name") }</label>
                            <input type="text" id="ename" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="live">{ langs("duration") }</label>
                            <div className="time-box">
                                <input type="time" id="stime" />
                                <input type="time" id="etime" />
                            </div>
                        </div>
                        <div className="form-group live-box d-none">
                            <input type="checkbox" id="cstatus"/>
                            <label htmlFor="cstatus">{ langs("notAvailable") }</label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="eclinic">{ langs("select", "doctor") }</label>
                            <select id="edoctor" defaultValue="0">
                                <option value="0"> { langs("select", "doctor") } </option>
                                {
                                    doctorData &&
                                        doctorData.map((el) => (
                                            <option key={ el.id } value={ el.id }> { el.name } </option>
                                        ))
                                }

                            </select>
                        </div>
                        <div className="form-group">
                            <input type="hidden" id="formUpdateClinic" />
                            <input type="submit" value={langs("save")} />
                        </div>
                    </form>
                </div>
                <div className={ `delete ${actionType[2].complete ? "" : " d-none"}` }>
                    <div className="box-header">
                        <p>{ langs("delete", "clinic") }</p>
                        <i className="fa fa-close" onClick={ showDeleteBox }></i>
                    </div>
                    <form className="form-add">
                        <div className="form-group">
                            <h6>{ `${langs("confirmDeleteMessage")} ${langs("clinic")}?` }</h6>
                        </div>
                        <div className="form-group btns">
                            <input type="hidden" id="formDeleteDoctor" />
                            <input type="submit" value={ langs("delete")} onClick={ deleteObject } />
                            <input type="submit" value={ langs("cancel")} onClick={ showDeleteBox } />
                        </div>
                    </form>
                </div>
            </div>
            {/* box for display messages */}
            <MessageBox msgData={ isMsg } />
        </div>
    );
}

export default Clinics;