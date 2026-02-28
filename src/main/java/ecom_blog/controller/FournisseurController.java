package ecom_blog.controller;

import ecom_blog.dto.CreateServiceDto;
import ecom_blog.model.*;
import ecom_blog.service.FournisseurService;
import ecom_blog.service.ReservationService;
import ecom_blog.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping("/fournisseur")
public class FournisseurController {

        @Autowired
        private FournisseurService fournisseurService;

        @Autowired
        private ReservationService reservationService;

        @Autowired
        private UserService userService;

        // ==================== DASHBOARD ====================

        @GetMapping("/dashboard")
        public String dashboard(@AuthenticationPrincipal UserDetails userDetails, Model model) {
                User user = userService.findByEmailOptional(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                Fournisseur fournisseur = fournisseurService.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Profil fournisseur non trouvé"));

                if (!fournisseur.isContratAccepte()) {
                        return "redirect:/fournisseur/contrat";
                }

                // Statistiques Réservations
                long reservationsEnCours = reservationService.countByFournisseurAndStatut(
                                fournisseur.getId(), StatutReservation.EN_COURS);
                long reservationsAcceptees = reservationService.countByFournisseurAndStatut(
                                fournisseur.getId(), StatutReservation.ACCEPTE);
                long totalServices = fournisseurService.countByFournisseur(fournisseur.getId());
                double revenusNets = reservationService.getRevenusNetByFournisseur(fournisseur.getId());

                // Listes
                List<Reservation> reservationsEnAttente = reservationService.getReservationsEnCours(fournisseur);

                model.addAttribute("fournisseur", fournisseur);

                // Stats
                model.addAttribute("reservationsEnCours", reservationsEnCours);
                model.addAttribute("reservationsAcceptees", reservationsAcceptees); // Note: pourrait inclure les
                                                                                    // commandes
                model.addAttribute("totalServices", totalServices);
                model.addAttribute("revenusNets", revenusNets); // TODO: Ajouter revenus commandes

                // Listes
                model.addAttribute("reservationsEnAttente", reservationsEnAttente);

                return "fournisseur/dashboard";
        }

        // ==================== GESTION DES SERVICES ====================

        @GetMapping("/services")
        public String listServices(@AuthenticationPrincipal UserDetails userDetails, Model model) {
                User user = userService.findByEmailOptional(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                Fournisseur fournisseur = fournisseurService.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Profil fournisseur non trouvé"));

                if (!fournisseur.isContratAccepte()) {
                        return "redirect:/fournisseur/contrat";
                }

                List<ServiceFournisseur> services = fournisseurService.getServicesByFournisseur(fournisseur);

                model.addAttribute("fournisseur", fournisseur);
                model.addAttribute("services", services);
                model.addAttribute("serviceDto", new CreateServiceDto());

                return "fournisseur/services";
        }

        @PostMapping("/services/add")
        public String addService(@AuthenticationPrincipal UserDetails userDetails,
                        @Valid @ModelAttribute("serviceDto") CreateServiceDto dto,
                        BindingResult result,
                        @RequestParam(value = "images", required = false) List<MultipartFile> images,
                        Model model) {

                if (result.hasErrors()) {
                        return "fournisseur/services";
                }

                User user = userService.findByEmailOptional(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                Fournisseur fournisseur = fournisseurService.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Profil fournisseur non trouvé"));

                ServiceFournisseur service = new ServiceFournisseur();
                service.setNom(dto.getNom());
                service.setDescription(dto.getDescription());
                service.setPrix(dto.getPrix());
                service.setPrixParJour(dto.getPrixParJour());
                service.setDuree(dto.getDuree());
                service.setCapacite(dto.getCapacite());
                service.setDisponible(true);

                fournisseurService.ajouterService(fournisseur, service, images);

                return "redirect:/fournisseur/services";
        }

        @PostMapping("/services/{id}/toggle")
        public String toggleServiceDisponibility(@PathVariable Long id) {
                ServiceFournisseur service = fournisseurService.findServiceById(id)
                                .orElseThrow(() -> new RuntimeException("Service non trouvé"));

                service.setDisponible(!service.isDisponible());
                fournisseurService.updateService(service);

                return "redirect:/fournisseur/services";
        }

        @PostMapping("/services/{id}/delete")
        public String deleteService(@PathVariable Long id) {
                fournisseurService.deleteService(id);
                return "redirect:/fournisseur/services";
        }

        // ==================== GESTION DES RÉSERVATIONS ====================

        @GetMapping("/reservations")
        public String listReservations(@AuthenticationPrincipal UserDetails userDetails, Model model) {
                User user = userService.findByEmailOptional(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                Fournisseur fournisseur = fournisseurService.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Profil fournisseur non trouvé"));

                if (!fournisseur.isContratAccepte()) {
                        return "redirect:/fournisseur/contrat";
                }

                List<Reservation> reservations = reservationService.getReservationsFournisseur(fournisseur.getId());

                model.addAttribute("fournisseur", fournisseur);
                model.addAttribute("reservations", reservations);

                return "fournisseur/reservations";
        }

        @PostMapping("/reservations/{id}/accepter")
        public String accepterReservation(@PathVariable Long id) {
                reservationService.accepterReservation(id);
                return "redirect:/fournisseur/reservations";
        }

        @PostMapping("/reservations/{id}/refuser")
        public String refuserReservation(@PathVariable Long id,
                        @RequestParam(required = false) String motif) {
                reservationService.refuserReservation(id, motif);
                return "redirect:/fournisseur/reservations";
        }

        @PostMapping("/reservations/{id}/terminer")
        public String terminerReservation(@PathVariable Long id) {
                reservationService.terminerReservation(id);
                return "redirect:/fournisseur/reservations";
        }

        // ==================== CONTRAT ====================

        @GetMapping("/contrat")
        public String voirContrat(@AuthenticationPrincipal UserDetails userDetails, Model model) {
                User user = userService.findByEmailOptional(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                Fournisseur fournisseur = fournisseurService.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Profil fournisseur non trouvé"));

                ContratFournisseur contrat = fournisseurService.getContrat(fournisseur)
                                .orElseThrow(() -> new RuntimeException("Contrat non trouvé"));

                model.addAttribute("fournisseur", fournisseur);
                model.addAttribute("contrat", contrat);

                return "fournisseur/contrat";
        }

        @PostMapping("/contrat/signer")
        public String signerContrat(@AuthenticationPrincipal UserDetails userDetails) {
                User user = userService.findByEmailOptional(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                Fournisseur fournisseur = fournisseurService.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Profil fournisseur non trouvé"));

                fournisseurService.signerContrat(fournisseur.getId());

                return "redirect:/fournisseur/dashboard";
        }

        // ==================== PROFIL ====================

        @GetMapping("/profil")
        public String voirProfil(@AuthenticationPrincipal UserDetails userDetails, Model model) {
                User user = userService.findByEmailOptional(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                Fournisseur fournisseur = fournisseurService.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Profil fournisseur non trouvé"));

                if (!fournisseur.isContratAccepte()) {
                        return "redirect:/fournisseur/contrat";
                }

                model.addAttribute("fournisseur", fournisseur);
                model.addAttribute("user", user);

                return "fournisseur/profil";
        }
}
