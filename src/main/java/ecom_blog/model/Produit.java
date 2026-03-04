package ecom_blog.model;

import jakarta.persistence.*;
import lombok.Data;

import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "produit")
@EqualsAndHashCode(callSuper = true)
public class Produit extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private String nom;
    private String categorie;
    private Double prix;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;
}
