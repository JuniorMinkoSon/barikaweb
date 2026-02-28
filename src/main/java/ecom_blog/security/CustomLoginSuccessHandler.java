package ecom_blog.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final ecom_blog.service.UserService userService;

    public CustomLoginSuccessHandler(ecom_blog.service.UserService userService) {
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        String email = authentication.getName();
        java.util.Optional<ecom_blog.model.User> userOpt = userService.findByEmailOptional(email);

        if (userOpt.isPresent() && userOpt.get().isMustChangePassword()) {
            response.sendRedirect("/change-password");
            return;
        }

        for (GrantedAuthority authority : authentication.getAuthorities()) {

            String role = authority.getAuthority();

            if ("ROLE_ADMIN".equals(role)) {
                response.sendRedirect("/admin/dashboard");
                return;
            }

            if ("ROLE_LIVREUR".equals(role)) {
                response.sendRedirect("/sejours");
                return;
            }

            if ("ROLE_FOURNISSEUR".equals(role)) {
                response.sendRedirect("/fournisseur/dashboard");
                return;
            }

            if ("ROLE_GUIDE".equals(role)) {
                response.sendRedirect("/acteur/guide");
                return;
            }

            if ("ROLE_ARTISAN".equals(role)) {
                response.sendRedirect("/acteur/artisan");
                return;
            }

            if ("ROLE_ORGANISATEUR".equals(role)) {
                response.sendRedirect("/acteur/organisateur");
                return;
            }

            if ("ROLE_MINISTERE".equals(role)) {
                response.sendRedirect("/acteur/ministere");
                return;
            }

            if ("ROLE_USER".equals(role)) {
                response.sendRedirect("/acteur/touriste");
                return;
            }
        }

        response.sendRedirect("/");
    }
}
