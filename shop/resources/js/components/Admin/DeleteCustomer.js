import React,{Component} from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const ulStyle={
    height:'auto',
    maxHeight:'200px',
    width:'200px',
    overflowX:'hidden',
}
const containerStyle={
    width:'45%',
    marginTop:'10%',
    background:'#fff',
    paddingBottom:'2%',
    paddingTop:'2%',
    border:'1px solid black',
}
const changeInput={
    marginTop:'2%',
    marginBottom:'2%',
    borderRadius:'30px',
}

//Admin can delete an existing customer.
class DeleteCustomer extends Component{

    constructor(props){
        super(props);
        this.state={
            username:'',
            chosenItem:'Choose Customer',
            customers:[],
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
        })

        axios.get('/getAllCustomers')
        .then(res=>{
            //console.log(res);
            this.setState({
                customers:res.data,
            })
        })
    }

    logout = ()=>{
        localStorage.clear();
        this.props.history.push('/');
    }
    deleteAccount = ()=>{
        var username=this.state.username;
        axios.post('/deleteAdminAccount',{username})
        .then(res=>{
            //console.log(res);
            localStorage.clear();
            this.props.history.push('/');
        })
    }

    swapItem = (e)=>{
        this.setState({
            chosenItem:e.target.id,
        })
    }
    renderCustomers = (item)=>{
        return(
            <li key={item.username.trim()}><a href="javascript:void(0)" id={item.username.trim()} onClick={this.swapItem}>{item.username.trim()}</a></li>
        )
    }
    deleteCustomer = ()=>{
        var username=this.state.chosenItem;

        if(username !=='Choose Customer'){
            axios.post('/deleteAccount',{username})
            .then(res=>{
                //console.log(res);
                this.props.history.push('/deleteCustomer');
            })
        }
    }
    render(){
        return(
            <div>
                <Navbar
                    logout={this.logout}
                    deleteAccount={this.deleteAccount}
                />
                <div className="container text-center" style={containerStyle}>
                    <div className="row justify-content-md-center" style={changeInput}>
                        <h3>Choose customer to delete</h3>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <div className="btn-group">
                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" style={{width:'200px'}}>{this.state.chosenItem}<span className="caret"></span></button>
                            <ul className="dropdown-menu scrollable-menu" style={ulStyle} role="menu">
                                {this.state.customers.map((item)=>this.renderCustomers(item))}
                            </ul>
                        </div>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <button type="button" className="btn btn-danger" onClick={this.deleteCustomer}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default DeleteCustomer;