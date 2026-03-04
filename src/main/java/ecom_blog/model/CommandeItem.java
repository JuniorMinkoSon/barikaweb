package ecom_blog.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CommandeItem extends BaseEntity {

    @ManyToOne
    private Commande commande;

    @ManyToOne
    private Produit produit;

    private double prix;

    private int quantite;
}
