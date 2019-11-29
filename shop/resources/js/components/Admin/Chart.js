import React,{Component} from 'react';
import {Doughnut} from 'react-chartjs-2';

// Chart component
class Chart extends Component{
    render(){
        return(
            <div style={{marginTop:'4%'}}>
                <Doughnut 
                    data={this.props.data}
                    width={400}
	                height={600}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
            </div>
        )
    }
}
export default Chart;