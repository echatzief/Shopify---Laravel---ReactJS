import React,{Component} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import $ from 'jquery';

const containerStyle={
    width:'45%',
    marginTop:'8%',
    background:'#fff',
    paddingBottom:'2%',
    paddingTop:'2%',
}
const changeInput={
    marginTop:'2%',
    marginBottom:'2%',
}
const itemStyle={
    width:'300px',
}
const textAreaStyle = {
    width:'300px',
    resize:'none'
}
const fileDivStyle={
    marginTop:'2%',
    marginBottom:'2%',
    width:'300px',
}
const warningBoxStyle={
    marginTop:'3%',
    width:'70%',
}

// Convert the image from base64 type to hex
function base64toHEX(base64) {

    var raw = atob(base64);
  
    var HEX = '';
    var i;
    for ( i = 0; i < raw.length; i++ ) {
  
      var _hex = raw.charCodeAt(i).toString(16)
      HEX += (_hex.length==2?_hex:'0'+_hex);
  
    }
    return HEX;
}

// Admin insert a new product.
// Completes a form with the essential product fields.
class AddProduct extends Component{

    constructor(props){
        super(props);
        this.state={
            warningBox:'',
            warningBoxDisplay:'none',
            modalDisplay:'none',
            username:'',
            productName:'',
            price:'',
            supplier:'',
            supplierPhone:'',
            description:'',
            image:'',
            imageLabel:'Choose file',
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

    changeProductName = (e)=>{
        this.setState({
            productName:e.target.value,
        })
    }
    changePrice = (e)=>{
        this.setState({
            price:e.target.value,
        })
    }
    changeSupplier = (e)=>{
        this.setState({
            supplier:e.target.value,
        }) 
    }
    changeDescription = (e)=>{
        this.setState({
            description:e.target.value,
        })
    }
    changeImage = (e)=>{
        var getFileReader =document.getElementById("imageFile").files[0];
        var r = new FileReader();
        r.onload = ()=>{ 
            //console.log(r.result);
            var splitData = r.result.split(",");
            var tempData='\\x'+base64toHEX(splitData[1]);
            //console.log(tempData);
            this.setState({
                image:tempData,
                imageLabel:getFileReader.name,
            })
        };
        r.readAsDataURL(getFileReader);
    }
    changePhone = (e)=>{
        this.setState({
            supplierPhone:e.target.value,
        })
    }

    createSupplierAndProduct = ()=>{
        var productName=this.state.productName;
        var price = this.state.price;
        var supplier = this.state.supplier;
        var description = this.state.description;
        var image =this.state.image;
        var imageLabel = this.state.imageLabel;
        var supplierPhone=this.state.supplierPhone

        axios.post('/createSupplier',{supplier,supplierPhone})
        .then(res=>{

            //console.log(res);
            //console.log("New Supplier Created.");
            axios.post('/createProduct',{productName,price,supplier,description,image,imageLabel})
            .then(res=>{
                //console.log(res);
                //console.log("New Product Created.");
                this.props.history.push('/addProduct');
            })
        })
    }

    addProduct = ()=>{
        var productName=this.state.productName;
        var price = this.state.price;
        var supplier = this.state.supplier;
        var description = this.state.description;
        var image =this.state.image;
        var imageLabel = this.state.imageLabel;

        if(productName!=='' && price!=='' && supplier!=='' && description!=='' && image!=='' && imageLabel!=='Choose file'){
            /* Check if the product exists */
            axios.post('/checkIfProductExists',{productName})
            .then(res=>{
                //console.log(res);

                if(res.data[0].status===false){
                    /* Check if the supplier exists */
                    axios.post('/checkIfSupplierExists',{supplier})
                    .then(res=>{
                        /* Create the supplier */
                        if(res.data[0].status===false){
                            $('#supplier').modal('show');
                        }
                        else{
                            axios.post('/createProduct',{productName,price,supplier,description,image,imageLabel})
                            .then(res=>{
                                //console.log(res);
                                //console.log("New Product Created.");
                                this.props.history.push('/addProduct');
                            })
                        }
                    })
                }
                else{
                    this.setState({
                        warningBox:'The product already exists.',
                        warningBoxDisplay:'block',
                    })
                }
            })
        }
        else{
            this.setState({
                warningBox:'Invalid Data.',
                warningBoxDisplay:'block',
            })
        }
    }

    closeModal = ()=>{
        this.setState({
            modalDisplay:'none',
        })
    }

    closeTheBox = ()=>{
        this.setState({
            warningBoxDisplay:'none',
        })
    }

    render(){
        return(
            <div>
                <Navbar
                    logout={this.logout}
                    deleteAccount={this.deleteAccount}
                />
                <div className="container text-center" style={containerStyle} >
                    <div className="row justify-content-md-center" style={changeInput}>
                        <h3>New Product</h3>
                    </div>
                    {/* Warning box */}
                    <div className="container text-center alert alert-danger alert-dismissible" style={Object.assign({display:this.state.warningBoxDisplay},warningBoxStyle)}>
                        <button className="close" onClick={this.closeTheBox}>&times;</button>
                        <strong>{this.state.warningBox}</strong>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <input style={itemStyle} type="text" className="form-control" onChange={this.changeProductName} value={this.state.productName} placeholder="Product Name"/>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <input style={itemStyle} type="text" className="form-control" onChange={this.changePrice} value={this.state.price} placeholder="Price"/>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <input style={itemStyle} type="text" className="form-control" onChange={this.changeSupplier} value={this.state.supplier} placeholder="Supplier"/>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <textarea  style={textAreaStyle} className="form-control" placeholder="Add Product Description..." value={this.state.description} onChange={this.changeDescription} rows="3"></textarea>
                    </div>

                    <div className="custom-file" style={fileDivStyle}>
                        <input  type="file"  className="custom-file-input" id="imageFile" onChange={this.changeImage} accept=".jpeg,.jpg"/>
                        <label className="custom-file-label" >{this.state.imageLabel}</label>
                    </div>

                    <div className="row justify-content-md-center"  style={changeInput}>
                        <button style={itemStyle} type="button" className="btn btn-success" onClick={this.addProduct}>Next</button>
                    </div>

                    <div className="modal fade" id="supplier" tabIndex="-1" role="dialog" aria-labelledby="supplier" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="supplier">Create Supplier</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <input  type="text" className="form-control" onChange={this.changePhone} value={this.state.supplierPhone} placeholder="Phone"/>
                                </div>
                                <div className="modal-footer justify-content-md-center">
                                    <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-success" onClick={this.createSupplierAndProduct}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default AddProduct;
