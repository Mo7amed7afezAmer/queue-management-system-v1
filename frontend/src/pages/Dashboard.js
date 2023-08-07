const Dashboard = (props) => {

    return (
        <div className="dash-page">
            <div className="page-header">
                <div className="container-fluid">
                    <h4 className="page-title">{ props.pageName }</h4>
                </div>
            </div>
            <div className="page-body container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="one inner-box">
                            <i className="fa fa-home"></i>
                            <h2>projects</h2>
                            <span>3</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="two inner-box">
                            <i className="fa fa-list"></i>
                            <h2>tasks</h2>
                            <span>15</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="three inner-box">
                            <i className="fa fa-users"></i>
                            <h2>users</h2>
                            <span>7</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;