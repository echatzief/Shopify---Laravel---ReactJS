import React,{Component} from 'react';

const productStyle = {
    color:'#fff',
    backgroundColor:'#565656',
    marginLeft:'1%',
}

const perDiv = {
    display:'block',
    verticalAlign:'middle',
    marginTop:'1%',
    cursor:'pointer',
}

const imgStyle={
    width: '200px',
    height: 'auto',
}

//Component for each product.
export default class Product extends Component{
    constructor(props){
        super(props);
    }

    render(){
        var data=this.props.id+":"+this.props.product_name;
        return(
            <div className="col-sm" style={productStyle}>
                <div style={perDiv}>
                    <span className="product" id={data} onClick={this.props.showProduct}>{this.props.product_name}</span>
                </div>
                <div style={perDiv} >
                    <img  style={imgStyle} id={data} src={this.props.src} onClick={this.props.showProduct} />
                </div>
                <div style={perDiv}>
                    {this.props.price} $
                </div>
            </div>
        );
    }
}