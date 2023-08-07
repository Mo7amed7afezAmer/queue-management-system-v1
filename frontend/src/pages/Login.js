import axios from "axios";

const Login = () => {


//   const handleSubmit = (event) => {
//     //Prevent page reload
//     event.preventDefault();

//     // var { uname, pass } = document.forms[0];

//     // collections data
//     let data = {};
//     data['name'] = document.getElementById('username').value;
//     data['password']   = document.getElementById('password').value;


//     // request
//     fetch("http://mo7amed7afez.pythonanywhere.com/login", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//           "Access-Control-Allow-Headers": "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
//         },
//         body: JSON.stringify({
//             data
//         })
//     })
//     .then (res => {
//         if (res.ok) {
//             console.log(res.json);
//             return res.json;
//         } else {
//             throw Error(res.statusText);
//         }
//     })

    
    
//   };

// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             // Does this cookie string begin with the name we want?
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }


function checkLogin(e) {
    // prevent reload page
    e.preventDefault()

    // collections data
    let data = {};
    data['username'] = document.getElementById('username').value;
    data['password']   = document.getElementById('password').value;

    // You should client validation on data

    axios.post("https://queue-management-system-v1.onrender.com/auth", {
      name: data['username'],
      password: data['password']
    })
    .then(
        (res) => {
            return res.data;
        },
        (rej) => {
            console.log(rej.message);
            return 0;
        }
    )
    .then((res) => {
        if (!res.ok) {
            console.log(res);
        } else {
            // store token in local storage
            localStorage.setItem("csrf_token", res.token);
            localStorage.setItem("doctorName", res.profileInfo[0].name);
            if (res.profileInfo[0].specialist === "admin") {
                localStorage.setItem("tokenType", res.profileInfo[0].specialist);
                // redirect to dashboard [admin]
                window.location.assign("admin/dashboard");
            } else {
                localStorage.setItem("tokenType", "doctor");
                // redirect to dashboard [doctor]
                window.location.assign("doctor/dashboard");
            }
            // redirect to dashboard page
            // window.location.assign("admin/dashboard"); /// ************* it was big problems in router
        }
    })


}

    return (
        <div className="login-page">
            <div className="page-box container">
                <div className="inner-box shadow col-md-4 col-sm-6">
                    <div className="form">
                        <div className="title">login</div>
                        <form className="container" onSubmit={ checkLogin } method="post">
                            <div className="form-group mb-2">
                                <label htmlFor="username">user name</label>
                                <input type="text" id="username" name="uname" required />
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="pass">password</label>
                                <input type="password" id="password" name="password" required />
                            </div>
                            <div className="form-group mb-3">
                                <input type="submit" className="main-btn" value="Sign In" />
                            </div>
                        </form>
                    </div>
                    <div className="register-box container d-none">
                        <div className="separated-line line-or"></div>
                        <a href="/" className="main-btn">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;