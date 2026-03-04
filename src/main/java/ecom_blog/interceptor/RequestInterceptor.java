package ecom_blog.interceptor;

import ecom_blog.model.PanierItem;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Component
public class RequestInterceptor implements HandlerInterceptor {

    @SuppressWarnings("unchecked")
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) {
        if (modelAndView != null && !modelAndView.getViewName().startsWith("redirect:")) {
            modelAndView.addObject("currentUri", request.getRequestURI());

            HttpSession session = request.getSession();
            List<PanierItem> panier = (List<PanierItem>) session.getAttribute("panier");
            int cartCount = 0;
            if (panier != null) {
                cartCount = panier.stream().mapToInt(PanierItem::getQuantite).sum();
            }
            modelAndView.addObject("cartCount", cartCount);
        }
    }
}
