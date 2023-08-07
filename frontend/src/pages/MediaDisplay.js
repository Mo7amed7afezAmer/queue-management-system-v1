import axios from 'axios';
import { useEffect, useState } from "react";

// components
import DisplayDataScreen from '../components/DisplayDataScreen';

const MediaDisplay = () => {

    // state
    const [ dataBox, setData ] = useState("");
    const [ isLoading, setLoading ] = useState(false);

    // methods
    // get available clinic
    useEffect(() => {
        axios({
            url: `https://queue-management-system-v1.onrender.com/clinic/display-display`,
            method: `get`,
            headers: {
            "x-auth-token": localStorage.getItem("csrf_token")
            }
        })
        .then(
            (res) => {
                res = res.data;
                if (res.ok) {
                    setData(res.content);
                    setLoading(true);
                } else {
                    setData(res.error);
                    setLoading(false);
                }
            },
            (rej) => console.log(rej)
        )
    });

    return (
        <div className="media-signage-page">
            <div className="page-navbar d-none">navbar</div>
            <div className="row container-fluid">
                <div className="page-content col-sm-10">
                    <div className="row">
                        {
                                isLoading ?
                                    dataBox.map((el) => 
                                        <div className="col-sm-6" key = { el.id }>
                                            <DisplayDataScreen
                                            val = { el.id }
                                            clinicName = { el.name } 
                                            doctorName = { el.d_name }
                                            doctorSpecialist = { el.specialist }
                                            cstart = { el.start_time }
                                            cend  = { el.end_time }
                                            patientNumber = { el.lowerValue }
                                            />
                                        </div>
                                    )
                                :
                                    <h1> { "there is not available any clinics !" } </h1>
                            }
                    </div>
                </div>
                <div className="page-sidebar col-sm-2">
                    sidebar
                </div>
            </div>
        </div>
    )

}

export default MediaDisplay;
