package ecom_blog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Devis extends BaseEntity {

    private String nomComplet;
    private String telephone;
    private String email;
    private String villeDepart;
    private String villeArrivee;
    private String volumeEstime;
    private LocalDate datePrevue;

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime dateDemande = LocalDateTime.now();

    private String statut = "EN_ATTENTE"; // EN_ATTENTE, ACCEPTE, REFUSE, TERMINE
}
