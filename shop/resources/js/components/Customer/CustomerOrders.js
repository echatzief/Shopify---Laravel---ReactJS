import React,{Component} from 'react';
import NavBar from './Navbar';
import $ from 'jquery';

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
const totalCostDiv={
    marginTop:'1%',
    background:'#fff',
    border:'1px solid black',
}

/* Fixes the image */
function hexToBase64(str) {
    var bString = "";
    for( var i = 0; i < str.length; i +=2) {
         bString += String.fromCharCode( parseInt( str.substr( i, 2), 16));
    }
    return btoa(bString);
}

//Shows the customer's orders.
class CustomerOrders extends Component{
    
    constructor(props){
        super(props);
        this.state={
            username:null,
            productsInCart:null,
            allOrders:[],
            remainingOrders:0,
            totalCost:null,
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

            /* Get the number of orders */
            var username=this.state.username;
            axios.post('/numberOfOrders',{username})
            .then(res=>{
                //console.log(res);
                this.setState({
                    productsInCart:res.data,
                    remainingOrders:res.data,
                },()=>{
                    
                    var username=this.state.username;
                    axios.post('/getTotalCost',{username})
                    .then(res=>{
                        //console.log(res);
                        this.setState({
                            totalCost:res.data,
                        })
                    })

                    /* Fetch some orders */
                    var username=this.state.username;
                    var limit =this.limit;
                    var numOfPages = this.pagesAsked;
                    this.pagesAsked=this.pagesAsked+1;
                    axios.post('/getSomeOrders',{username,limit,numOfPages})
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
        })
        
        window.onscroll = () => {
            //console.log("Window is moving");
            //console.log("innerHeight: "+window.innerHeight +"Document: "+ document.documentElement.scrollTop+" Offset: "+document.documentElement.offsetHeight);
            //console.log("Sub: "+ (window.innerHeight + document.documentElement.scrollTop - document.documentElement.offsetHeight));
            if ((window.innerHeight + document.documentElement.scrollTop - document.documentElement.offsetHeight) >=-1 && (window.innerHeight + document.documentElement.scrollTop - document.documentElement.offsetHeight) <=1 ){
                var username=this.state.username;
                var limit =this.limit;
                var numOfPages = this.pagesAsked;

                //console.log("Div Reached Bottom");
                //console.log("Page: "+numOfPages);
                //console.log("Count: "+this.state.remainingOrders);

                if( this.state.remainingOrders>0){
                    this.pagesAsked=this.pagesAsked+1;
                    axios.post('/getSomeOrders',{username,limit,numOfPages})
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
    removeOrder = (e)=>{
        var order_id=e.target.id;

        axios.post('/removeOrder',{order_id})
        .then(res=>{
            this.props.history.push('/orders');
        })
    }
    logout = ()=>{
        localStorage.clear();
        this.props.history.push('/');
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
                            <h2>{item.product_name.trim()}</h2>
                        </div>
                        <div className="row justify-content-md-center">
                            <h5>{item.fk1_supplier_name.trim()}</h5>
                        </div>
                        <div className="row justify-content-md-center">
                            <span style={{marginRight:'5%'}}>
                                Price: {item.product_price.trim()} $ 
                            </span>
                            <span>
                                Quantity: {item.product_quantity_per_product.trim()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-sm">
                    <div className="row justify-content-md-center">
                        <button type="button" style={element} className="btn btn-danger" id={item.order_id} onClick={this.removeOrder}>Cancel</button>
                    </div>
                </div>
            </div>
        )
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
                <div className="container text-center" style={totalCostDiv} onScrollCapture={this.checkToFetch}>
                    Total cost: {this.state.totalCost} $
                </div>
                <div id="orders" className="container"  onScrollCapture={this.checkToFetch}>
                    {this.state.allOrders.map((item)=>this.renderOrders(item))}
                </div>
            </div>
        );
    }
}

export default CustomerOrders;