package ecom_blog.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {

    @GetMapping("/redirect")
    public String redirectAfterLogin(Authentication auth) {
        var roles = AuthorityUtils.authorityListToSet(auth.getAuthorities());
        if (roles.contains("ROLE_ADMIN")) return "redirect:/admin/dashboard";
        if (roles.contains("ROLE_MINISTERE")) return "redirect:/acteur/ministere";
        if (roles.contains("ROLE_GUIDE")) return "redirect:/acteur/guide";
        if (roles.contains("ROLE_ARTISAN")) return "redirect:/acteur/artisan";
        if (roles.contains("ROLE_ORGANISATEUR")) return "redirect:/acteur/organisateur";
        if (roles.contains("ROLE_USER")) return "redirect:/acteur/touriste";
        return "redirect:/login?error";
    }
}
