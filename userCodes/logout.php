<?php

session_start();

include_once "userArea.php";

logGenerator($_SESSION["accessGranted"], "Logout");

unset($_SESSION['accessGranted']);

?>