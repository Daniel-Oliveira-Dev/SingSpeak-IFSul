<?php

session_start();

$user = $_SESSION['acessGranted'];

echo $user;
?>
