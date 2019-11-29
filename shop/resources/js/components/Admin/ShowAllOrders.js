import React,{Component} from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const imgStyle={
    width: '200px',
    height: 'auto',
}
const productDiv={
    height:'300px',
    marginTop:'1%',
    paddingBottom:'1%',
    paddingTop:'1%',
    background:'#fff',
    border:'1px solid black',
}
const element={
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
}

/* Fixes the image */
function hexToBase64(str) {
    var bString = "";
    for( var i = 0; i < str.length; i +=2) {
         bString += String.fromCharCode( parseInt( str.substr( i, 2), 16));
    }
    return btoa(bString);
}

//Admin can inspect the existing orders 
//and can alter the status of an order.
class ShowAllOrders extends Component{

    constructor(props){
        super(props);
        this.state={
            username:'',
            allOrders:[],
            remainingOrders:0,
            order_id:0,
            newStatus:'',
        }
        this.limit=4;
        this.pagesAsked=0;
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

        /* Get all orders */
        axios.get('/numberOfAllOrders')
        .then(res=>{
            //console.log(res);
            this.setState({
                remainingOrders:res.data[0].count,
            },()=>{
                
                /* We get the first page of all orders */
                var limit =this.limit;
                var numOfPages = this.pagesAsked;
                this.pagesAsked=this.pagesAsked+1;
                axios.post('/getSomeFromAllOrders',{limit,numOfPages})
                .then(res=>{
                    //console.log(res);
                    var tempArray = new Array();
                    for(var i=0;i<res.data.length;i++){
                        tempArray.push(res.data[i]);
                    }

                    this.setState({
                        allOrders:tempArray,
                        remainingOrders:this.state.remainingOrders-this.limit,
                    })
                })
            })
        })

        window.onscroll = () => {
            //console.log("Window is moving");
            //console.log("innerHeight: "+window.innerHeight +"Document: "+ document.documentElement.scrollTop+" Offset: "+document.documentElement.offsetHeight);
            //console.log("Sub: "+ (window.innerHeight + document.documentElement.scrollTop - document.documentElement.offsetHeight));
            if ((window.innerHeight + document.documentElement.scrollTop - document.documentElement.offsetHeight) >=-1 && (window.innerHeight + document.documentElement.scrollTop - document.documentElement.offsetHeight) <=1 ){
                var limit =this.limit;
                var numOfPages = this.pagesAsked;

                //console.log("Div Reached Bottom");
                //console.log("Page: "+numOfPages);
                //console.log("Count: "+this.state.remainingOrders);

                if( this.state.remainingOrders>0){
                    this.pagesAsked=this.pagesAsked+1;
                    axios.post('/getSomeFromAllOrders',{limit,numOfPages})
                    .then(res=>{
                        //console.log("Fetch more orders!");
                        //console.log(res);

                        var tempArray = new Array();
                        for(var i=0;i<this.state.allOrders.length;i++){
                            tempArray.push(this.state.allOrders[i]);
                        }

                        for(var i=0;i<res.data.length;i++){
                            tempArray.push(res.data[i]);
                        }

                        this.setState({
                            allOrders:tempArray,
                            remainingOrders:this.state.remainingOrders-this.limit,
                        })
                        this.forceUpdate();
                    })
                }
            }

        }
    }
    renderOrders = (item)=>{
        var imgSrc=item.product_img.substring(2);
        return(
            <div className="row" key={item.order_id} style={productDiv}>
                <div className="col-sm container" >
                    <div style={element}>
                        <img style={imgStyle} src={"data:image/jpeg;base64,"+hexToBase64(imgSrc)}/>
                    </div>
                </div>
                <div className="col-sm justify-content-md-center">
                    <div style={element}>
                        <div className="row justify-content-md-center">
                            <h5>Customer: {item.customer_fname.trim()} {item.customer_lname.trim()}</h5>
                        </div>
                        <div className="row justify-content-md-center">
                            <h5>{item.product_name.trim()}</h5>
                        </div>
                        <div className="row justify-content-md-center">
                            <span style={{marginRight:'5%'}}>
                                Price: {item.product_price.trim()} $ 
                            </span>
                            <span>
                                Quantity: {item.product_quantity_per_product.trim()}
                            </span>
                        </div>
                        <div className="row justify-content-md-center">
                            <span style={{marginRight:'5%',marginTop:'2%'}}>
                                {item.status.trim()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-sm">
                    <div className="row justify-content-md-center">
                        <button type="button" style={element} className="btn btn-info" id={item.order_id}  data-toggle="modal" data-target="#editStatus" onClick={this.changeOrderID}>Edit Status</button>
                    </div>
                </div>
            </div>
        )
    }

    changeOrderID = (e)=>{
        this.setState({
            order_id:e.target.id,
        })
    }
    changeNewStatus = (e)=>{
        this.setState({
            newStatus:e.target.value,
        })
    }
    editStatus = (e)=>{
        var order_id=this.state.order_id;
        var newStatus=this.state.newStatus;

        axios.post('/editStatus',{order_id,newStatus})
        .then(res=>{
            this.props.history.push('/showAllOrders');
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
                <div id="orders" className="container"  onScrollCapture={this.checkToFetch}>
                    {this.state.allOrders.map((item)=>this.renderOrders(item))}
                </div>
                <div className="modal fade" id="editStatus" tabIndex="-1" role="dialog" aria-labelledby="editStatus" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editStatus">Edit Status</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <span>Enter New Status</span>
                                <input type="text" value={this.state.newStatus} onChange={this.changeNewStatus} className="form-control"/>
                            </div>
                            <div className="modal-footer justify-content-md-center">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-success" onClick={this.editStatus}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ShowAllOrders;