package ecom_blog.repository;

import ecom_blog.model.Fournisseur;
import ecom_blog.model.Reservation;
import ecom_blog.model.StatutReservation;
import ecom_blog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

        List<Reservation> findByClient(User client);

        List<Reservation> findByClientId(Long clientId);

        List<Reservation> findByFournisseur(Fournisseur fournisseur);

        List<Reservation> findByFournisseurId(Long fournisseurId);

        List<Reservation> findByStatut(StatutReservation statut);

        List<Reservation> findByFournisseurAndStatut(Fournisseur fournisseur, StatutReservation statut);

        List<Reservation> findByDateReservationBetween(LocalDateTime debut, LocalDateTime fin);

        // Statistiques pour l'admin
        @Query("SELECT SUM(r.commission) FROM Reservation r WHERE r.statut = 'ACCEPTE'")
        Double sumTotalCommission();

        @Query("SELECT SUM(r.montant) FROM Reservation r WHERE r.statut = 'ACCEPTE'")
        Double sumTotalMontant();

        @Query("SELECT SUM(r.commission) FROM Reservation r WHERE r.statut = 'ACCEPTE' AND r.fournisseur.id = :fournisseurId")
        Double getTotalCommissionsByFournisseur(Long fournisseurId);

        @Query("SELECT SUM(r.montantNet) FROM Reservation r WHERE r.statut = 'ACCEPTE' AND r.fournisseur.id = :fournisseurId")
        Double getTotalRevenusNetByFournisseur(Long fournisseurId);

        // Statistiques par mois
        @Query("SELECT MONTH(r.dateReservation), COUNT(r), SUM(r.montant), SUM(r.commission), (SUM(r.montant) - SUM(r.commission)) "
                        +
                        "FROM Reservation r WHERE r.statut = 'ACCEPTE' AND YEAR(r.dateReservation) = :year " +
                        "GROUP BY MONTH(r.dateReservation)")
        List<Object[]> getStatistiquesMensuelles(int year);

        // Statistiques par fournisseur
        @Query("SELECT r.fournisseur.id, r.fournisseur.nomEntreprise, COUNT(r), SUM(r.montant), SUM(r.commission) " +
                        "FROM Reservation r WHERE r.statut = 'ACCEPTE' " +
                        "GROUP BY r.fournisseur.id, r.fournisseur.nomEntreprise")
        List<Object[]> getStatistiquesParFournisseur();

        @Query("SELECT COUNT(r) FROM Reservation r WHERE r.fournisseur.id = :fournisseurId AND r.statut = :statut")
        long countByFournisseurIdAndStatut(Long fournisseurId, StatutReservation statut);

                                @Query("""
                                                                                                SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END
                                                                                                FROM Reservation r
                                                                                                WHERE r.service.id = :serviceId
                                                                                                        AND r.statut IN ('EN_COURS', 'ACCEPTE')
                                                                                                        AND r.dateService IS NOT NULL
                                                                                                        AND (
                                                                                                                                (r.dateFinService IS NULL AND r.dateService BETWEEN :dateDebut AND :dateFin)
                                                                                                                                OR
                                                                                                                                (r.dateFinService IS NOT NULL AND r.dateService <= :dateFin AND r.dateFinService >= :dateDebut)
                                                                                                                        )
                                                                                                """)
                                boolean hasDateConflict(Long serviceId, LocalDate dateDebut, LocalDate dateFin);
}
