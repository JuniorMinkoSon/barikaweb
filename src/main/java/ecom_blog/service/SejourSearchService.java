package ecom_blog.service;

import ecom_blog.model.Secteur;
import ecom_blog.model.ServiceFournisseur;
import ecom_blog.repository.ReservationRepository;
import ecom_blog.repository.ServiceFournisseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class SejourSearchService {

    @Autowired
    private ServiceFournisseurRepository serviceFournisseurRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public List<ServiceFournisseur> rechercher(String destination,
            LocalDate dateArrivee,
            LocalDate dateDepart,
            Integer voyageurs,
            Secteur secteur,
            Double budgetMax) {

        List<ServiceFournisseur> candidats = serviceFournisseurRepository.searchForSejours(destination, secteur);

        if (budgetMax != null) {
            candidats = candidats.stream()
                    .filter(s -> s.getPrix() != null && s.getPrix() <= budgetMax)
                    .toList();
        }

        if (voyageurs != null && voyageurs > 0) {
            candidats = candidats.stream()
                    .filter(s -> s.getCapacite() == null || s.getCapacite() >= voyageurs)
                    .toList();
        }

        boolean datesValides = dateArrivee != null && dateDepart != null && !dateDepart.isBefore(dateArrivee);
        if (datesValides) {
            candidats = candidats.stream()
                    .filter(s -> !reservationRepository.hasDateConflict(s.getId(), dateArrivee, dateDepart))
                    .toList();
        }

        return candidats.stream()
                .sorted(Comparator
                        .comparing((ServiceFournisseur s) -> s.getNoteMoyenne() != null ? s.getNoteMoyenne() : 0.0)
                        .reversed()
                        .thenComparing(ServiceFournisseur::getNombreReservations, Comparator.reverseOrder()))
                .toList();
    }
}
