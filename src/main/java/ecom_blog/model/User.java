package ecom_blog.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_user")
public class User extends BaseEntity {

    private static final long serialVersionUID = 1L; // ✅ Bonnes pratiques

    private String email;
    private String nom;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // ROLE_USER, ROLE_ADMIN

    // Getters & Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

}
