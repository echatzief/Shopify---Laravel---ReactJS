import React,{Component} from 'react';
import Navbar from './Navbar';

const signUpBut={
    borderRadius:'30px',
    width:'200px'
}
const signUpContainer={
    marginTop:'10%',
}
const spanStyle ={
    marginTop:'1%',
    fontFamily:'Oswald-Medium',
    fontSize:'50px',
    color:'#43383e',
    lineHeight:'1.2',
    textAlign:'center',
    display:'block',
}
const inputDiv={
    marginTop:'2%',
    display:'inline-block',
}
const changeInput={
    marginTop:'5%',
    marginBottom:'4%',
    borderRadius:'30px',
    padding:'15px',
}
const warningBoxStyle={
    marginTop:'3%',
    width:'70%',
}
const firstStyle= {
    width:'45%',
    background:'#fff',
    paddingTop:'2%',
    paddingBottom:'2%',
    border:'1px solid black',
}

//The existing admin is able to create
//a new admin.
class CreateNewAdmin extends Component{

    constructor(props){
        super(props);
        this.state={
            username:null,
            usernameInput:'',
            passwordInput:'',
            warningBoxDisplay:'none',
            warningBox:'',
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

    /* Hides the warning box */
    closeTheBox = ()=>{
        this.setState({
            warningBoxDisplay:'none',
        })
    }
    /* Change dynamically the data */
    changeUsername =(e)=>{
        this.setState({
            usernameInput:e.target.value,
        });
    }
    changePassword = (e)=>{
        this.setState({
            passwordInput:e.target.value,
        })
    }

    submitWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.submit();
        }
    }
    submit = ()=>{
        var username=this.state.usernameInput;
        var password=this.state.passwordInput;

        if(username !=='' && password !==''){
            axios.post('/createNewAdmin',{username,password})
            .then(res=>{
                if(res.data[0].status===false){
                    this.setState({
                        warningBoxDisplay:'block',
                        warningBox:'Username already taken',
                    })
                }
                else{
                    this.props.history.push('/adminMainPage');
                }
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
               <div className="container text-center" style={signUpContainer}>                
                    <div style={firstStyle} className="container text-center">
                        <span style={spanStyle}>Personal Data</span>

                        {/* Warning box */}
                        <div className="container text-center alert alert-danger alert-dismissible" style={Object.assign({display:this.state.warningBoxDisplay},warningBoxStyle)}>
                            <button className="close" onClick={this.closeTheBox}>&times;</button>
                            <strong>{this.state.warningBox}</strong>
                        </div>
                        
                        {/*Username*/}
                        <div className="container text-center">
                            <div className="form-group mb-2" style={inputDiv}>
                                <input type="text" className="form-control" style={changeInput} value={this.state.usernameInput} onChange={this.changeUsername} placeholder="Username" autoFocus/>
                                <input type="password"  className="form-control" style={changeInput} onChange={this.changePassword} onKeyPress={this.submitWithEnter} value={this.state.passwordInput} placeholder="Password"/>
                                <button style={signUpBut} type="button" className="btn btn-dark" onClick={this.submit}>SignUp</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default CreateNewAdmin;