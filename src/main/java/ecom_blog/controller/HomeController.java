package ecom_blog.controller;

import ecom_blog.service.ArticleService;
import ecom_blog.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @Autowired
    private ProduitService produitService;

    @Autowired
    private ArticleService articleService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("produits", produitService.getAll());
        model.addAttribute("articles", articleService.getAll());
        return "user/index";
    }

    @GetMapping("/blog")
    public String blog(Model model) {
        model.addAttribute("articles", articleService.getAll());
        return "user/blog";
    }

    @GetMapping("/contact")
    public String contact() {
        return "user/contact";
    }

    @GetMapping("/confirmation")
    public String confirmation() {
        return "user/confirmation";
    }

    @GetMapping("/services")
    public String services() {
        return "user/services";
    }

    @GetMapping("/propos")
    public String propos() {
        return "user/propos";
    }

    @GetMapping("/objectifs")
    public String objectifs() {
        return "user/objectifs";
    }

    @GetMapping("/devis")
    public String devis() {
        return "user/devis";
    }
}
