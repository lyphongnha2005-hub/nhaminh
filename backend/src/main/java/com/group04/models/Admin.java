package com.group04.models;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
public class Admin extends Account {
    protected Admin() {
    }

    public Admin(Role role, String fullName, String email, String phone, String hash) {
        super(role, fullName, email, phone, hash);
    }

    @Override
    public String getAccountType() {
        return "ADMIN";
    }
}

