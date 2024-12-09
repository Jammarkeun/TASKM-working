<?php

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $fullname;
    public $email;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (fullname, email, password) VALUES (:fullname, :email, :password)";
        $stmt = $this->conn->prepare($query);
        
        $this->fullname = htmlspecialchars(strip_tags($this->fullname));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $hashed_password = password_hash($this->password, PASSWORD_DEFAULT);

        $stmt->bindParam(":fullname", $this->fullname);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $hashed_password);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function login() {
        $query = "SELECT id, fullname, password FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(':email', $this->email);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->fullname = $row['fullname'];
                return true;
            }
        }

        return false;
    }
}