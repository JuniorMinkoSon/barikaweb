package ecom_blog.controller;

import ecom_blog.model.Produit;
import ecom_blog.service.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin/produits")
public class AdminProduitController {

    private final ProduitService service;

    /** LIST **/
    @GetMapping
    public String list(Model model) {
        model.addAttribute("produits", service.getAll());
        return "admin/produits";
    }

    /** ADD FORM **/
    @GetMapping("/add")
    public String addForm(Model model) {
        model.addAttribute("produit", new Produit());
        return "admin/add-product";
    }

    /** SAVE (create) **/
    @PostMapping("/save")
    public String save(@ModelAttribute Produit produit,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        service.save(produit, image);
        return "redirect:/admin/produits";
    }

    /** EDIT FORM **/
    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        Produit p = service.findById(id);
        if (p == null)
            return "redirect:/admin/produits";
        model.addAttribute("produit", p);
        return "admin/edit-product";
    }

    /** UPDATE (save edit) **/
    @PostMapping("/update/{id}")
    public String update(@PathVariable Long id,
            @ModelAttribute Produit produit,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        produit.setId(id);
        // Keep old image if no new one uploaded
        if (image == null || image.isEmpty()) {
            Produit existing = service.findById(id);
            if (existing != null)
                produit.setImageUrl(existing.getImageUrl());
        }
        service.save(produit, image);
        return "redirect:/admin/produits";
    }

    /** DELETE **/
    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteById(id);
        return "redirect:/admin/produits";
    }
}
