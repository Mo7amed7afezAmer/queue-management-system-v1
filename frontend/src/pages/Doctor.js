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

const Doctor = (props) => {
    // state hooks
    const [ isMsg, setMsg ] = useState("");
    const [ isUpdate, setUpdate ] = useState(false);
    const [ clinicData, setClinicData ] = useState("");
    const [ doctorData, setDoctorData ] = useState("");
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
        let oldDes = document.querySelector("#" + oldParent + " p").innerText;
        // insert old value
        document.getElementById("ename").value = oldName;
        document.getElementById("especialist").value = oldDes;
        document.getElementById("formUpdateDoctor").value = e.target.id;
        // toggle display box
        dispatch({ type: "update", id: 2 });
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
    // 1. get doctor
    useEffect(() => {
        const fetchDoctor = async () => {
        const result = await axios({
            url: `https://queue-management-system-v1.onrender.com/doctor`,
            method: `get`,
            headers: {
            "x-auth-token": localStorage.getItem("csrf_token")
            }
        });
            setDoctorData(result.data);
            console.log(result.data)
        }

        fetchDoctor();    
    }, [ isUpdate ])

    // 1. get clinic
    useEffect(() => {
        const fetchClinic = async () => {
        const result = await axios({
            url: `https://queue-management-system-v1.onrender.com/clinic`,
            method: `get`,
            headers: {
            "x-auth-token": localStorage.getItem("csrf_token")
            }
        });
            setClinicData(result.data);
        }

        fetchClinic();

        // axios({
        //     url: `https://queue-management-system-v1.onrender.com/clinic`,
        //     method: `get`,
        //     headers: {
        //     "x-auth-token": localStorage.getItem("csrf_token")
        //     }
        // })
        // .then(
        //     (res) => {
        //         res = res.data;
        //         if (res.ok) {
        //             setClinicData(res.content);
        //             setLoading("clinic");
        //         } else {
        //             setClinicData(res.error);
        //             setLoading("");
        //         }
        //     },
        //     (rej) => rej
        // )

    }, [ isUpdate ])
    // 2. add
    function addObject(e) {

        // prevent reload page
        e.preventDefault();

        // a. collection data
        let dname = document.getElementById("aname").value;
        let dpassword = document.getElementById("apassword").value;
        let specialist = document.getElementById("aspecialist").value;
        let cname = document.getElementById("aclinic").value;

        // d. send data to server
        axios({
            url: "https://queue-management-system-v1.onrender.com/doctor/add",
            method: "post",
            data: {
                name: dname,
                password: dpassword,
                specialist: specialist,
                clinic_id: cname                
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
                    document.getElementById("apassword").value = "";
                    document.getElementById("aspecialist").value = "";
                    document.getElementById("aclinic").value = 1;
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
        let id = document.getElementById("formUpdateDoctor").value;
        console.log(id);
        // a. collection data
        let dname = document.getElementById("ename").value;
        let dpassword = document.getElementById("epassword").value;
        let specialist = document.getElementById("especialist").value;
        let cname = document.getElementById("eclinic").value;

        // d. send data to server
        axios({
            url: `https://queue-management-system-v1.onrender.com/doctor/update/${id}`,
            method: "put",
            data: {
                name: dname,
                password: dpassword,
                specialist: specialist,
                clinic_id: cname                
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
                    document.getElementById("apassword").value = "";
                    document.getElementById("aspecialist").value = "";
                    document.getElementById("aclinic").value = 1;
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
            url: `https://queue-management-system-v1.onrender.com/doctor/delete/${id}`,
            method: "delete",
            headers: {
                "x-auth-token": localStorage.getItem("csrf_token")
            }
        })
        .then(
            (res) => {
                console.log(res.data);
                // close box after delete operation
                dispatch({ type: "delete", id: 3 });
                // update page and message
                controlMessageBox(res.data.message);
                setUpdate(!isUpdate)
            },
            (rej) => console.log(rej.response.data)
        )
    }

    return (
        <div className="clinic-page pages">
            <div className="page-header">
                <div className="container-fluid">
                    <div className="header-top">
                        <h4 className="page-title">{ langs(props.pageName) }</h4>
                        <div className="add" id="openBox" onClick={ showAddBox }>
                            { langs("add") }
                        </div>
                    </div>
                </div>
            </div>
            {/* page body */}
            <div className="page-body container-fluid">
                {
                    doctorData.ok ?
                        doctorData.content.map((el) => (
                            <DataControlBox 
                            key={el.id} 
                            name={ el.name } 
                            des={ el.specialist } 
                            id={ el.id }
                            boxData={[el.id, el.name, el.specialist]}
                            editClick = { showUpdateBox }
                            delClick = { showDeleteBox } />
                        ))
                    :
                        <h1>loading...</h1>
                }
            </div>
            {/* boxes for [ add - update - delete ] */}
            <div className={`add-box ${actionType[0].complete || actionType[1].complete || actionType[2].complete  ? "open" : ""}`}>
                <div className={ `add ${actionType[0].complete ? "" : " d-none"}` }>
                    <div className="box-header">
                        <p>{ langs("add", "doctor") }</p>
                        <i className="fa fa-close" onClick={ showAddBox }></i>
                    </div>
                    <form className="form-add" onSubmit={ addObject }>
                        <div className="form-group">
                            <label htmlFor="aname">{ langs("doctor", "name") }</label>
                            <input type="text" id="aname" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apassword">{ langs("password") }</label>
                            <input type="password" id="apassword" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="aspecialist">{ langs("enter", "specialist") }</label>
                            <input type="text" id="aspecialist" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="aclinic">{ langs("select", "clinic") }</label>
                            <select id="aclinic" defaultValue="2">
                                
                                {
                                    clinicData.ok ?
                                        clinicData.content.map((el) => (
                                            <option key={ el.id } value={ el.id }> { el.name } </option>
                                        ))
                                    : <pption>{"loading"}</pption>
                                }

                            </select>
                        </div>
                        <div className="form-group">
                            <input type="submit" value={ langs("add") } />
                        </div>
                    </form>
                </div>
                <div className={ `edit ${actionType[1].complete ? "" : " d-none"}` }>
                    <div className="box-header">
                        <p>{ langs("edit", "doctor") }</p>
                        <i className="fa fa-close" onClick={ () => dispatch({ type: "update", id: 2 }) }></i>
                    </div>
                    <form className="form-add" onSubmit={ updateObject }>
                        <div className="form-group">
                            <label htmlFor="ename">{ langs("doctor", "name") }</label>
                            <input type="text" id="ename" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="epassword">{ langs("password") }</label>
                            <input type="password" id="epassword" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="especialist">{ langs("enter", "specialist") }</label>
                            <input type="text" id="especialist" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eclinic">{ langs("select", "clinic") }</label>
                            <select id="eclinic" defaultValue="2">
                                
                                {
                                    clinicData.ok ?
                                        clinicData.content.map((el) => (
                                            <option key={ el.id } value={ el.id }> { el.name } </option>
                                        ))
                                    :  <pption>loading</pption>
                                }

                            </select>
                        </div>
                        <div className="form-group">
                            <input type="hidden" id="formUpdateDoctor" />
                            <input type="submit" value={langs("save")} />
                        </div>
                    </form>
                </div>
                <div className={ `delete ${actionType[2].complete ? "" : " d-none"}` }>
                    <div className="box-header">
                        <p>{ langs("delete", "doctor") }</p>
                        <i className="fa fa-close" onClick={ showDeleteBox }></i>
                    </div>
                    <form className="form-add">
                        <div className="form-group">
                            <h6>{ langs("confirmDeleteMessage") }</h6>
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

export default Doctor;