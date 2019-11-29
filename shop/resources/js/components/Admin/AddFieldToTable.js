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

//  Admin chooses a new field to the selected table.
//  The field can be one of the given types.
class AddFieldToTable extends Component{

    constructor(props){
        super(props);
        this.state={
            username:'',
            chosenTable:'Choose Table',
            chosenType:'Choose Type',
            fieldName:'',
            types:['Integer','String','Double'],
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

    swapType = (e)=>{
        this.setState({
            chosenType:e.target.id,
        })
    }
    changeFieldName = (e)=>{
        this.setState({
            fieldName:e.target.value,
        })
    }
    
    renderTables = (item)=>{
        return(
            <li key={item.table_name.trim()}><a href="javascript:void(0)" id={item.table_name.trim()} onClick={this.swapTable}>{item.table_name.trim()}</a></li>
        )
    }
    renderTypes = (item)=>{
        return(
            <li key={item}><a href="javascript:void(0)" id={item} onClick={this.swapType}>{item}</a></li>
        )
    }
    addField = ()=>{
        var type=this.state.chosenType;
        var table=this.state.chosenTable;
        var field=this.state.fieldName;

        if(field!=='' && table!=='Choose Table' && type!== 'Choose Type'){
            //console.log("Type: "+type+" Table: "+table+" Field: "+field);
            axios.post('/addFieldToTable',{type,table,field})
            .then(res=>{
                //console.log(res);
                this.props.history.push('/addFieldToTable');
            })
        }
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
                        <h3>Add field to table</h3>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <div className="btn-group">
                            <input type="text" className="form-control" onChange={this.changeFieldName} value={this.state.fieldName} placeholder="Field Name"/>
                        </div>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <div className="btn-group">
                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" style={{width:'230px'}}>{this.state.chosenTable}<span className="caret"></span></button>
                            <ul className="dropdown-menu scrollable-menu" style={ulStyle} role="menu">
                                {this.state.tables.map((item)=>this.renderTables(item))}
                            </ul>
                        </div>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <div className="btn-group">
                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" style={{width:'230px'}}>{this.state.chosenType}<span className="caret"></span></button>
                            <ul className="dropdown-menu scrollable-menu" style={ulStyle} role="menu">
                                {this.state.types.map((item)=>this.renderTypes(item))}
                            </ul>
                        </div>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <button type="button" className="btn btn-success" onClick={this.addField}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default AddFieldToTable;