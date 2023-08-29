<?php

// Classe do Banco de Dados
class Database {
    private $db_host = '';
    private $db_user = '';
    private $db_pass = '';
    private $db_name = '';
    private $db_conn = '';

    public function __contruct($db_host, $db_user, $db_pass, $db_name) {
        $this->db_host = $db_host;
        $this->db_user = $db_user;
        $this->db_pass = $db_pass;
        $this->db_name = $db_name;
        $this->db_conn = $db_conn;
    }

    public function connect() {
        if (!$this->db_conn) {
            $this->db_conn = mysqli_connect($this->db_host, $this->db_user, $this->db_pass);

            if ($this->db_conn) {
                $selectdb = mysqli_select_db($this->db_conn, $this->db_name);

                return $selectdb;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function disconnect() {
        if ($this->db_conn) {
            if (mysqli_close($this->conn)) {
                $this->db_conn = false;
                return true;
            } else {
                return false;
            }
        }
    }

    public function select() {}

    public function insert() {}

    public function delete() {}

    public function update() {}

}

?>