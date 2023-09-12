<?php

session_start();

include_once "userArea.php";

$userArray = assembleUser($_SESSION['accessGranted']);

echo json_encode(['userArray' => $userArray]);

?>