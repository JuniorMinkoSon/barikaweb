package ecom_blog.controller;

import ecom_blog.dto.WeekendDealDto;
import ecom_blog.model.Categorie;
import ecom_blog.model.ServiceFournisseur;
import ecom_blog.repository.ServiceFournisseurRepository;
import ecom_blog.service.ArticleService;
import ecom_blog.service.CategorieService;
import ecom_blog.service.SearchService;
import ecom_blog.util.SearchItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private ArticleService articleService;
    @Autowired
    private CategorieService categorieService;
    @Autowired
    private ServiceFournisseurRepository serviceFournisseurRepository;
    @Autowired
    private SearchService searchService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("articles", articleService.getAll());

        // 🔥 Services Populaires (Top Rated ou Most Reserved)
        List<ServiceFournisseur> topServices = serviceFournisseurRepository.findTopRated();
        if (topServices.isEmpty()) {
            topServices = serviceFournisseurRepository.findMostPopular();
        }
        // Limiter à 4 services
        if (topServices.size() > 4) {
            topServices = topServices.subList(0, 4);
        }
        model.addAttribute("topServices", topServices);

        LocalDate dealStart = prochainVendredi(LocalDate.now());
        LocalDate dealEnd = dealStart.plusDays(2);
        int nights = 2;

        List<WeekendDealDto> weekendDeals = topServices.stream()
                .map(service -> {
                    double basePrice = service.getPrixParJour() != null
                            ? service.getPrixParJour()
                            : (service.getPrix() != null ? service.getPrix() : 0.0);
                    double originalPrice = basePrice * nights;
                    int discountPercent = 20;
                    double dealPrice = originalPrice * (1 - (discountPercent / 100.0));

                    double rating = service.getNoteMoyenne() != null ? service.getNoteMoyenne() : 0.0;
                    String ratingLabel = rating >= 8.0 ? "Très bien" : (rating >= 7.0 ? "Bien" : "Correct");

                    return new WeekendDealDto(
                            service,
                            dealStart,
                            dealEnd,
                            nights,
                            originalPrice,
                            dealPrice,
                            discountPercent,
                            ratingLabel);
                })
                .toList();

        model.addAttribute("weekendDeals", weekendDeals);

        return "user/index";
    }

    private LocalDate prochainVendredi(LocalDate from) {
        int diff = DayOfWeek.FRIDAY.getValue() - from.getDayOfWeek().getValue();
        if (diff <= 0) {
            diff += 7;
        }
        return from.plusDays(diff);
    }

    @GetMapping("/blog")
    public String blog(Model model) {
        model.addAttribute("articles", articleService.getAll());
        return "user/blog";
    }

    // 🏷️ Articles par catégorie (public)
    @GetMapping("/blog/categorie/{id}")
    public String articlesByCategory(@PathVariable Long id, Model model) {
        model.addAttribute("articles", articleService.findByCategory(id)); // Retourne des DTOs
        model.addAttribute("categories", categorieService.findAll());

        // Récupérer la catégorie actuelle pour l'afficher
        Categorie currentCategory = categorieService.findById(id);
        model.addAttribute("currentCategory", currentCategory);

        return "user/articles-par-categorie";
    }

    // 📖 Détail d'un article spécifique
    @GetMapping("/blog/article/{id}")
    public String articleDetail(@PathVariable Long id, Model model) {
        model.addAttribute("article", articleService.findById(id));
        return "user/article-details";
    }

    // 🔍 Recherche universelle utilisant l'algorithme ABR (Arbre Binaire de
    // Recherche)
    @GetMapping("/universal-search")
    public String universalSearch(@RequestParam(required = false) String q, Model model) {
        List<SearchItem> results = searchService.search(q);
        model.addAttribute("results", results);
        model.addAttribute("query", q);

        // Explications de l'algo (pour le plaisir de l'utilisateur)
        model.addAttribute("algoInfo", "Recherche optimisée par Arbre Binaire de Recherche (ABR)");

        return "user/universal-search-results";
    }
    // @GetMapping("/produits")
    // public String produits(Model model) {
    // model.addAttribute("produits", produitService.getAll());
    // return "user/product-list";
    // }

    @GetMapping("/contact")
    public String contact() {
        return "user/contact";
    }

    @GetMapping("/services")
    public String services() {
        return "user/services";
    }

    @GetMapping("/propos")
    public String propos() {
        return "user/propos";
    }

    @GetMapping("/projets")
    public String projets() {
        return "redirect:/sejours";
    }

    @GetMapping("/objectifs")
    public String objectifs() {
        return "user/objectifs";
    }

    @GetMapping("/faq")
    public String faq() {
        return "user/faq";
    }

    @GetMapping("/mentions-legales")
    public String mentionsLegales() {
        return "user/mentions-legales";
    }

    @GetMapping("/politique")
    public String politique() {
        return "user/politique";
    }

    @GetMapping("/tourisme-categories")
    public String tourismeCategories() {
        return "user/tourisme-categories";
    }

}
