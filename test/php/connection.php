<?php

	$database_connection="mysql:host=".SERVER_NAME.";".PORT."dbname=".DATABASE_NAME;

	try 
	{
		$db = new PDO($database_connection, USER_NAME, PASSWORD);
   		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //echo "AAAAAAAAAAAAAAAAAAAAAA";
	}
	catch(PDOException $e) 
	{
	  die($e->getMessage());
	}

?>