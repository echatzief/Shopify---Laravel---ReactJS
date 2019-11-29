import React,{Component} from 'react';
import Logo from './img/Logo.png';

const hrefBorder={
    border:'1px solid  #D42A2B',
}
const lastDiv={
    marginRight:'5%',
}
const dropdownStyle={
    marginLeft:'2%',
}

//Reusable navbar component. 
class Navbar extends Component{
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a href="/adminMainPage" style={hrefBorder}><img src={Logo} width="50" height="50"/></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">

                    {/* First dropdown */}
                    <div className=""  style={dropdownStyle}>
                        <div className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Actions
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="/addProduct">Add product</a>
                                <a className="dropdown-item" href="/showAllOrders">Show orders</a>
                                <a className="dropdown-item" href="/bestCustomers">Best customers</a>
                                <a className="dropdown-item" href="/bestCities">Best cities</a>
                                <a className="dropdown-item" href="/createNewAdmin">Create new admin</a>
                                <a className="dropdown-item" href="/deleteCustomer">Delete a customer</a>
                            </div>
                        </div>
                    </div>
                    {/* Sec dropdown */}
                    <div className="mr-auto"  style={dropdownStyle}>
                        <div className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Tools
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="/deleteTable">Delete table </a>
                                <a className="dropdown-item" href="/addFieldToTable">Add field to table</a>
                                <a className="dropdown-item" href="/deleteFieldFromTable">Delete field from table</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-2" style={lastDiv}>
                        <div className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Account
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="javascript:void(0);" data-toggle="modal" data-target="#deleteAccount" >Delete</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="javascript:void(0);" onClick={this.props.logout}>Logout</a>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="deleteAccount" tabIndex="-1" role="dialog" aria-labelledby="deleteAccount" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteAccount">Delete Account</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <span>Are you sure you want to permantly delete your account</span>
                            </div>
                            <div className="modal-footer justify-content-md-center">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-success" onClick={this.props.deleteAccount}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </nav>
        );
    }
}
export default Navbar;