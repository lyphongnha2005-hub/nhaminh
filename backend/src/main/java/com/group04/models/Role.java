package com.group04.models;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Short id;
    @Column(nullable = false, unique = true, length = 20)
    private String name;
    @Column(length = 255)
    private String description;

    protected Role() {
    }

    public Role(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Short getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}

