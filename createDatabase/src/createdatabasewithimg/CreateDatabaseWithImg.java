/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;
import javax.imageio.ImageIO;

public class CreateDatabaseWithImg {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws SQLException, FileNotFoundException, IOException {
        Connection c=null;
        Statement stmt=null;
        int choice =-1;
        Scanner scan = new Scanner(System.in);
        
        //Connect to database
        try{
            c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/eidiko_thema","postgres", "postgres");
        }
        catch(SQLException ex){
            System.err.println( ex.getClass().getName()+": "+ ex.getMessage() );
            System.exit(0);
        }
        
        while(true){
            System.out.println();
            System.out.println("Options: ");
            System.out.println("1.Create tables");
            System.out.println("2.Fill Tables");
            System.out.println("3.Clear Tables");
            System.out.println("4.Exit");
            System.out.print("Enter option: ");
            choice=scan.nextInt();
            System.out.println();
            
            if(choice==1){
                //Create tables 
                try{
                    stmt = c.createStatement();
                    String sql = "CREATE TABLE \"User\" ( \n" +
                    "	password	VARCHAR(100)	NOT NULL,\n" +
                    "	username	VARCHAR(30)		NOT NULL,\n" +
                    "PRIMARY KEY (username) );\n" +
                    "\n" +  
                    "CREATE TABLE Supplier ( \n" +
                    "	supplier_name	CHAR(100) NOT NULL,\n" +
                    "	supplier_phone	CHAR(30),\n" +
                    "PRIMARY KEY (supplier_name) );\n" +
                    "\n" +
                    "CREATE TABLE Product ( \n" +
                    "	product_id	INTEGER	NOT NULL,\n" +
                    "	product_price	DOUBLE PRECISION,\n" +
                    "	product_desc	CHAR(100),\n" +
                    "	product_name	CHAR(100),\n" +
                    "	FK1_supplier_name	CHAR(100) NOT NULL,\n" +
                    "	product_img_name text,\n" +
                    "	product_img bytea,\n" +
                    "PRIMARY KEY (product_id) );\n" +
                    "\n" +
                    "CREATE TABLE Customer ( \n" +
                    "	customer_email	CHAR(50),\n" +
                    "	customer_lname	CHAR(30),\n" +
                    "	customer_fname	CHAR(30),\n" +
                    "	customer_id	INTEGER	NOT NULL,\n" +
                    "	customer_phone	CHAR(30),\n" +
                    "	FK1_address_id	INTEGER,\n" +
                    "UNIQUE (customer_id),\n" +
                    "UNIQUE (username)\n" +
                    ") INHERITS (\"User\");\n" +
                    "\n" +
                    "CREATE TABLE Address ( \n" +
                    "	address_id	INTEGER	NOT NULL,\n" +
                    "	address_name	CHAR(50),\n" +
                    "	address_number	INTEGER,\n" +
                    "	address_zipcode	INTEGER,\n" +
                    "	address_city	CHAR(50),\n" +
                    "	address_country	CHAR(50),\n" +
                    "PRIMARY KEY (address_id) );\n" +
                    "\n" +
                    "CREATE TABLE Delivery ( \n" +
                    "	departure_date	DATE	NOT NULL,\n" +
                    "	FK1_order_id	INTEGER	NOT NULL,\n" +
                    "	status VARCHAR(100) NOT NULL,\n" +
                    "	delivery_id INTEGER NULL,\n" +
                    "PRIMARY KEY (delivery_id) );\n" +
                    "\n" +
                    "CREATE TABLE \"Order\" ( \n" +
                    "	order_id	INTEGER	NOT NULL,\n" +
                    "	payment_method	CHAR(30),\n" +
                    "	FK1_customer_id	INTEGER NOT NULL,\n" +
                    "	FK2_product_id  INTEGER NOT NULL,\n" +
                    "	comments	CHAR(100),\n" +
                    "	product_quantity_per_product	INTEGER,\n" +
                    "PRIMARY KEY (order_id) );\n" +
                    "\n" +
                    "CREATE TABLE Admin ( \n" +
                    "	admin_id	INTEGER	NOT NULL,\n" +
                    "UNIQUE (admin_id),\n" +
                    "UNIQUE (username)\n" +
                    ") INHERITS (\"User\");\n" +
                    "\n" +
                    "ALTER TABLE Product ADD FOREIGN KEY (FK1_supplier_name) REFERENCES Supplier (supplier_name) ON DELETE CASCADE ON UPDATE CASCADE;\n" +
                    "\n" +
                    "ALTER TABLE Customer ADD FOREIGN KEY (FK1_address_id) REFERENCES Address (address_id) ON DELETE CASCADE  ON UPDATE CASCADE;\n" +
                    "\n" +
                    "ALTER TABLE Delivery ADD FOREIGN KEY (FK1_order_id) REFERENCES \"Order\" (order_id) ON DELETE CASCADE  ON UPDATE CASCADE;\n" +
                    "\n" +
                    "ALTER TABLE \"Order\" ADD FOREIGN KEY (FK1_customer_id) REFERENCES Customer (customer_id) ON DELETE CASCADE  ON UPDATE CASCADE;\n" +
                    "\n" +
                    "ALTER TABLE \"Order\" ADD FOREIGN KEY (FK2_product_id) REFERENCES Product(product_id) ON DELETE CASCADE ON UPDATE CASCADE;\n" +
                    "";

                    stmt.executeUpdate(sql);
                    System.out.println("Tables have been created.");
                }
                catch(SQLException ex){
                    System.err.println( ex.getClass().getName()+": "+ ex.getMessage() );
                    System.exit(0);
                }
            }

            if(choice==2){
                try{

                    //ADMINS
                    String sql;
                    stmt = c.createStatement();
                    sql ="INSERT INTO ADMIN(password,username,admin_id) VALUES('12345','jack',1)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADMIN(password,username,admin_id) VALUES('aaadd','nick',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADMIN(password,username,admin_id) VALUES('zxcvbnm','joe',3)";
                    stmt.executeUpdate(sql);

                    System.out.println("Admins added successfully.");

                    //ADDRESSES
                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(1,'Ronda de Toledo',26,28966,'Madrid','Spain')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(2,'Crawford St',58,16500,'London','England')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(3,'Breite Str',116,48770,'Berlin','Germany')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(4,'Brill St',8,12000,'New York','USA')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(5,'Oak Avenue',15,60020,'Fox Lake','USA')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(6,'Dovetail Estates',26,736001,'Clinton','USA')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(7,'Tenmile Road',34,02137,'Cambridge','USA')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(8,'Privada',122,54123,'Havana','Cuba')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(9,'Chofu',345,21495,'Tokyo','Japan')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(10,'Los Poblados',24,18956,'Madrid','Spain')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(11,'Al Sokari',112,45895,'Cairo','Egypt')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(12,'Beira Rd',58,18956,'Colombo','Sri Lanka')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(13,'Xicheng',64,28468,'Beijing','China')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO ADDRESS(address_id,address_name,address_number,address_zipcode,address_city,address_country) VALUES(14,'Wolgok',14,69562,'Gwangju','Korea')";
                    stmt.executeUpdate(sql);

                    System.out.println("Addresses added successfully.");

                    //CUSTOMERS
                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('1234','john','johnpatel@gmail.com','Patel','John',1,'6936957634',1)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('1234qwe','niko','nikobellic@gmail.com','Bellic','Niko',2,'2025550191',4)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('zxcvbnm','simon','simoncarita@gmail.com','Simon','Carita',3,'6281248970',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('zxcvbnm','raul','raulcarita@gmail.com','Raul','Carita',4,'6286348976',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('45asdw','lferrell','lferrell@gmail.com','Leopold','Ferrell',5,'1254826475',3)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('dqwe45','hbryan','hbryan@gmail.com','Harper','Bryan',6,'5469513758',4)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('fsq956','annie','annie@gmail.com','Anne-Marie','Thomas',7,'54679424561',5)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('fweq887','delliot','delliot@gmail.com','Daisie','Elliot',8,'9568251645',6)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('45aswe','lyonl','lyonl@gmail.com','Leroy','Lyon',9,'1569598745',6)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('5asd4qw','npayne','npayne@gmail.com','Nicola','Payne',10,'65845878995',7)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('1234','zpater','zpater@gmail.com','Zoe','Paterson',11,'42846956237',8)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('1234','keaston','keaston@gmail.com','Konrad','Easton',12,'5687426595',9)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('4asdwq','egreig','egreig@gmail.com','Efa','Greig',13,'84975625156',10)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('eqss887','alkim','alkim@gmail.com','Alister','Kim',14,'8469523688',11)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('dqwe84','thale','thale@gmail.com','Tesa','Hale',15,'236955458712',12)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('kless12','fhuerta','fhuerta@gmail.com','Finley','Huerta',16,'4588695613',13)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO CUSTOMER(password,username,customer_email,customer_lname,customer_fname,customer_id,customer_phone,fk1_address_id) "+
                    "VALUES('1234','cbishop','cbishop@gmail.com','Chad','Bishop',17,'2468456225',14)";
                    stmt.executeUpdate(sql);

                    System.out.println("Customers added successfully.");

                    //SUPPLIERS
                    stmt = c.createStatement();
                    sql ="INSERT INTO SUPPLIER(supplier_name,supplier_phone) VALUES('Microsoft','6934567321')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO SUPPLIER(supplier_name,supplier_phone) VALUES('Nintendo','2103452378')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO SUPPLIER(supplier_name,supplier_phone) VALUES('AmazonBasics','2132456789')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO SUPPLIER(supplier_name,supplier_phone) VALUES('Fujitsu','7687453490')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO SUPPLIER(supplier_name,supplier_phone) VALUES('SanDisk','1234578969')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO SUPPLIER(supplier_name,supplier_phone) VALUES('Razer','6345678923')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO SUPPLIER(supplier_name,supplier_phone) VALUES('Apple','3009865349')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO SUPPLIER(supplier_name,supplier_phone) VALUES('Logitech','4509768922')";
                    stmt.executeUpdate(sql);

                    System.out.println("Suppliers added successfully.");

                    //PRODUCTS
                    File file = new File("Images/xbox_c.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    FileInputStream fis = new FileInputStream(file);
                    PreparedStatement ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(1,59.99,'Compatible with Xbox one , windows 10','Xbox Controller','Microsoft',?,?)");
                    ps.setString(1, file.getName());
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    file = new File("Images/switch.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    fis = new FileInputStream(file);
                    ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(2,300,'Nintedo switch console','Nintendo Switch','Nintendo',?,?)");
                    ps.setString(1, file.getName());
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    file = new File("Images/hdmi.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    fis = new FileInputStream(file);
                    ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(3,6.99,'Cable feet : 6 (1.8 meters)','HDMI Cable','AmazonBasics',?,?)");
                    ps.setString(1, file.getName());
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    file = new File("Images/scan.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    fis = new FileInputStream(file);
                    ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(4,419.99,'Compatible with ios and Windows devices','ScanSnap iX500','Fujitsu',?,?)");
                    ps.setString(1, file.getName());
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    file = new File("Images/card.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    fis = new FileInputStream(file);
                    ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(5,10.19,'Great for cameras','SanDisk 32GB','SanDisk',?,?)");
                    ps.setString(1, file.getName());
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    file = new File("Images/Mac_book.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    fis = new FileInputStream(file);
                    ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(6,548.99,'Refurbished','Mac Book Air','Apple',?,?)");
                    ps.setString(1, file.getName());
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    file = new File("Images/razer.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    fis = new FileInputStream(file);
                    ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(7,200,'Gaming Keyboard','Razer Huntsman Elite','Razer',?,?)");
                    ps.setString(1, file.getName());
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    file = new File("Images/Bluetooth_mouse.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    fis = new FileInputStream(file);
                    ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(8,29.95,'Compact Design for ultimate portability','Bluetooth Mobile Mouse','Microsoft',?,?)");
                    ps.setString(1, file.getName());
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    file = new File("Images/speakers.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    fis = new FileInputStream(file);
                    ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(9,22.99,'Delivers rich, balanced stereo and clear acoustics for a room-filling sound','Multimedia Speakers Z200','Logitech',?,?)");
                    ps.setString(1, file.getName());
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    file = new File("Images/camera.jpg");
                    System.out.println("Entering Product: "+file.getName());

                    fis = new FileInputStream(file);
                    ps =c.prepareStatement("INSERT INTO PRODUCT(product_id,product_price,product_desc,product_name,fk1_supplier_name,product_img_name,product_img) VALUES(10,30,'Full HD 1080p video calling with the latest version of Skype for Windows','HD Pro Webcam C920','Logitech',?,?)");
                    ps.setString(1, file.getName());      
                    ps.setBinaryStream(2, fis, (int)file.length());
                    ps.executeUpdate();
                    ps.close();

                    System.out.println("Products have been added successfully.");

                    //ORDERS
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(1,'Credit card',1,7,'No comments',5)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(2,'Paysafe',2,2,'No comments',1)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(3,'Paysafe',2,1,'No comments',5)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(4,'Paypal',3,6,'No comments',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(5,'Credit Card',3,1,'No comments',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(6,'Paysafe',4,2,'No comments',3)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(7,'Credit Card',4,1,'No comments',1)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(8,'Paysafe',5,10,'No comments',5)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(9,'Paysafe',5,9,'No comments',3)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(10,'Paypal',6,8,'No comments',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(11,'Credit Card',6,4,'No comments',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(12,'Paypal',7,3,'No comments',1)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(13,'Paysafe',8,4,'No comments',1)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(14,'Credit Card',9,1,'No comments',1)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(15,'Cash',10,10,'No comments',10)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(16,'Cash',10,2,'No comments',3)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(17,'Cash',10,3,'No comments',4)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(18,'Cash',10,4,'No comments',10)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(19,'Cash',10,10,'No comments',3)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(20,'Cash',11,5,'No comments',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(21,'Paysafe',11,9,'No comments',4)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(22,'Paysafe',12,2,'No comments',4)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(23,'Credit Card',12,1,'No comments',5)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(24,'Paypal',13,5,'No comments',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(25,'Paysafe',14,2,'No comments',3)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(26,'Credit Card',15,9,'No comments',1)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(27,'Credit Card',16,2,'No comments',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(28,'Credit Card',17,6,'No comments',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(29,'Paypal',15,1,'No comments',1)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(30,'Paysafe',16,2,'No comments',2)";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(31,'Credit Card',13,6,'No comments',2)";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(32,'Credit card',1,1,'No comments',2)";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(33,'Credit card',1,2,'No comments',5)";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(34,'Credit card',1,3,'No comments',4)";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(35,'Credit card',1,4,'No comments',1)";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(36,'Credit card',1,5,'No comments',1)";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(37,'Credit card',1,6,'No comments',2)";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(38,'Credit card',1,7,'No comments',5)";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(39,'Credit card',1,8,'No comments',7)";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO \"Order\"(order_id,payment_method,fk1_customer_id,fk2_product_id,comments,product_quantity_per_product) VALUES(40,'Credit card',1,9,'No comments',1)";
                    stmt.executeUpdate(sql);

                    System.out.println("Orders have been successfully added.");

                    //DELIVERIES
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(1,DATE '2018-10-20',1,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(2,DATE '2018-10-19',2,'Arrival in 4 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(3,DATE '2018-10-19',3,'Arrival in 4 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(4,DATE '2018-10-17',4,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(5,DATE '2018-10-18',5,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(6,DATE '2018-10-20',6,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(7,DATE '2018-10-18',7,'Arrival in 4 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(8,DATE '2018-10-19',8,'Arrival in 4 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(9,DATE '2018-10-18',9,'Arrival in 3 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(10,DATE '2018-10-20',10,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(11,DATE '2018-10-17',11,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(12,DATE '2018-10-18',12,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(13,DATE '2018-10-19',13,'Arrival in 5 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(14,DATE '2018-10-19',14,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(15,DATE '2018-10-17',15,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(16,DATE '2018-10-17',16,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(17,DATE '2018-10-20',17,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(18,DATE '2018-10-18',18,'Arrival in 3 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(19,DATE '2018-10-16',19,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(20,DATE '2018-10-20',20,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(22,DATE '2018-10-20',22,'Arrival in 3 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(23,DATE '2018-10-18',23,'Arrival in 4 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(24,DATE '2018-10-18',24,'Arrival in 4 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(25,DATE '2018-10-17',25,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(26,DATE '2018-10-18',26,'Arrival in 4 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(27,DATE '2018-10-19',27,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(28,DATE '2018-10-17',28,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(29,DATE '2018-10-17',29,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(30,DATE '2018-10-20',30,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);

                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(31,DATE '2018-10-19',31,'Arrival in 3 days')";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(32,DATE '2018-10-19',32,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(33,DATE '2018-10-19',33,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(34,DATE '2018-10-19',34,'Arrival in 3 days')";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(35,DATE '2018-10-19',35,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(36,DATE '2018-10-19',36,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(37,DATE '2018-10-19',37,'Arrival in 2 days')";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(38,DATE '2018-10-19',38,'Arrival in 3 days')";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(39,DATE '2018-10-19',39,'Arrival in 1 day')";
                    stmt.executeUpdate(sql);
                    
                    stmt = c.createStatement();
                    sql ="INSERT INTO DELIVERY(delivery_id,departure_date,fk1_order_id,status) VALUES(40,DATE '2018-10-19',40,'Arrival in 3 days')";
                    stmt.executeUpdate(sql);
                    

                    System.out.println("Deliveries have been added successfully.");
                }
                catch(SQLException ex){
                    System.err.println( ex.getClass().getName()+": "+ ex.getMessage() );
                    System.exit(0);
                }
            }
            if(choice==3){
                String sql;

                stmt = c.createStatement();
                sql ="DROP TABLE IF EXISTS \"Order\" CASCADE";
                stmt.executeUpdate(sql);

                stmt = c.createStatement();
                sql ="DROP TABLE IF EXISTS \"User\"  CASCADE";
                stmt.executeUpdate(sql);

                stmt = c.createStatement();
                sql ="DROP TABLE IF EXISTS  ADDRESS  CASCADE";
                stmt.executeUpdate(sql);

                stmt = c.createStatement();
                sql ="DROP TABLE IF EXISTS  DELIVERY  CASCADE";
                stmt.executeUpdate(sql);

                stmt = c.createStatement();
                sql ="DROP TABLE IF EXISTS PRODUCT CASCADE";
                stmt.executeUpdate(sql);

                stmt = c.createStatement();
                sql ="DROP TABLE IF EXISTS SUPPLIER CASCADE";
                stmt.executeUpdate(sql);
                
                System.out.println("Tables cleared successfully.");

            }
            if(choice==4){
                break;
            }
        }
    }
    
}
