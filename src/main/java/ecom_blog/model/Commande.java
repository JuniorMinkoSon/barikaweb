package ecom_blog.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Commande extends BaseEntity {

    @ManyToOne
    private User user;

    @CreationTimestamp
    private LocalDateTime dateCommande;

    private String statut = "EN_ATTENTE";

    private double total;

    private String modePaiement;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<CommandeItem> items = new ArrayList<>();
}
