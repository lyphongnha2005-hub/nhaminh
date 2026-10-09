package com.group04.models;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer extends Account {
    protected Customer() {
    }

    public Customer(Role role, String fullName, String email, String phone, String hash) {
        super(role, fullName, email, phone, hash);
    }

    @Override
    public String getAccountType() {
        return "CUSTOMER";
    }
}

