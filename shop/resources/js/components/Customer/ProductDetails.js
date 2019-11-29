import React,{Component} from 'react';
import './css/App.css';
import NavBar from './Navbar';
import QuantityCounter from './QuantityCounter';
import axios from 'axios';

/* Fixes the image */
function hexToBase64(str) {
    var bString = "";
    for( var i = 0; i < str.length; i +=2) {
         bString += String.fromCharCode( parseInt( str.substr( i, 2), 16));
    }
    return btoa(bString);
}
const perDiv = {
    display:'block',
    verticalAlign:'middle',
    marginTop:'1%',
}

const supplier_name={
    marginTop:'-2%',
}
const imgStyle={
    width: '400px',
    height: 'auto',
}

const grid ={
    background:'#fff',
    border:'1px solid black',
    height:'auto',
    overflow:'auto',
}

const detailsContainer={
    marginTop:'2%',
    marginBottom:'2%',
}

const bottomContainer={
    marginTop:'5%',
}

//Show the product details.
//The customer can order the current product.
class ProductDetails extends Component{

    constructor(props){
        super(props);
        this.state={
            username:'',
            selectedProductName:'',
            productsInCart:null,
            productItem:[],
            product_id:0,
            imgSrc:'',
            paymentMethod:'Credit Card',
            quantity:1,
            comments:'',
        }
    }
    componentWillMount(){

        /* Get the username */
        this.setState({
            username:localStorage.getItem('username'), 
        },()=>{
            if(this.state.username === null){
                this.props.history.push('/');
            }

             /* Get the number of orders */
             var username=this.state.username;
             axios.post('/numberOfOrders',{username})
             .then(res=>{
                 //console.log(res);
                 this.setState({
                     productsInCart:res.data,
                 })
             })
        })

        /* Get product name */
        this.setState({
            selectedProductName:localStorage.getItem('selectedProduct'), 
        },()=>{
            if(this.state.selectedProductName === null){
                this.props.history.push('/mainPage');
            }
            /* Set title */
            document.title=this.state.selectedProductName;
        })

        /* Get product id */
        var fullURL = (window.location.href).split("/");
        var prod_id= fullURL[fullURL.length-1];
        
        this.setState({
            product_id:prod_id,
        })


        /* Retrieve the product details */
        axios.post('/getProductDetails',{prod_id})
        .then(res=>{
            this.setState({
                productItem:res.data[0],
                imgSrc:res.data[0].product_img.substring(2),
            });
        })
    }   
   
    makeOrder = ()=>{

        var product_id=this.state.product_id;
        var quantity=this.state.quantity;
        var paymentMethod=this.state.paymentMethod;
        var comments= this.state.comments;
        var username=this.state.username;

        axios.post('/makeOrder',{product_id,quantity,paymentMethod,comments,username})
        .then(res=>{
            this.props.history.push('/mainPage');
        })
    }
    increase = (e)=>{
        this.setState({
            quantity:this.state.quantity+1,
        })
    }
    decrease = (e)=>{
        if(this.state.quantity>1){
            this.setState({
                quantity:this.state.quantity-1,
            }) 
        }
    }

    changeComments = (e)=>{
        this.setState({
            comments:e.target.value,
        })
    }
    changeLabel = (e)=>{
        this.setState({
            paymentMethod:e.target.id,
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
    render(){
        return(
            <div>
                <NavBar 
                    username={this.state.username}
                    logout={this.logout}
                    deleteAccount={this.deleteAccount}
                    productsInCart={this.state.productsInCart}
                />
                <div className="container" style={{marginTop:'8%'}}> 
                    <div className="row">
                        <div className="col-sm" style={grid}>
                            <div className="text-center">
                                <img style={imgStyle} src={"data:image/jpeg;base64,"+hexToBase64(this.state.imgSrc)} />
                            </div>
                        </div>
                   
                        <div className="col-sm" style={grid}>

                            <div className="text-center">
                                <div  style={perDiv} >
                                    <h2>{this.state.productItem.product_name}</h2>
                                </div>
                                <div  style={perDiv} >
                                    <h5 style={supplier_name}>{this.state.productItem.fk1_supplier_name}</h5>
                                </div>
                            </div>

                            <div className="container text-center" style={{marginTop:'7%'}}>

                                <div className="row justify-content-md-center">
                                    <div className="col-sm-4">
                                        Price:
                                    </div>
                                    <div className="col-sm-4">
                                        {this.state.productItem.product_price} $
                                    </div>
                                </div>
                                <div className="row justify-content-md-center">
                                    <div className="col-sm-4" style={{marginTop:'1%'}}>
                                        Quantity:
                                    </div>   
                                    <QuantityCounter
                                        increase={this.increase}
                                        decrease={this.decrease}
                                        quantity={this.state.quantity}
                                    />
                                </div>
                            </div>

                            <div className="dropdown text-center" style={{marginTop:'2%'}}>
                                <button style={{width:'150px'}} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {this.state.paymentMethod}
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" href="javascript:void(0);" id="Credit Card" onClick={this.changeLabel}>Credit Card</a>
                                    <a className="dropdown-item" href="javascript:void(0);" id="Paypal"  onClick={this.changeLabel} >Paypal</a>
                                    <a className="dropdown-item" href="javascript:void(0);" id="Paysafe" onClick={this.changeLabel} >Paysafe</a>
                                    <a className="dropdown-item" href="javascript:void(0);" id="Cash"  onClick={this.changeLabel}>Cash</a>
                                </div>
                            </div>

                            <div className="container text-center" style={bottomContainer}>
                                <div className="row justify-content-md-center">
                                    <button type="button" className="btn btn-success" onClick={this.makeOrder}>Add To Cart</button>
                                </div>

                                <div className="form-group" style={{marginTop:'2%'}}>
                                    <textarea className="form-control" placeholder="Comments" value={this.state.comments} onChange={this.changeComments} style={{resize: 'none'}}rows="3"></textarea>
                                </div>

                                <div className="row justify-content-md-center" style={detailsContainer}>
                                    <div className="card">
                                        <div className="card-body text-center">
                                            <h5 className="card-title">Details</h5>
                                            <p className="card-text">{this.state.productItem.product_desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ProductDetails;
