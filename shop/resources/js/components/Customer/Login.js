import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './css/App.css';

/* The style we use at the login form */
const LoginContainer={
    marginTop:'7%',
    border:'2px',
}
const span ={
    fontFamily:'Oswald-Medium',
    fontSize:'50px',
    color:'#43383e',
    lineHeight:'1.2',
    textAlign:'center',
    display:'block',
}
const dataInput={
    marginTop:'3%',
    width:'80%',
}
const changeInput={
    borderRadius:'30px',
    padding:'25px'
}
const LoginButCont={
    marginTop:'3%',
    borderRadius:'30px',
}
const LoginBut={
    borderRadius:'30px',
    width:'200px'
}
const newAccountDiv={
    marginTop:'3%',
    marginBottom:'10%',
}
const newAccount={
    fontFamily:'Oswald-Regular',
    fontSize:'16px',
    color:'#999999',
    lineHeight:'1.4',
}
const hrefStyle={
    fontFamily:'Oswald-Regular',
    fontSize:'16px',
    color:'#333333',
    lineHeight:'1.2',
}
const warningBoxStyle={
    marginTop:'3%',
    width:'70%',
}
const outerBox={
    paddingTop:'8%',
    paddingBottom:'8%',
    width:'50%',
    border:'2px solid gray',
    backgroundColor:'#fff',
}

//Creates a form for login.
export default class Login extends Component{
    
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            warningBox:'',
            warningBoxDisplay:'none',
        }
    }
    /* Change the input fields*/
    changeUsername = (e)=>{
        this.setState({
            username:e.target.value,
        })
    }
    changePassword = (e)=>{
        this.setState({
            password:e.target.value,
        })
    }

    /* Submit pressing enter */
    submitWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.loginNow();
        }
    }

    /* hide the warning box */
    closeTheBox = ()=>{
        this.setState({
            warningBoxDisplay:'none',
        })
    }

    /* Login function to go in to the chat */
    loginNow = (e)=>{
        //console.log("Username: "+this.state.username+" Password: "+this.state.password);
        
        var username=this.state.username;
        var password=this.state.password;

        if(username==="" || password===""){
            this.setState({
                warningBox:'Incorrect username or password.',
                warningBoxDisplay:'block',
            })
        }
        else{
            axios.post('/tryToLogin',{username,password})
            .then(res=>{
                //console.log(res);
                if(res.data[0].status===false){
                    this.setState({
                        warningBox:'Incorrect username or password.',
                        warningBoxDisplay:'block',
                    })
                }
                else{
                    if(res.data[0].redirect==="/mainPage"){
                        /* Save username to local Storage */
                        localStorage.setItem('username',this.state.username);
                        this.props.history.push('/mainPage');
                    }
                    else if(res.data[0].redirect==="/adminMainPage"){
                        /* Save username to local Storage */
                        localStorage.setItem('username',this.state.username);
                        this.props.history.push('/adminMainPage');
                    }
                }
            })
        }
        
    }
    render(){
        return(
            <div className="container text-center" style={LoginContainer}>

                <div className="container text-center" style={outerBox}>
                    <span style={span}>Login</span>
                    {/* Warning box */}
                    <div className="container text-center alert alert-danger alert-dismissible" style={Object.assign({display:this.state.warningBoxDisplay},warningBoxStyle)}>
                        <button className="close" onClick={this.closeTheBox}>&times;</button>
                        <strong>{this.state.warningBox}</strong>
                    </div>

                    {/* Email input*/}
                    <div style={dataInput} className="container text-center">
                        <input type="text" style={changeInput} className="form-control" id="emailData" onChange={this.changeUsername} value={this.state.username} placeholder="Username" autoFocus/>
                    </div>

                    {/* Password input*/}
                    <div style={dataInput} className="container text-center">
                        <input type="password" style={changeInput} onKeyPress={this.submitWithEnter} className="form-control" id="passwordData" onChange={this.changePassword}  value={this.state.password}  placeholder="Password"></input>
                    </div>

                    {/* Login Button*/}
                    <div style={LoginButCont}>
                        <button style={LoginBut} type="button" className="btn btn-dark" onClick={this.loginNow}>Login</button>
                    </div>
                    
                    {/*Sign Up reference*/}
                    <div style={newAccountDiv}>
                        <span style={newAccount}>
                            Don’t have an account?
                        </span>
                        <div>
                            <a href="/signUp" style={hrefStyle} className="hrefStyle">SIGN UP NOW</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

