package ecom_blog.controller;

import ecom_blog.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/acteur")
public class ActeurController {

    @GetMapping("/touriste")
    public String touriste(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("acteurTitre", "Espace Touriste");
        model.addAttribute("acteurMission", "Explorer des parcours culture + plage + nature + événements selon vos préférences.");
        model.addAttribute("acteurActions",
                new String[] {
                        "Rechercher des séjours personnalisés",
                        "Réserver des expériences en toute sécurité",
                        "Suivre vos billets et preuves de réservation",
                        "Laisser un avis traçable"
                });
        model.addAttribute("acteurUser", userDetails != null ? userDetails.getUser() : null);
                model.addAttribute("workflowUrl", "/acteur/workflows");
        return "user/acteur-dashboard";
    }

    @GetMapping("/guide")
    public String guide(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("acteurTitre", "Espace Guide Touristique");
        model.addAttribute("acteurMission", "Proposer des circuits certifiés et valoriser le patrimoine local.");
        model.addAttribute("acteurActions",
                new String[] {
                        "Publier des circuits et créneaux disponibles",
                        "Afficher votre statut certifié",
                        "Gérer les réservations des touristes",
                        "Suivre les notes et retours"
                });
        model.addAttribute("acteurUser", userDetails != null ? userDetails.getUser() : null);
                model.addAttribute("workflowUrl", "/acteur/workflows");
        return "user/acteur-dashboard";
    }

    @GetMapping("/artisan")
    public String artisan(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("acteurTitre", "Espace Artisan / Acteur culturel");
        model.addAttribute("acteurMission", "Mettre en avant l'artisanat local avec traçabilité et authenticité.");
        model.addAttribute("acteurActions",
                new String[] {
                        "Publier des offres culturelles et ateliers",
                        "Attacher une preuve d'authenticité",
                        "Gérer les commandes et réservations",
                        "Suivre les performances"
                });
        model.addAttribute("acteurUser", userDetails != null ? userDetails.getUser() : null);
                model.addAttribute("workflowUrl", "/acteur/workflows");
        return "user/acteur-dashboard";
    }

    @GetMapping("/organisateur")
    public String organisateur(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("acteurTitre", "Espace Organisateur d'événement");
        model.addAttribute("acteurMission", "Créer et piloter des événements avec billetterie sécurisée.");
        model.addAttribute("acteurActions",
                new String[] {
                        "Publier l'agenda des événements",
                        "Gérer les billets et accès",
                        "Suivre le remplissage en temps réel",
                        "Analyser la fréquentation"
                });
        model.addAttribute("acteurUser", userDetails != null ? userDetails.getUser() : null);
                model.addAttribute("workflowUrl", "/acteur/workflows");
        return "user/acteur-dashboard";
    }

    @GetMapping("/ministere")
    public String ministere(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("acteurTitre", "Dashboard Ministère du Tourisme");
        model.addAttribute("acteurMission", "Piloter la stratégie nationale à partir des données touristiques.");
        model.addAttribute("acteurActions",
                new String[] {
                        "Consulter les flux touristiques",
                        "Identifier les zones sous-exploitées",
                        "Observer les pics saisonniers",
                        "Estimer l'impact économique"
                });
        model.addAttribute("acteurUser", userDetails != null ? userDetails.getUser() : null);
                model.addAttribute("workflowUrl", "/acteur/workflows");
        return "user/acteur-dashboard";
    }
}
