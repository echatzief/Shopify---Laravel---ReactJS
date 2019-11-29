import React,{Component} from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const ulStyle={
    height:'auto',
    maxHeight:'200px',
    width:'230px',
    overflowX:'hidden',
}
const containerStyle={
    width:'45%',
    marginTop:'10%',
    background:'#fff',
    paddingBottom:'2%',
    paddingTop:'2%',
    border:'1px solid black',
}
const changeInput={
    marginTop:'2%',
    marginBottom:'2%',
    borderRadius:'30px',
}

//Admin chooses to delete an existing field from the selected table.
class DeleteFieldFromTable extends Component{

    constructor(props){
        super(props);
        this.state={
            username:'',
            firstPartDisplay:'block',
            secPartDisplay:'none',
            chosenTable:'Choose Table',
            chosenField:'Choose field',
            fields:[],
            tables:[]
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

        axios.get('/getTables')
        .then(res=>{
            //console.log(res);
            this.setState({
                tables:res.data,
            })
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

    swapTable = (e)=>{
        this.setState({
            chosenTable:e.target.id,
        })
    }

    swapField = (e)=>{
        this.setState({
            chosenField:e.target.id,
        })
    }
    renderTables = (item)=>{
        return(
            <li key={item.table_name.trim()}><a href="javascript:void(0)" id={item.table_name.trim()} onClick={this.swapTable}>{item.table_name.trim()}</a></li>
        )
    }

    renderFields = (item)=>{
        return(
            <li key={item.column_name.trim()}><a href="javascript:void(0)" id={item.column_name.trim()} onClick={this.swapField}>{item.column_name.trim()}</a></li>
        )
    }

    proccedToNext = ()=>{
        var table = this.state.chosenTable;
        if(table!=='Choose Table'){
            axios.post('/getFieldsFromTable',{table})
            .then(res=>{
                //console.log(res);
                this.setState({
                    fields:res.data,
                    firstPartDisplay:'none',
                    secPartDisplay:'block',
                })
            })
        }
    }
    
    deleteField = ()=>{
        var table = this.state.chosenTable;
        var field = this.state.chosenField;
        
        if(table!=='Choose Table' && field!=='Choose field'){
            axios.post('/deleteFields',{table,field})
            .then(res=>{
                this.props.history.push('/deleteFieldFromTable');
            })
        }
    }
    goBack = ()=>{
        this.setState({
            firstPartDisplay:'block',
            secPartDisplay:'none',
        })
    }
    render(){
        return(
            <div>
                <Navbar
                    logout={this.logout}
                    deleteAccount={this.deleteAccount}
                />
                <div className="container text-center" style={containerStyle}>
                    <div className="row justify-content-md-center" style={changeInput}>
                        <h3>Delete field to table</h3>
                    </div>

                    <div style={{display:this.state.firstPartDisplay}}>
                        <div className="row justify-content-md-center"  style={changeInput}>
                            <div className="btn-group">
                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" style={{width:'230px'}}>{this.state.chosenTable}<span className="caret"></span></button>
                                <ul className="dropdown-menu scrollable-menu" style={ulStyle} role="menu">
                                    {this.state.tables.map((item)=>this.renderTables(item))}
                                </ul>
                            </div>
                        </div>
                        <div className="row justify-content-md-center"  style={changeInput}>
                            <button type="button" className="btn btn-success" onClick={this.proccedToNext}>Next</button>
                        </div>
                    </div>

                    <div style={{display:this.state.secPartDisplay}}>
                        <div className="row justify-content-md-center"  style={changeInput}>
                            <div className="btn-group">
                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" style={{width:'230px'}}>{this.state.chosenField}<span className="caret"></span></button>
                                <ul className="dropdown-menu scrollable-menu" style={ulStyle} role="menu">
                                    {this.state.fields.map((item)=>this.renderFields(item))}
                                </ul>
                            </div>
                        </div>
                        <div className="row justify-content-md-center"  style={changeInput}>
                            <button type="button" style={{marginRight:'2%'}} className="btn btn-dark" onClick={this.goBack}>Back</button>
                            <button type="button" style={{marginLeft:'2%'}} className="btn btn-success" onClick={this.deleteField}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default DeleteFieldFromTable;