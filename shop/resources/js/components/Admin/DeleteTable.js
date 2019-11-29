import React,{Component} from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const ulStyle={
    height:'auto',
    maxHeight:'200px',
    width:'200px',
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

//Delete a table from the database.
class DeleteTable extends Component{

    constructor(props){
        super(props);
        this.state={
            username:'',
            chosenItem:'Choose Table',
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

    swapItem = (e)=>{
        this.setState({
            chosenItem:e.target.id,
        })
    }
    renderTables = (item)=>{
        return(
            <li key={item.table_name.trim()}><a href="javascript:void(0)" id={item.table_name.trim()} onClick={this.swapItem}>{item.table_name.trim()}</a></li>
        )
    }
    deleteTable = ()=>{
        var table=this.state.chosenItem;
        if(table !=='Choose Table'){
            axios.post('/deleteCurrentTable',{table})
            .then(res=>{
                //console.log(res);
                this.props.history.push('/deleteTable');
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
                        <h3>Choose Table to delete</h3>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <div className="btn-group">
                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" style={{width:'200px'}}>{this.state.chosenItem}<span className="caret"></span></button>
                            <ul className="dropdown-menu scrollable-menu" style={ulStyle} role="menu">
                                {this.state.tables.map((item)=>this.renderTables(item))}
                            </ul>
                        </div>
                    </div>
                    <div className="row justify-content-md-center"  style={changeInput}>
                        <button type="button" className="btn btn-danger" onClick={this.deleteTable}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default DeleteTable;