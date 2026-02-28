package ecom_blog.controller;

import ecom_blog.dto.CreateReservationDto;
import ecom_blog.model.*;
import ecom_blog.service.FournisseurService;
import ecom_blog.service.ReservationService;
import ecom_blog.service.UserService;
import ecom_blog.repository.EvaluationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private FournisseurService fournisseurService;

    @Autowired
    private UserService userService;

    @Autowired
    private EvaluationRepository evaluationRepository;

    // ... (rest of the file)

    // ==================== PAGES SECTEURS ====================

    @GetMapping("/secteurs")
    public String secteurs(Model model) {
        long countVoitures = fournisseurService.countBySecteur(Secteur.VOITURE);
        long countLoisirs = fournisseurService.countBySecteur(Secteur.LOISIRS);
        long countAlimentaire = fournisseurService.countBySecteur(Secteur.ALIMENTAIRE);
        long countEvenementiel = fournisseurService.countBySecteur(Secteur.EVENEMENTIEL);

        model.addAttribute("countVoitures", countVoitures);
        model.addAttribute("countLoisirs", countLoisirs);
        model.addAttribute("countAlimentaire", countAlimentaire);
        model.addAttribute("countEvenementiel", countEvenementiel);

        return "user/secteurs";
    }

    @GetMapping("/voitures")
    public String voitures(Model model) {
        List<Fournisseur> fournisseurs = fournisseurService.findBySecteur(Secteur.VOITURE);
        List<ServiceFournisseur> services = fournisseurService.getServicesPopulaires(Secteur.VOITURE);

        model.addAttribute("secteur", "Location de Voitures");
        model.addAttribute("secteurCode", "VOITURE");
        model.addAttribute("fournisseurs", fournisseurs);
        model.addAttribute("services", services);

        return "user/secteur-voitures";
    }

    @GetMapping("/loisirs")
    public String loisirs(Model model) {
        List<Fournisseur> fournisseurs = fournisseurService.findBySecteur(Secteur.LOISIRS);
        List<ServiceFournisseur> services = fournisseurService.getServicesPopulaires(Secteur.LOISIRS);

        model.addAttribute("secteur", "Loisirs & Activités");
        model.addAttribute("secteurCode", "LOISIRS");
        model.addAttribute("fournisseurs", fournisseurs);
        model.addAttribute("services", services);

        return "user/secteur-loisirs";
    }

    @GetMapping("/alimentaire")
    public String alimentaire(Model model) {
        List<Fournisseur> fournisseurs = fournisseurService.findBySecteur(Secteur.ALIMENTAIRE);
        List<ServiceFournisseur> services = fournisseurService.getServicesPopulaires(Secteur.ALIMENTAIRE);

        model.addAttribute("secteur", "Restaurants & Cuisine");
        model.addAttribute("secteurCode", "ALIMENTAIRE");
        model.addAttribute("fournisseurs", fournisseurs);
        model.addAttribute("services", services);

        return "user/secteur-alimentaire";
    }

    @GetMapping("/evenementiel")
    public String evenementiel(Model model) {
        List<Fournisseur> fournisseurs = fournisseurService.findBySecteur(Secteur.EVENEMENTIEL);
        List<ServiceFournisseur> services = fournisseurService.getServicesPopulaires(Secteur.EVENEMENTIEL);

        model.addAttribute("secteur", "Événementiel");
        model.addAttribute("secteurCode", "EVENEMENTIEL");
        model.addAttribute("fournisseurs", fournisseurs);
        model.addAttribute("services", services);

        return "user/secteur-evenementiel";
    }

    // ==================== DÉTAILS FOURNISSEUR ====================

    @GetMapping("/fournisseur/{id}")
    public String detailsFournisseur(@PathVariable Long id, Model model) {
        Fournisseur fournisseur = fournisseurService.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));

        List<ServiceFournisseur> services = fournisseurService.getServicesActifsByFournisseur(fournisseur);

        model.addAttribute("fournisseur", fournisseur);
        model.addAttribute("services", services);

        return "user/fournisseur-details";
    }

    // ==================== DÉTAILS SERVICE & RÉSERVATION ====================

    @GetMapping("/service/{id}")
    public String detailsService(@PathVariable Long id, Model model) {
        ServiceFournisseur service = fournisseurService.findServiceById(id)
                .orElseThrow(() -> new RuntimeException("Service non trouvé"));

        model.addAttribute("service", service);
        model.addAttribute("fournisseur", service.getFournisseur());

        List<Evaluation> evaluations = evaluationRepository.findByServiceId(id);
        model.addAttribute("evaluations", evaluations);

        CreateReservationDto dto = new CreateReservationDto();
        dto.setServiceId(id);
        model.addAttribute("reservationDto", dto);

        return "user/service-details";
    }

    @PostMapping("/reserver")
    public String reserver(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @ModelAttribute("reservationDto") CreateReservationDto dto,
            BindingResult result,
            Model model) {

        if (result.hasErrors()) {
            if (dto.getServiceId() == null) {
                return "redirect:/reservation/secteurs";
            }
            ServiceFournisseur service = fournisseurService.findServiceById(dto.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Service non trouvé"));
            model.addAttribute("service", service);
            model.addAttribute("fournisseur", service.getFournisseur());
            return "user/service-details";
        }

        if (dto.getServiceId() == null) {
            return "redirect:/reservation/secteurs";
        }

        ServiceFournisseur service = fournisseurService.findServiceById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service non trouvé"));

        if (service.getSecteur() == Secteur.VOITURE && !dto.isContratAccepte()) {
            model.addAttribute("service", service);
            model.addAttribute("fournisseur", service.getFournisseur());
            model.addAttribute("errorContrat", "Vous devez accepter le contrat juridique pour réserver un véhicule");
            return "user/service-details";
        }

        User user = userService.findByEmailOptional(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Reservation reservation = reservationService.creerReservation(
                user,
                dto.getServiceId(),
                dto.getNomClient(),
                dto.getTelephone(),
                dto.getEmail(),
                dto.getDateService(),
                dto.getDateFinService(),
                dto.getNombrePersonnes(),
                dto.getNombreJours(),
                dto.isAvecChauffeur(),
                dto.getNotes());

        return "redirect:/reservation/confirmation/" + reservation.getId();
    }

    @GetMapping("/confirmation/{id}")
    public String confirmation(@PathVariable Long id, Model model) {
        Reservation reservation = reservationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        model.addAttribute("reservation", reservation);

        return "user/reservation-confirmation";
    }

    // ==================== MES RÉSERVATIONS ====================

    @GetMapping("/mes-reservations")
    public String mesReservations(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        User user = userService.findByEmailOptional(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<Reservation> reservations = reservationService.getReservationsClient(user.getId());

        // On vérifie pour chaque réservation terminée si elle a déjà été évaluée
        reservations.forEach(r -> {
            if (r.getStatut() == StatutReservation.TERMINE) {
                boolean isEvalue = evaluationRepository.existsByReservationId(r.getId());
                // On peut utiliser une note/commentaire existant ou juste un flag transient
                // Pour simplifier ici, on va passer une Map au modèle
            }
        });

        // Version plus propre : Passer une liste d'IDs évalués
        List<Long> evaluatedIds = reservations.stream()
                .filter(r -> r.getStatut() == StatutReservation.TERMINE)
                .map(Reservation::getId)
                .filter(id -> evaluationRepository.existsByReservationId(id))
                .toList();

        model.addAttribute("reservations", reservations);
        model.addAttribute("evaluatedIds", evaluatedIds);

        return "user/mes-reservations";
    }

    @GetMapping("/details/{id}")
    public String detailsReservation(@PathVariable Long id, Model model) {
        Reservation reservation = reservationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        model.addAttribute("reservation", reservation);

        return "user/reservation-details";
    }

    // ==================== RECHERCHE ====================

    @GetMapping("/recherche")
    public String recherche(@RequestParam(required = false) String q,
            @RequestParam(required = false) Secteur secteur,
            Model model) {

        List<ServiceFournisseur> services;
        List<Fournisseur> fournisseurs;

        if (q != null && !q.isEmpty()) {
            services = fournisseurService.rechercherServices(q);
            fournisseurs = fournisseurService.rechercher(q);
        } else if (secteur != null) {
            services = fournisseurService.getServicesBySecteur(secteur);
            fournisseurs = fournisseurService.findBySecteur(secteur);
        } else {
            services = List.of();
            fournisseurs = fournisseurService.findActifs();
        }

        model.addAttribute("query", q);
        model.addAttribute("secteur", secteur);
        model.addAttribute("services", services);
        model.addAttribute("fournisseurs", fournisseurs);

        return "user/recherche";
    }
}
