import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


/* CSS Styles we used */
const signUpContainer={
    marginTop:'7%',
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
    borderRadius:'30px',
    padding:'15px',
}
const SignUpCont={
    marginTop:'5%',
    borderRadius:'30px',
}
const signUpBut={
    borderRadius:'30px',
    width:'200px'
}
const warningBoxStyle={
    marginTop:'3%',
    width:'70%',
}
const outerBox={
    paddingTop:'12%',
    paddingBottom:'12%',
    width:'60%',
    border:'2px solid gray',
    backgroundColor:'#fff',
}

const firstStyle= {
    marginTop:'-10%',
}

const soloDiv={
    marginTop:'2%',
    width:'50%',
}

//Create a new customer account.
export default class SignUpCustomer extends Component{
    constructor(props){
        super(props);
        this.state={
            warningBox:'',
            warningBoxDisplay:'none',
            firstDivDisplay:'block',
            secDivDisplay:'none',
            username:'',
            password:'',
            firstname:'',
            lastname:'',
            email:'',
            phone:'',
            country:'',
            city:'',
            address:'',
            number:'',
            zipcode:'',
        }
    }

    
    /* Hides the warning box */
    closeTheBox = ()=>{
        this.setState({
            warningBoxDisplay:'none',
        })
    }
    /* Hides the success box */
    closeSuccessBox = ()=>{
        this.setState({
            successBoxDisplay:'none',
        })
    }

    /* Continue next with sign up */
    nextWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.proceedtoNext();
        }
    }

    /* Change dynamically the data */
    changeUsername =(e)=>{
        this.setState({
            username:e.target.value,
        });
    }
    changePassword = (e)=>{
        this.setState({
            password:e.target.value,
        })
    }
    changeFirstname = (e)=>{
        this.setState({
            firstname:e.target.value,
        })
    }
    changeLastname = (e)=>{
        this.setState({
            lastname:e.target.value,
        })
    }
    changeEmail = (e)=>{
        this.setState({
            email:e.target.value,
        })
    }
    changePhone = (e)=>{
        this.setState({
            phone:e.target.value,
        })
    }
    changeCountry = (e)=>{
        this.setState({
            country:e.target.value,
        })
    }
    changeCity = (e)=>{
        this.setState({
            city:e.target.value,
        })
    }
    changeAddress = (e)=>{
        this.setState({
            address:e.target.value,
        })
    }
    changeNumber = (e)=>{
        this.setState({
            number:e.target.value,
        })
    }
    changeZipcode = (e)=>{
        this.setState({
            zipcode:e.target.value,
        })
    }

    /* Submit the form and complete the sign up */
    submitWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.submit();
        }
    }

    submit =(e)=>{
        if(this.state.country==="" || this.state.city==="" || this.state.address===""|| this.state.number==="" || this.state.zipcode===""){
            this.setState({
                warningBox:'Invalid Data.',
                warningBoxDisplay:'block',
            })
        }
        else{
            var username=this.state.username;
            var password=this.state.password;
            var firstname=this.state.firstname;
            var lastname=this.state.lastname;
            var email=this.state.email;
            var phone=this.state.phone;

            /* Create the new customer */
            axios.post('/insertNewCustomer',{username,password,firstname,lastname,email,phone})
            .then(res=>{
                
                //console.log(res);
                
                var country=this.state.country;
                var city=this.state.city;
                var address=this.state.address;
                var zipcode=this.state.zipcode;
                var number=this.state.number;

                var newID=res.data[0].newID;

                /* Create the new address */
                axios.post('/checkTheAddress',{username,country,city,address,zipcode,number,newID})
                .then(res=>{
                    //console.log("Success");
                    this.props.history.push('/');
                })
                
            })
        }
    }
    proceedtoNext = (e)=>{
        //console.log("Username: "+this.state.username+" Password: "+this.state.password+" Firstname: "+this.state.firstname+
        //" Lastname: "+this.state.lastname+" Email: "+this.state.email+" Phone: "+this.state.phone);

        if(this.state.username==="" || this.state.password===""|| this.state.firstname===""|| this.state.lastname===""|| this.state.email==="" || this.state.phone===""){
            this.setState({
                warningBox:'Invalid Data.',
                warningBoxDisplay:'block',
            })
        }
        else{

            /* Check if the username exists or not */
            var username=this.state.username;
            axios.post('/checkForUsername',{username})
            .then(res=>{
                //console.log(res);
                if(res.data[0].status===true){
                    this.setState({
                        warningBox:'Username is already taken.',
                        warningBoxDisplay:'block',
                    })
                }
                else{
                    this.setState({
                        firstDivDisplay:'none',
                        secDivDisplay:'block',
                        warningBox:'',
                        warningBoxDisplay:'none',
                    })
                    /* Focus on country input */
                    this.countryInput.focus();
                }
            })
        }
    }
    returnBack = ()=>{
        this.setState({
            firstDivDisplay:'block',
            secDivDisplay:'none',
            warningBox:'',
            warningBoxDisplay:'none',
        }) 
    }
    render(){
        return(
            <div className="container text-center" style={signUpContainer}>
               <div className="container text-center" style={outerBox}>
                    
                    <div style={Object.assign({display:this.state.firstDivDisplay},firstStyle)} className="container text-center">
                        <span style={spanStyle}>Personal Data</span>

                        {/* Warning box */}
                        <div className="container text-center alert alert-danger alert-dismissible" style={Object.assign({display:this.state.warningBoxDisplay},warningBoxStyle)}>
                            <button className="close" onClick={this.closeTheBox}>&times;</button>
                            <strong>{this.state.warningBox}</strong>
                        </div>
                        
                        {/* Get the user details */}
                        
                        {/*Username*/}
                        <div className="container text-center">
                            <div className="form-group mb-2" style={inputDiv}>
                                <input type="text" className="form-control" style={changeInput} value={this.state.username} onChange={this.changeUsername} placeholder="Username" autoFocus/>
                            </div>
                            {/*Password*/}
                            <div  className="form-group mx-sm-3 mb-2" style={inputDiv}>
                                <input type="password"  className="form-control" style={changeInput} onChange={this.changePassword} value={this.state.password} placeholder="Password"/>
                            </div>
                        </div>
                        
                        <div className="container text-center">
                             {/*Firstname*/}
                            <div className="form-group mb-2" style={inputDiv}>
                                <input type="text" style={changeInput}  className="form-control" onChange={this.changeFirstname} value={this.state.firstname}  placeholder="Firstname" />
                            </div>
                            {/*Lastname*/}
                            <div  className="form-group mx-sm-3 mb-2" style={inputDiv}>
                                <input type="text" style={changeInput} className="form-control"  onChange={this.changeLastname} value={this.state.lastname} placeholder="Lastname"/>
                            </div>
                        </div>
                    
                        
                        <div className="container text-center" style={soloDiv}>
                            <input type="email"   style={changeInput} className="form-control" onChange={this.changeEmail} value={this.state.email}  placeholder="E-mail"/>
                        </div>
                        
                        <div className="container text-center" style={soloDiv}>
                            <input type="tel" style={changeInput}  className="form-control" onKeyPress={this.nextWithEnter}  onChange={this.changePhone} value={this.state.phone}  placeholder="Phone"/>
                        </div>
                    
                        <div style={SignUpCont}>
                            <button style={signUpBut} type="button" onClick={this.proceedtoNext} className="btn btn-primary">Next</button>
                        </div>
                        
                    </div>

                    {/* Get the address details*/}
                    <div style={Object.assign({display:this.state.secDivDisplay},firstStyle)}>
                        <span style={spanStyle}>Address</span>
                        {/* Warning box */}
                        <div className="container text-center alert alert-danger alert-dismissible" style={Object.assign({display:this.state.warningBoxDisplay},warningBoxStyle)}>
                            <button className="close" onClick={this.closeTheBox}>&times;</button>
                            <strong>{this.state.warningBox}</strong>
                        </div>
                        <div className="container text-center" style={soloDiv}>
                            <input type="text" style={changeInput} ref={(input) => { this.countryInput = input; }}  className="form-control" onChange={this.changeCountry} value={this.state.country} placeholder="Country" autoFocus/>
                        </div>
                        <div className="container text-center" style={soloDiv}>
                            <input type="text" style={changeInput} className="form-control" onChange={this.changeCity} value={this.state.city} placeholder="City"></input>
                        </div>
                        <div className="container text-center" style={soloDiv}>
                            <input type="text" style={changeInput} className="form-control" onChange={this.changeAddress} value={this.state.address} placeholder="Address"></input>
                        </div>
                        <div className="container text-center" style={soloDiv}>
                            <input type="text" style={changeInput} className="form-control" onChange={this.changeNumber} value={this.state.number} placeholder="Number"></input>
                        </div>
                        <div className="container text-center" style={soloDiv}>
                            <input type="text" style={changeInput} className="form-control" onKeyPress={this.submitWithEnter} onChange={this.changeZipcode} value={this.state.zipcode} placeholder="Zipcode"></input>
                        </div>
                        <div className="container text-center"> 
                            <div className="form-group mb-2" style={inputDiv}>
                                <button style={signUpBut} type="button" className="btn btn-danger" onClick={this.returnBack} >Back</button>
                            </div>
                            <div  className="form-group mx-sm-3 mb-2" style={inputDiv}>
                                <button style={signUpBut} type="button" className="btn btn-dark" onClick={this.submit}>SignUp</button>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
        );
    }
}

