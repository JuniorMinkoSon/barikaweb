package ecom_blog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontProduitController {

    @GetMapping("/produits")
    public String afficherProduits() {
        return "redirect:/services";
    }

    @GetMapping("/projets")
    public String afficherProjets() {
        return "redirect:/services";
    }
}
