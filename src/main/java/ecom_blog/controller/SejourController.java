package ecom_blog.controller;

import ecom_blog.model.Secteur;
import ecom_blog.model.ServiceFournisseur;
import ecom_blog.service.SejourSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;

@Controller
public class SejourController {

    @Autowired
    private SejourSearchService sejourSearchService;

    @GetMapping("/sejours")
    public String rechercherSejours(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateArrivee,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDepart,
            @RequestParam(required = false, defaultValue = "2") Integer voyageurs,
            @RequestParam(required = false) Secteur secteur,
            @RequestParam(required = false) Double budgetMax,
            Model model) {

        List<ServiceFournisseur> resultats = sejourSearchService.rechercher(
                destination,
                dateArrivee,
                dateDepart,
                voyageurs,
                secteur,
                budgetMax);

        model.addAttribute("resultats", resultats);
        model.addAttribute("destination", destination);
        model.addAttribute("dateArrivee", dateArrivee);
        model.addAttribute("dateDepart", dateDepart);
        model.addAttribute("voyageurs", voyageurs);
        model.addAttribute("secteur", secteur);
        model.addAttribute("budgetMax", budgetMax);
        model.addAttribute("secteurs", Secteur.values());

        return "user/sejours";
    }
}
