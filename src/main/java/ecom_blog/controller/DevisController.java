package ecom_blog.controller;

import ecom_blog.model.Devis;
import ecom_blog.service.DevisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/devis")
public class DevisController {

    @Autowired
    private DevisService devisService;

    @PostMapping("/envoyer")
    public String envoyerDevis(@ModelAttribute Devis devis, RedirectAttributes redirectAttributes) {
        try {
            devisService.save(devis);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Votre demande de devis a été envoyée avec succès. Nous vous répondrons sous 24h.");
            return "redirect:/devis?success=true";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.");
            return "redirect:/devis?error=true";
        }
    }
}
