import React,{Component} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import Chart from './Chart';


//It creates a graph that shows the top 10 customers
class BestCustomers extends Component{

    constructor(props){
        super(props);
        this.state={
            username:'',
            data: {},
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

        axios.get('/getBestCustomers')
        .then(res=>{
            //console.log(res);
            var lab = new Array();
            var dat = new Array();
            var backColor = new Array();
            var hoveColor = new Array();

            /* Get data and labels */
            for(var i=0;i<res.data.length;i++){
                var firstame=res.data[i].customer_fname.trim();
                var lastname=res.data[i].customer_lname.trim();
                var fullName=firstame.charAt(0)+"."+lastname;

                lab.push(fullName);
                dat.push(res.data[i].sum_result.trim());

                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                backColor.push("rgb(" + r + "," + g + "," + b + ")");
                hoveColor.push("rgb(" + r + "," + g + "," + b + ")");
            }

            const temp = {
                labels: lab,
                datasets: [{
                    data: dat,
                    backgroundColor: backColor,
                    hoverBackgroundColor: hoveColor
                }]
            };

            this.setState({
                data:temp,
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
    render(){
        return(
            <div>
                <Navbar
                    logout={this.logout}
                    deleteAccount={this.deleteAccount}
                />
                <Chart data={this.state.data} />
            </div>
        );
    }
}
export default BestCustomers;