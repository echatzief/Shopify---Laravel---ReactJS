import React,{Component} from 'react';

const counterStyle={
    width:'300px',
    display:'inline-block',
}

//Component used as counter.
class QuantityCounter extends Component{
 
    render(){
        return(
            <div className="col-sm-4">
                <button type="button" onClick={this.props.decrease} className="btn btn-light">-</button>
                <button type="button"className="btn btn-light disabled">{this.props.quantity}</button>
                <button type="button" onClick={this.props.increase} className="btn btn-light">+</button>
            </div>
        );
    }
}

export default QuantityCounter;