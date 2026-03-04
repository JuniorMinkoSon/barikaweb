package ecom_blog.controller;

import ecom_blog.model.*;
import ecom_blog.service.CommandeService;
import ecom_blog.service.ProduitService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/panier")
@SuppressWarnings("unchecked")
public class CommandeController {

    private final ProduitService produitService;
    private final CommandeService commandeService;

    /** AJOUTER AU PANIER **/
    @PostMapping("/ajouter/{id}")
    public String ajouterPanier(@PathVariable Long id, HttpSession session,
            jakarta.servlet.http.HttpServletRequest request) {
        List<PanierItem> panier = (List<PanierItem>) session.getAttribute("panier");
        if (panier == null)
            panier = new ArrayList<>();

        Optional<PanierItem> existingItem = panier.stream()
                .filter(item -> item.getProduit().getId().equals(id))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantite(existingItem.get().getQuantite() + 1);
        } else {
            Produit p = produitService.findById(id);
            if (p != null) {
                panier.add(new PanierItem(p, 1));
            }
        }

        session.setAttribute("panier", panier);
        String referer = request.getHeader("Referer");
        return "redirect:" + (referer != null ? referer : "/produits")
                + (referer != null && referer.contains("?") ? "&added=true" : "?added=true");
    }

    /** MODIFIER QUANTITÉ **/
    @PostMapping("/modifier/{id}")
    public String modifierQuantite(@PathVariable Long id, @RequestParam int action, HttpSession session) {
        List<PanierItem> panier = (List<PanierItem>) session.getAttribute("panier");
        if (panier != null) {
            panier.stream()
                    .filter(item -> item.getProduit().getId().equals(id))
                    .findFirst()
                    .ifPresent(item -> {
                        if (action > 0) {
                            item.setQuantite(item.getQuantite() + 1);
                        } else if (item.getQuantite() > 1) {
                            item.setQuantite(item.getQuantite() - 1);
                        }
                    });
            session.setAttribute("panier", panier); // ✅ Force la persistance en session
        }
        return "redirect:/panier";
    }

    /** SUPPRIMER DU PANIER **/
    @PostMapping("/supprimer/{id}")
    public String supprimerPanier(@PathVariable Long id, HttpSession session) {
        List<PanierItem> panier = (List<PanierItem>) session.getAttribute("panier");
        if (panier != null) {
            panier.removeIf(item -> item.getProduit().getId().equals(id));
            session.setAttribute("panier", panier); // ✅ Force la persistance en session
        }
        return "redirect:/panier";
    }

    /** AFFICHER LE PANIER **/
    @GetMapping
    public String afficherPanier(Model model, HttpSession session) {
        List<PanierItem> panier = (List<PanierItem>) session.getAttribute("panier");
        double total = 0;

        if (panier != null) {
            total = panier.stream().mapToDouble(PanierItem::getTotal).sum();
        }

        model.addAttribute("panier", panier != null ? panier : new ArrayList<>());
        model.addAttribute("total", total);

        return "user/panier";
    }

    /** VALIDER LA COMMANDE **/
    @PostMapping("/valider")
    public String validerCommande(HttpSession session, @RequestParam String modePaiement) {
        List<PanierItem> panier = (List<PanierItem>) session.getAttribute("panier");

        if (panier == null || panier.isEmpty())
            return "redirect:/panier?error=vide";

        User user = (User) session.getAttribute("user");

        Commande commande = new Commande();
        commande.setUser(user);
        commande.setModePaiement(modePaiement);
        commande.setStatut("EN_ATTENTE");

        double total = 0;
        List<CommandeItem> items = new ArrayList<>();

        for (PanierItem pItem : panier) {
            Produit managedProduit = produitService.findById(pItem.getProduit().getId());
            if (managedProduit == null) {
                return "redirect:/panier?error=produit_absent";
            }

            total += managedProduit.getPrix() * pItem.getQuantite();

            CommandeItem item = new CommandeItem();
            item.setCommande(commande);
            item.setProduit(managedProduit);
            item.setPrix(managedProduit.getPrix());
            item.setQuantite(pItem.getQuantite());

            items.add(item);
        }

        commande.setTotal(total);
        commande.setItems(items);

        commandeService.save(commande);
        session.removeAttribute("panier");

        return "redirect:/confirmation?success=true";
    }
}
