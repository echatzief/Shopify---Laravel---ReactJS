import React,{Component} from 'react';
import Navbar from './Navbar';

// The admin mainpanel after the login.
class AdminOptions extends Component{

    constructor(props){
        super(props);
        this.state={
            username:null,
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
    render(){
        return(
            <div>
                <Navbar
                    logout={this.logout}
                    deleteAccount={this.deleteAccount}
                />
            </div>
        );
    }
}
export default AdminOptions;