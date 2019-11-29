import React,{Component} from 'react';
import NavBar from './Navbar';
import Product from './Product';
import axios from 'axios';

/* Fixes the image */
function hexToBase64(str) {
    var bString = "";
    for( var i = 0; i < str.length; i +=2) {
         bString += String.fromCharCode( parseInt( str.substr( i, 2), 16));
    }
    return btoa(bString);
}

//Shows the searched product.
class Search extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            productsInCart:null,
            renderedProducts:[],
            allProducts:[],
            pageButtons:[],
            allProductsCount:0,
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

        /* Get product name */
        var fullURL = (window.location.href).split("/");
        var searchText= fullURL[fullURL.length-1];
        
        axios.post('/searchProduct',{searchText})
        .then(res=>{
            //console.log(res);
            this.setState({
                allProducts:res.data[0].data,
                allProductsCount:res.data[0].count,
            })

            if(res.data[0].count!==0){
                /* Insert the first 6 elements to the first page */
                var tempArray= new Array();
                var tripleArray=new Array();

                var howMuchGroups= Math.floor(this.state.allProductsCount/6);
                var modGroup = this.state.allProductsCount % 6;

                if(howMuchGroups == 0  ){
                    for(var i=0;i<modGroup;i++){
                        if(i==3){
                            tempArray.push(tripleArray);
                            tripleArray=new Array();
                        }
                        tripleArray.push(this.state.allProducts[i]);
                    }
                    tempArray.push(tripleArray);
                }
                else{
                    for(var i=0;i<=6;i++){
                        if(i==6){
                            tempArray.push(tripleArray);
                            break;
                        }
                        if(i==3){
                            tempArray.push(tripleArray);
                            tripleArray=new Array();
                        }
                        tripleArray.push(this.state.allProducts[i]);
                    }
                }

                this.setState({
                    renderedProducts:tempArray,
                })

                /* Calculate the number of pages */
                var howMuchPage=Math.ceil(this.state.allProductsCount/6);
                //console.log("Num of butts: "+howMuchPage);
                
                if(howMuchPage > 1){
                    var tempArray= new Array();
                    for(var i=0;i<howMuchPage;i++){
                        tempArray.push(i+1);
                    }
        
                    this.setState({
                        pageButtons:tempArray,
                    })
                }
            }
        })
    }
    showProduct = (e)=>{
        var targetData = (e.target.id).split(":");
        var product_id=targetData[0].trim();
        var product_name=targetData[1].trim();

        this.props.history.push('/item/'+product_id);
        localStorage.setItem('selectedProduct',product_name);
    }
    showCart = ()=>{
        this.props.history.push('/orders');
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
    details = () =>{
        this.props.history.push('/details');
    }

    renderThePage =(item)=>{
        const marginStyle={
            marginTop:'5%',
            marginBottom:'3%',
        }
        if(item.length===1){
            const imgFirst=item[0].product_img.substring(2);
            return(
                <div key={item[0].product_id} className="row text-center" style={marginStyle}>
                    <Product 
                        product_name={item[0].product_name}
                        src={"data:image/jpeg;base64,"+hexToBase64(imgFirst)}
                        price={item[0].product_price}
                        id={item[0].product_id}
                        showProduct={this.showProduct}
                    />
                    <div className="col-sm" style={{marginLeft:'1%'}}>
                        
                    </div>
                    <div className="col-sm" style={{marginLeft:'1%'}}>
                        
                    </div>
                </div>
            );
        }
        else if(item.length===2){
            const imgFirst=item[0].product_img.substring(2);
            const imgSec=item[1].product_img.substring(2);
            return(
                <div key={item[0].product_id} className="row text-center" style={marginStyle}>
                     <Product 
                        product_name={item[0].product_name}
                        src={"data:image/jpeg;base64,"+hexToBase64(imgFirst)}
                        price={item[0].product_price}
                        id={item[0].product_id}
                        showProduct={this.showProduct}
                    />
                    <Product 
                        product_name={item[1].product_name}
                        src={"data:image/jpeg;base64,"+hexToBase64(imgSec)}
                        price={item[1].product_price}
                        id={item[1].product_id}
                        showProduct={this.showProduct}
                    />
                    <div className="col-sm" style={{marginLeft:'1%'}}>
                        
                    </div>
                </div>
            )
        }
        else{
            const imgFirst=item[0].product_img.substring(2);
            const imgSec=item[1].product_img.substring(2);
            const imgThird=item[2].product_img.substring(2);

            return(
                <div key={item[0].product_id} className="row text-center" style={marginStyle}>
                    <Product 
                        product_name={item[0].product_name}
                        src={"data:image/jpeg;base64,"+hexToBase64(imgFirst)}
                        price={item[0].product_price}
                        id={item[0].product_id}
                        showProduct={this.showProduct}
                    />
                    <Product 
                        product_name={item[1].product_name}
                        src={"data:image/jpeg;base64,"+hexToBase64(imgSec)}
                        price={item[1].product_price}
                        id={item[1].product_id}
                        showProduct={this.showProduct}
                    />
                    <Product 
                        product_name={item[2].product_name}
                        src={"data:image/jpeg;base64,"+hexToBase64(imgThird)}
                        price={item[2].product_price}
                        id={item[2].product_id}
                        showProduct={this.showProduct}
                    />
                </div>
            )
        }
    }
    changePage = (e)=>{

        var numPage=e.target.id;

        var howMuchGroups= Math.floor(this.state.allProductsCount/6);
        var tempArray= new Array();
            var tripleArray=new Array();

        if(numPage==howMuchGroups + 1 ){
            for(var i=(numPage-1)*6;i<this.state.allProductsCount;i++){
                if(i%3==0 && i!= (numPage-1)*6 ){
                    tempArray.push(tripleArray);
                    tripleArray=new Array();
                }
                tripleArray.push(this.state.allProducts[i]);
            }
            tempArray.push(tripleArray);
        }
        else{
            for(var i=(numPage-1)*6;i<=(numPage-1)*6+6;i++){
                if(i%6==0 && i!= (numPage-1)*6 ){
                    tempArray.push(tripleArray);
                    break;
                }
                if(i%3==0 && i!= (numPage-1)*6 ){
                    tempArray.push(tripleArray);
                    tripleArray=new Array();
                }
                tripleArray.push(this.state.allProducts[i]);
            }
        }
        this.setState({
            renderedProducts:tempArray,
        })
        //console.log(this.state.renderedProducts)
    }
    renderTheButtons = (item)=>{
        const marginStyle={
            marginLeft:'1%',
        }
        return(
            <button key={item} type="button" id={item} style={marginStyle} className="btn btn-light" onClick={this.changePage}>{item}</button>
        )
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

                <div className="container">
                    {this.state.renderedProducts.map((item)=>this.renderThePage(item))}    
                </div>
                {/* Button Division */}
                <div className="container text-center">
                    {this.state.pageButtons.map((item)=>this.renderTheButtons(item))}
                </div>
            </div>            
        );
    }
}

export default Search;