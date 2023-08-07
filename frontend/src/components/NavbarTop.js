export default function NavbarTop(props) {
    return (
        <nav className="navbar-top navbar">
            <div className="container-fluid d-flex">
                <div className="nav-brand d-flex">
                    <div className="nav-toggler" onClick={ props.addClick }>
                        <span></span>
                    </div>
                    <h4 className="nav-title d-none">dashboard</h4>
                </div>
                <div className="nav-data d-flex">
                    <div className="nav-icons">
                        <i className="fa fa-home"></i>
                    </div>
                    <form className="nav-search">
                        <input type="text" />
                        <i className="fa fa-search"></i>
                    </form>
                    <div className="nav-profile">
                        <div className="img-box">
                            {/* img */}
                        </div>
                        <span></span>
                    </div>
                </div>
            </div>
        </nav>
    );
};