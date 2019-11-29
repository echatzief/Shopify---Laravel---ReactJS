import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Login from './Customer/Login';
import SignUp from './Customer/SignUpCustomer';
import { Route, Switch ,BrowserRouter,withRouter} from 'react-router-dom';
import CustomerOptions from './Customer/CustomerOptions';
import ProductDetails from './Customer/ProductDetails';
import CustomerOrders from './Customer/CustomerOrders';
import CustomerDetails from './Customer/CustomerDetails';
import Search from './Customer/Search';
import AdminOptions from './Admin/AdminOptions';
import CreateNewAdmin from './Admin/CreateNewAdmin';
import DeleteCustomer from './Admin/DeleteCustomer';
import DeleteTable from './Admin/DeleteTable';
import AddFieldToTable from './Admin/AddFieldToTable';
import DeleteFieldFromTable from './Admin/DeleteFieldFromTable';
import AddProduct from './Admin/AddProduct';
import ShowAllOrders from './Admin/ShowAllOrders';
import BestCities from './Admin/BestCities';
import BestCustomers from './Admin/BestCustomers';

const render = function (){
    ReactDOM.render(
    <BrowserRouter forceRefresh={true}>
        <Switch>
            <Route exact path="/" component={withRouter(Login)}/>
            <Route path="/signUp" component={withRouter(SignUp)} />
            <Route path="/mainPage" component={withRouter(CustomerOptions)} />
            <Route path="/item/" component={withRouter(ProductDetails)} />
            <Route path="/orders" component={withRouter(CustomerOrders)} />
            <Route path="/details" component={withRouter(CustomerDetails)} />
            <Route path="/search/" component={withRouter(Search)} />
            <Route path="/adminMainPage" component={withRouter(AdminOptions)}/>
            <Route path="/createNewAdmin" component={withRouter(CreateNewAdmin)}/>
            <Route path="/deleteCustomer" component={withRouter(DeleteCustomer)}/>
            <Route path="/deleteTable" component={withRouter(DeleteTable)}/>
            <Route path="/addFieldToTable" component={withRouter(AddFieldToTable)}/>
            <Route path="/deleteFieldFromTable" component={withRouter(DeleteFieldFromTable)}/>
            <Route path="/addProduct" component={withRouter(AddProduct)}/>
            <Route path="/showAllOrders" component={withRouter(ShowAllOrders)}/>
            <Route path="/bestCities" component={withRouter(BestCities)}/>
            <Route path="/bestCustomers" component={withRouter(BestCustomers)}/>
        </Switch>
    </BrowserRouter>
    , document.getElementById('app'));
}
render();