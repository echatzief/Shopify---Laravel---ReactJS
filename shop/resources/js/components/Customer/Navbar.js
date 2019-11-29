import React,{Component} from 'react';
import Logo from './img/Logo.png'
import cart from './img/cart.svg';
import './css/App.css';
import axios from 'axios';

const hrefBorder={
    border:'1px solid  #D42A2B',
}
const linkStyleDiv={
    marginLeft:'50px',
}
const inputDiv={   
    width:'600px',
}
const cursorFix={
    cursor:'pointer',
}
const numStyle={
    color:'#fff',
    marginLeft:'2%',
    cursor:'pointer',
}
const lastDiv={
    marginRight:'5%',
}

//Reusable navbar component. 
export default class Navbar extends Component{
    constructor(props){
        super(props);
        this.state={
            inputText:'',
        }
    }

    changeInput = (e)=>{
        this.setState({
            inputText:e.target.value,
        })
    }
    searchWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.redirect();
        }
    }
    redirect = ()=>{
        window.location.href='/search/'+this.state.inputText;
    }
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex">
                <a href="/mainPage" style={hrefBorder}><img src={Logo} width="50" height="50"/></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">              
                    <div className="mr-auto p-2" style={linkStyleDiv} >
                        <a href={"/mainPage"} >Products</a>
                    </div>
                    
                    <div className="mr-auto p-2 form-inline">
                        <input className="form-control mr-sm-2" type="search" style={inputDiv} onKeyPress={this.searchWithEnter} value={this.state.inputText} onChange={this.changeInput}  placeholder="Search" aria-label="Search" autoFocus></input>
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.redirect}>Search</button>
                    </div>
                    
                    <div className="p-2">
                        <div className="container">
                            <div className="row">
                                <div className="col-4">
                                    <a href="/orders" ><img style={cursorFix} src={cart} width="30" height="30"/></a>
                                </div>
                                <div className="col-4">
                                    <a  href="/orders"><span style={numStyle}>{this.props.productsInCart}</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-2" style={lastDiv}>
                        <div className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Account
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="/details">Details</a>
                                <a className="dropdown-item" href="javascript:void(0);" data-toggle="modal" data-target="#deleteAccount" >Delete</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="javascript:void(0);" onClick={this.props.logout}>Logout</a>
                            </div>
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
            </nav>
        );
    }
}