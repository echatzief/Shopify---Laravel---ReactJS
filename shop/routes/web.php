<?php

use Illuminate\Http\Request;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('loginCustomer');
});
Route::get('/signUp',function(){
    return view('signUpCustomer');
});
Route::get('/mainPage',function(){
    return view('CustomerOptions');
});
Route::get('/item/{product_id}',function(){
    return view('ProductDetails');
});
Route::get('/orders',function(){
    return view('CustomerOrders');
});
Route::get('/details',function(){
    return view('CustomerDetails');
});
Route::get('/search/{input}',function(){
    return view('Search');
});
Route::get('/adminMainPage',function(){
    return view('AdminOptions');
});
Route::get('/createNewAdmin',function(){
    return view('CreateNewAdmin');
});
Route::get('/deleteCustomer',function(){
    return view('DeleteCustomer');
});
Route::get('/deleteTable',function(){
    return view('DeleteTable');
});
Route::get('/addFieldToTable',function(){
    return view('AddFieldToTable');
});
Route::get('/deleteFieldFromTable',function(){
    return view('DeleteFieldFromTable');
});
Route::get('/addProduct',function(){
    return view('AddProduct');
});
Route::get('/bestCities',function(){
    return view('BestCities');
});
Route::get('/bestCustomers',function(){
    return view('BestCustomers');
});
Route::get('/getBestCustomers',function(){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $result = pg_query($conn,"SELECT customer_fname,customer_lname,customer_id, SUM(P.product_price * O.product_quantity_per_product) AS SUM_RESULT 
    FROM CUSTOMER C,PRODUCT P,\"Order\" O WHERE O.fk1_customer_id = C.customer_id and O.fk2_product_id=P.product_id 
    GROUP BY (customer_fname,customer_lname,customer_id) ORDER BY SUM_RESULT DESC LIMIT 10");

    $bestCustomers=pg_fetch_all($result);

    pg_close ($conn);
    return json_encode($bestCustomers);
});
Route::get('/getBestCities',function(){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $result = pg_query($conn,"SELECT address_city,COUNT(*) AS Count FROM CUSTOMER C,ADDRESS A 
    WHERE C.fk1_address_id =A.address_id GROUP BY A.address_city ORDER BY Count DESC LIMIT 10");

    $bestCities=pg_fetch_all($result);

    pg_close ($conn);
    return json_encode($bestCities);
});
Route::get('/numberOfAllOrders',function(){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $result = pg_query($conn,"SELECT order_id FROM \"Order\"");
    $allTables=pg_fetch_all($result);

    $count=pg_num_rows($result);

    if($count>0){
        $res[]=array(
            'count'=>$count,
        );
    }
    else{
        $res[]=array(
            'count'=>0,
        );
    }
    pg_close ($conn);
    return json_encode($res);
});
Route::get('/showAllOrders',function(){
    return view('ShowAllOrders');
});
Route::get('/getTables',function(){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $result = pg_query($conn,"SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='BASE TABLE' and table_schema='public'");
    $allTables=pg_fetch_all($result);

    $count=pg_num_rows($result);

    if($count > 0){
        pg_close ($conn);
        return json_encode($allTables);
    }
    else{
        pg_close ($conn);
        $allTables=array();
        return json_encode($allTables);
    }
});
Route::get('/getAllCustomers',function(){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $result = pg_query($conn,"select * from customer");
    $allProducts=pg_fetch_all($result);

    pg_close ($conn);
    return json_encode($allProducts);
});
/* Returns all the products inside the database */
Route::get('/fetchAllProducts',function(){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $result = pg_query($conn,"select * from product");
    
    
    $allProducts=pg_fetch_all($result);

    //Count how much products i have
    $count=pg_num_rows($result);

    //print_r($allProducts);

    if($count>0){
        $res[]=array(
            'count'=>$count,
            'data'=>$allProducts
        );
    }
    else{
        $res[]=array(
            'count'=>0,
        );
    }
    pg_close ($conn);
    return json_encode($res);
});

Route::post('/tryToLogin',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=/var/run/postgresql port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');
    $password=$request->input('password');

    error_log("Username: {$username} Password: {$password}");

    //Check if user is customer
    $result = pg_query($conn,"select * from customer where username='{$username}' and password='{$password}'");
    $count=pg_num_rows($result);

    if($count > 0){
        $res[]=array(
            'status'=>true,
            'redirect'=>'/mainPage',
        );
        pg_close ($conn);
        return json_encode($res);
    }
    else{

        error_log("Checking if {$username} is admin");
        //Check if user is admin
        $result = pg_query($conn,"select * from admin where username='{$username}' and password='{$password}'");
        $count=pg_num_rows($result);

        if($count > 0){
            error_log("count");
            $res[]=array(
                'status'=>true,
                'redirect'=>'/adminMainPage',
            );
            pg_close ($conn);
            return json_encode($res);
        }
        else{
            error_log("no");
            $res[]=array(
                'status'=>false,
            );
            pg_close ($conn);
            return json_encode($res);
        }
    }
    
});

Route::post('/checkForUsername',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');

    error_log("Username: {$username}");

    //Search for customer's info
    $result = pg_query($conn,"select * from customer where username='{$username}'");
    $count=pg_num_rows($result);

    if($count > 0){
        $res[]=array(
            'status'=>true,
        );
    }
    else{
        $res[]=array(
            'status'=>false,
        );
    }
    pg_close ($conn);
    return json_encode($res);
});

Route::post('/insertNewCustomer',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');
    $password=$request->input('password');
    $firstname=$request->input('firstname');
    $lastname=$request->input('lastname');
    $email=$request->input('email');
    $phone=$request->input('phone');

    $result=pg_query($conn,"SELECT max(customer_id) FROM CUSTOMER");
    $newID=pg_fetch_result($result,0,0)+1;

    error_log("NEW ID: {$newID}");
    //Insert customer
    $result = pg_query($conn,"insert into customer(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone)
    values('{$password}','{$username}','{$email}','{$lastname}','{$firstname}',{$newID},'{$phone}')");

    $res[]=array(
        'newID'=>$newID,
    );
    pg_close ($conn);
    return json_encode($res);
});

Route::post('/checkTheAddress',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');
    $newID=$request->input('newID');
    $country=$request->input('country');
    $city=$request->input('city');
    $address=$request->input('address');
    $number=$request->input('number');
    $zipcode=$request->input('zipcode');

    $result = pg_query($conn,"SELECT address_id FROM ADDRESS A where A.address_name ='{$address}' and A.address_number={$number} 
    and A.address_zipcode ={$zipcode} and A.address_city = '{$city}' and A.address_country='{$country}'");
    $count=pg_num_rows($result);


    error_log("ID at address: {$newID} ");
    if($count>0){
        $currentAddressID=pg_fetch_result($result,0,0);
        pg_query($conn,"UPDATE CUSTOMER C SET fk1_address_id={$currentAddressID} where C.customer_id={$newID}");
    }
    else{

        //New address id
        $result=pg_query($conn,"SELECT max(address_id) FROM ADDRESS");
        $newAddressID=pg_fetch_result($result,0,0)+1;

        //Insert the new address
        $result=pg_query($conn, "INSERT INTO ADDRESS(address_country,address_city,address_zipcode,address_number,address_name,address_id)
        VALUES('{$country}','{$city}',{$zipcode},{$number},'{$address}',{$newAddressID})");

        pg_query($conn,"UPDATE CUSTOMER C SET fk1_address_id={$newAddressID} where C.customer_id={$newID}");
    }

    pg_close ($conn);
    return response(200);
});

Route::post('/getProductDetails',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    $product_id=$request->input('prod_id');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $result = pg_query($conn,"SELECT * FROM product where product_id={$product_id}");
    $product_details=pg_fetch_all($result);

    pg_close ($conn);

    return json_encode($product_details);
});


Route::post('/makeOrder',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');
    
    $product_id=$request->input('product_id');
    $quantity=$request->input('quantity');
    $paymentMethod=$request->input('paymentMethod');
    $comments=$request->input('comments');
    $username=$request->input('username');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    //Get user id
    $result=pg_query($conn,"SELECT customer_id FROM Customer WHERE username='{$username}'");
    $customer_id=pg_fetch_result($result,0,0);

    error_log("Customer ID: {$customer_id}");

    //Get the order id
    $result=pg_query($conn,"SELECT max(order_id) FROM \"Order\" ");
    $order_id=pg_fetch_result($result,0,0)+1;

    error_log("New order ID: {$order_id}");

    //Insert order 
    $result=pg_query($conn, "INSERT INTO \"Order\" (order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) 
    VALUES({$order_id},'{$paymentMethod}',{$customer_id},{$product_id},'{$comments}',{$quantity})");

    //Get the date
    $date = date("Y/m/d");
    error_log("Date {$date}");

    $result=pg_query($conn, "INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status)
    VALUES ({$order_id},DATE '{$date}',{$order_id},'Arrival in 2 days')");

    pg_close ($conn);
    return response(200);
});

Route::post('/numberOfOrders',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');


    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');

    error_log("Username: {$username}");

    $result=pg_query($conn," SELECT COUNT(O.order_id) FROM CUSTOMER C,\"Order\" O
    WHERE C.customer_id = O.fk1_customer_id and C.username='{$username}'");

    $order_number=pg_fetch_result($result,0,0);

    error_log("Order Number: {$order_number}");

    //Close database connection
    pg_close($conn);

    return json_encode($order_number);
});

Route::post('/getTotalCost',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');
    error_log("lool: {$username}");
    $result=pg_query($conn,"SELECT SUM(product_price * product_quantity_per_product) FROM CUSTOMER C,PRODUCT P,\"Order\" O 
    WHERE C.customer_id = O.fk1_customer_id and P.product_id = O.fk2_product_id and C.username='{$username}'");

    $totalCost=pg_fetch_result($result,0,0);
    error_log("lool: {$totalCost}");

    pg_close($conn);
    return json_encode($totalCost);
});

Route::post('/getSomeOrders',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');


    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');
    $limit = $request->input('limit');
    $numOfPages = $request->input('numOfPages');
    $offset = $numOfPages*$limit;  // ama exeis 4 limit kai page 2 parineiw 2-1 * 4
    

    error_log("Username: {$username} Limit:{$limit} Offset: {$offset}");
        
    $result=pg_query($conn,"SELECT * FROM CUSTOMER C,\"Order\" O,Product P 
    WHERE C.customer_id = O.fk1_customer_id and O.fk2_product_id=P.product_id and  C.username='{$username}' LIMIT {$limit} OFFSET {$offset}");

    $all_orders=pg_fetch_all($result);

    pg_close($conn);
    return json_encode($all_orders);
});

Route::post('/removeOrder',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');


    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $order_id=$request->input('order_id');

    $result=pg_query($conn,"DELETE FROM \"Order\" O where O.order_id ={$order_id}");

    pg_close($conn);
    return response(200);
});

Route::post('/deleteAccount',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');


    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');

    $result=pg_query($conn,"DELETE FROM CUSTOMER C where C.username='{$username}'");

    pg_close($conn);
    return response(200);
});

Route::post('/getCustomerDetails',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');

    $result=pg_query($conn,"SELECT * FROM CUSTOMER C,ADDRESS A where C.username='{$username}' and A.address_id = C.fk1_address_id");

    $customer_details=pg_fetch_all($result);

    pg_close($conn);
    return json_encode($customer_details);
});

Route::post('/changeCustomerPassword',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');
    $password=$request->input('password');

    $result=pg_query($conn,"UPDATE CUSTOMER SET password='{$password}' WHERE username='{$username}'");

    pg_close($conn);
    return response(200);
});

Route::post('/searchProduct',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $searchText=$request->input('searchText');

    $result=pg_query($conn,"SELECT product_name FROM PRODUCT");

    $allProducts=pg_fetch_all($result);
    
    //print_r($allProducts);

    /* We get the product names */
    $product_Names = [];
    foreach($allProducts as $array){
        $item = $array['product_name'];
        if (strpos(strtoupper($item),strtoupper($searchText)) !== false) {
            array_push($product_Names,$item);
        }
    }

    $p_names = join("','",$product_Names);

    $correctTables = "SELECT * FROM PRODUCT WHERE product_name IN ('$p_names')";
    $result=pg_query($conn,$correctTables);

    error_log("Search : {$searchText}");

    $allSearchedProducts=pg_fetch_all($result);

    //Count how much products i have
    $count=pg_num_rows($result);

    if($count>0){
        $res[]=array(
            'count'=>$count,
            'data'=>$allSearchedProducts
        );
    }
    else{
        $res[]=array(
            'count'=>0,
        );
    }
    pg_close ($conn);
    return json_encode($res);
});
Route::post('/deleteAdminAccount',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');

    $result=pg_query($conn,"DELETE FROM ADMIN A where A.username='{$username}'");

    pg_close($conn);
    return response(200);
});
Route::post('/createNewAdmin',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $username=$request->input('username');
    $password=$request->input('password');

    $result=pg_query($conn,"SELECT username FROM ADMIN A where A.username = '{$username}'");
    $count=pg_num_rows($result);

    if($count>0){
        $res[]=array(
            'status'=>false,
        );
    }
    else{
        $result=pg_query($conn,"SELECT max(admin_id) FROM ADMIN");
        $newID=pg_fetch_result($result,0,0)+1;

        $result=pg_query($conn,"INSERT INTO ADMIN(password,username,admin_id) VALUES('{$password}','{$username}',{$newID})");

        $res[]=array(
            'status'=>true,
        );
    }
    pg_close($conn);
    return response($res);
});

Route::post('/deleteCurrentTable',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $table=$request->input('table');

    if(strcmp($table,"User") || strcmp($table,"Order")){
        $result=pg_query($conn,"DROP TABLE \"{$table}\" CASCADE");
    }
    else{
        $result=pg_query($conn,"DROP TABLE  {$table} CASCADE");
    }
    pg_close($conn);
    return response(200);
});
Route::post('/addFieldToTable',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $table=$request->input('table');
    $type=$request->input('type');
    $field=$request->input('field');

    if(strcmp($table,"User") || strcmp($table,"Order")){
        if(strcmp($type,"String")){
            $result=pg_query($conn,"ALTER TABLE \"{$table}\" ADD {$field} CHAR(255)");
        }
        else if(strcmp($type,"Integer")){
            $result=pg_query($conn,"ALTER TABLE \"{$table}\" ADD {$field} INTEGER");
        }
        else{
            $result=pg_query($conn,"ALTER TABLE \"{$table}\" ADD {$field} DOUBLE PRECISION");
        }
    }
    else{
        if(strcmp($type,"String")){
            $result=pg_query($conn,"ALTER TABLE {$table} ADD {$field} CHAR(255)");
        }
        else if(strcmp($type,"Integer")){
            $result=pg_query($conn,"ALTER TABLE {$table} ADD {$field} INTEGER");
        }
        else{
            $result=pg_query($conn,"ALTER TABLE {$table} ADD {$field} DOUBLE PRECISION");
        }
    }
    pg_close($conn);
    return response(200);
});
Route::post('/getFieldsFromTable',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $table=$request->input('table');

    error_log("Table: {$table}");

    if(strcmp($table,"User") || strcmp($table,"Order")){
        $result=pg_query($conn,"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{$table}'");
        $allFields=pg_fetch_all($result);
    }
    else{
        $result=pg_query($conn,"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{$table}'");
        $allFields=pg_fetch_all($result);
    }

    pg_close($conn);
    return json_encode($allFields);
});

Route::post('/deleteFields',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $table=$request->input('table');
    $field=$request->input('field');

    if(strcmp($table,"User") || strcmp($table,"Order")){
        $result=pg_query($conn,"ALTER TABLE \"{$table}\" DROP COLUMN {$field} CASCADE");
    }
    else{
        $$result=pg_query($conn,"ALTER TABLE {$table} DROP COLUMN {$field} CASCADE");
    }
    pg_close($conn);
    return response(200);
});

Route::post('/checkIfProductExists',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $productName=$request->input('productName');

    $result=pg_query($conn,"SELECT product_id FROM PRODUCT P where P.product_name='{$productName}'");
    $count=pg_num_rows($result);

    if($count>0){
        $res[]=array(
            'status'=>true,
        );
    }
    else{
        $res[]=array(
            'status'=>false,
        );
    }
    pg_close($conn);
    return response($res);
});

Route::post('/checkIfSupplierExists',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $supplier=$request->input('supplier');

    $result=pg_query($conn,"SELECT supplier_name FROM SUPPLIER S where S.supplier_name='{$supplier}'");
    $count=pg_num_rows($result);

    if($count>0){
        $res[]=array(
            'status'=>true,
        );
    }
    else{
        $res[]=array(
            'status'=>false,
        );
    }
    pg_close($conn);
    return response($res);
});
Route::post('/createSupplier',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $supplier=$request->input('supplier');
    $supplierPhone=$request->input('supplierPhone');

    $result=pg_query($conn,"INSERT INTO SUPPLIER(supplier_name,supplier_phone) VALUES('{$supplier}','{$supplierPhone}')");

    pg_close($conn);
    return response(200);
});
Route::post('/createProduct',function(Request $request){
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    if($conn != NULL){
        error_log("Success Connect");
    }

    $supplier=$request->input('supplier');
    $productName=$request->input('productName');
    $price=$request->input('price');
    $description=$request->input('description');
    $image=$request->input('image');
    $imageLabel=$request->input('imageLabel');


    $result=pg_query($conn,"SELECT max(product_id) FROM Product ");
    $newID=pg_fetch_result($result,0,0)+1;
    
    $doublePre = doubleval($price);

    error_log("What: {$doublePre}");

    error_log("{$image}");

    if(is_numeric($doublePre)){
        error_log("IM NUMBERIC");
    }

    //$result=pg_prepare($conn,"my_query","INSERT INTO \"User\"(username,password) VALUES($1,$2)");
    $result=pg_prepare($conn,"my_query","INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES($1,$2,$3,$4,$5,$6,$7)");

    $result=pg_execute($conn,"my_query",array($newID,$doublePre,"{$description}","{$productName}","{$supplier}","{$imageLabel}",$image));
    //$result = pg_execute($dbconn, "my_query",array($newID,$doublePre,"{$description}","{$productName}","{$supplier}","{$imageLabel}"));

    pg_close($conn);
    return response(200);
});
Route::post('/getSomeFromAllOrders',function(Request $request){

    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $limit = $request->input('limit');
    $numOfPages = $request->input('numOfPages');
    $offset = $numOfPages*$limit;  // ama exeis 4 limit kai page 2 parineiw 2-1 * 4
    

    error_log("Limit:{$limit} Offset: {$offset}");
        
    $result=pg_query($conn,"SELECT * FROM \"Order\" O,Product P,Customer C,Delivery D WHERE O.fk1_customer_id=C.customer_id 
    and O.fk2_product_id=P.product_id and O.order_id = D.fk1_order_id ORDER BY(C.customer_id) LIMIT {$limit} OFFSET {$offset}");

    $all_orders=pg_fetch_all($result);

    pg_close($conn);
    return json_encode($all_orders);
});

Route::post('/editStatus',function(Request $request){

    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    //Connect to database 
    $connectionStr ="host=localhost port=5432 dbname=eidiko_thema user=postgres password=postgres";
    $conn=pg_connect($connectionStr);

    $newStatus = $request->input('newStatus');
    $order_id = $request->input('order_id');
    
    $result=pg_query($conn,"UPDATE DELIVERY D SET status='{$newStatus}' where D.delivery_id={$order_id}");

    pg_close($conn);
    return response(200);
});