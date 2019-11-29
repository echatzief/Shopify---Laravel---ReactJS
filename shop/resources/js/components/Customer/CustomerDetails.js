import React,{Component} from 'react';
import NavBar from './Navbar';

const detailsStyle={
    width:'50%',
    marginTop:'2%',
    paddingBottom:'2%',
    border:'1px solid #3c424c'
}

//Its show the details of the current customer.
//The customer can also change his/her password.
class CustomerDetails extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            productsInCart:null,
            customerDetails:[],
            password:'',
        }
    }

    componentWillMount(){
         /* Get the username */
         this.setState({
            username:localStorage.getItem('username'), 
        },()=>{
            //console.log("Local :"+localStorage.getItem('username'));
            //console.log("Username from storage: "+this.state.username);
            if(this.state.username === null){
                this.props.history.push('/');
            }

            /* Get the number of orders */
            var username=this.state.username;
            //console.log("Username: "+username);
            axios.post('/numberOfOrders',{username})
            .then(res=>{
                //console.log(res);
                this.setState({
                    productsInCart:res.data,
                })
            })
        })

        var username=localStorage.getItem('username');
        /* Get Customer details */
        axios.post('/getCustomerDetails',{username})
        .then(res=>{
            this.setState({
                customerDetails:res.data[0],
            },()=>{
                //console.log(this.state.customerDetails);
            })
        })

    }
    logout = ()=>{
        localStorage.clear();
        this.props.history.push('/');
    }
    deleteAccount= ()=>{
        var username=this.state.username;
        axios.post('/deleteAccount',{username})
        .then(res=>{
            //console.log(res);
            localStorage.clear();
            this.props.history.push('/');
        })
    }
    changeInput = (e)=>{
        this.setState({
            password:e.target.value,
        })
    }
    changePassword = ()=>{

        var username=this.state.username;
        var password=this.state.password;
        axios.post('/changeCustomerPassword',{username,password})
        .then(res=>{
           //console.log(res);
        })
        this.props.history.push('/details');
    }
    render(){
        return(
            <div>
                 <NavBar 
                    username={this.state.username}
                    logout={this.logout}
                    deleteAccount={this.deleteAccount}
                    productsInCart={this.state.productsInCart}
                />
                <div className="container card text-center" style={detailsStyle}>
                    <div className="row">
		                <div className="col-md-12 justify-content-md-center">
		                    <h4>Your Profile</h4>
                            <hr/>
		                </div>
		            </div>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            Username:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.username}
                        </div>
                        <div className="col-sm justify-content-md-center">

                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            Password:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.password}
                        </div>
                        <div className="col-sm justify-content-md-center">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editPassword">
                                Edit
                            </button>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            Email:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.customer_email}
                        </div>
                        <div className="col-sm justify-content-md-center">
                            
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            Firstname:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.customer_fname}
                        </div>
                        <div className="col-sm justify-content-md-center">
                            
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            Lastname:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.customer_lname}
                        </div>
                        <div className="col-sm justify-content-md-center">
                            
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            Phone:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.customer_phone}
                        </div>
                        <div className="col-sm justify-content-md-center">
                            
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            Address:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.address_name}
                        </div>
                        <div className="col-sm justify-content-md-center">
                            
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            Address Number:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.address_number}
                        </div>
                        <div className="col-sm justify-content-md-center">
                            
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            Country:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.address_country}
                        </div>
                        <div className="col-sm justify-content-md-center">
                            
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm justify-content-md-center">
                            City:
                        </div>
                        <div className="col-sm justify-content-md-center">
                            {this.state.customerDetails.address_city}
                        </div>
                        <div className="col-sm justify-content-md-center">
                            
                        </div>
                    </div>
                    <hr/>
                    {/* Modal */}
                    <div className="modal" id="editPassword" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change password</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input type="password" className="form-control" onChange={this.changeInput} value={this.state.password} placeholder="Enter new password"/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={this.changePassword}>Save changes</button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default CustomerDetails;