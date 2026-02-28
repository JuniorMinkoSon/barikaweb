package ecom_blog.repository;

import ecom_blog.model.Fournisseur;
import ecom_blog.model.Secteur;
import ecom_blog.model.ServiceFournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceFournisseurRepository extends JpaRepository<ServiceFournisseur, Long> {

    List<ServiceFournisseur> findBySecteur(Secteur secteur);

    List<ServiceFournisseur> findByFournisseur(Fournisseur fournisseur);

    List<ServiceFournisseur> findByFournisseurId(Long fournisseurId);

    List<ServiceFournisseur> findByFournisseurAndDisponibleTrue(Fournisseur fournisseur);

    List<ServiceFournisseur> findBySecteurAndDisponibleTrue(Secteur secteur);

    List<ServiceFournisseur> findByNomContainingIgnoreCase(String nom);

    @Query("SELECT s FROM ServiceFournisseur s WHERE s.disponible = true ORDER BY s.nombreReservations DESC")
    List<ServiceFournisseur> findMostPopular();

    @Query("SELECT s FROM ServiceFournisseur s WHERE s.disponible = true AND s.nombreAvis > 0 ORDER BY s.noteMoyenne DESC, s.nombreAvis DESC")
    List<ServiceFournisseur> findTopRated();

    @Query("SELECT s FROM ServiceFournisseur s WHERE s.secteur = :secteur AND s.disponible = true ORDER BY s.nombreReservations DESC")
    List<ServiceFournisseur> findMostPopularBySecteur(Secteur secteur);

    @Query("SELECT s FROM ServiceFournisseur s WHERE s.prix BETWEEN :min AND :max AND s.disponible = true")
    List<ServiceFournisseur> findByPrixBetween(Double min, Double max);

    @Query("SELECT COUNT(s) FROM ServiceFournisseur s WHERE s.fournisseur.id = :fournisseurId")
    long countByFournisseurId(Long fournisseurId);

        @Query("""
            SELECT s FROM ServiceFournisseur s
            JOIN s.fournisseur f
            WHERE s.disponible = true
              AND f.actif = true
              AND (:secteur IS NULL OR s.secteur = :secteur)
              AND (
                :destination IS NULL OR :destination = ''
                OR LOWER(f.ville) LIKE LOWER(CONCAT('%', :destination, '%'))
                OR LOWER(f.adresse) LIKE LOWER(CONCAT('%', :destination, '%'))
                OR LOWER(s.nom) LIKE LOWER(CONCAT('%', :destination, '%'))
              )
            """)
        List<ServiceFournisseur> searchForSejours(@Param("destination") String destination,
            @Param("secteur") Secteur secteur);
}
