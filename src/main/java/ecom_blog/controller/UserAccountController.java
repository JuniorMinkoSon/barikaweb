package ecom_blog.controller;

import ecom_blog.model.Reservation;
import ecom_blog.model.User;
import ecom_blog.security.CustomUserDetails;
import ecom_blog.service.ReservationService;
import ecom_blog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/user")
public class UserAccountController {

    @Autowired
    private UserService userService;

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/profil")
    public String profil(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        if (userDetails == null)
            return "redirect:/login";
        model.addAttribute("user", userDetails.getUser());
        return "user/profil";
    }

    @PostMapping("/profil/update")
    public String updateProfil(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String nom,
            @RequestParam String telephone) {
        if (userDetails == null)
            return "redirect:/login";
        userService.updateProfile(userDetails.getUser().getId(), nom, telephone);

        // Mettre à jour l'objet en session
        userDetails.getUser().setNom(nom);
        userDetails.getUser().setTelephone(telephone);

        return "redirect:/user/profil?success=true";
    }

    @GetMapping("/favoris")
    public String favoris(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        if (userDetails == null)
            return "redirect:/login";
        return "user/favoris";
    }

    @GetMapping("/paiements")
    public String paiements(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        if (userDetails == null)
            return "redirect:/login";

        User user = userDetails.getUser();
        List<Reservation> reservations = reservationService.getReservationsClient(user.getId());

        model.addAttribute("commandes", List.of());
        model.addAttribute("reservations", reservations);

        return "user/paiements";
    }
}
