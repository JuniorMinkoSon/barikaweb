package ecom_blog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminAuthController {

  @GetMapping("/login")
  public String showAdminLogin() {
    return "admin/login"; // ✅ Affiche login.html
  }

  // @GetMapping("/dashboard")
  // public String dashboard(Model model) {
  // model.addAttribute("stats", new HashMap<>() {{
  // put("articles", 0);
  // put("commandes", 0);
  // }});
  // return "admin/dashboard"; // ✅ Affiche dashboard.html
  // }
}
