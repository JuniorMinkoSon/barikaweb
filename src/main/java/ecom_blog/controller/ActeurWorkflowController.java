package ecom_blog.controller;

import ecom_blog.model.User;
import ecom_blog.security.CustomUserDetails;
import ecom_blog.service.MvpWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;

@Controller
@RequestMapping("/acteur/workflows")
@RequiredArgsConstructor
public class ActeurWorkflowController {

    private final MvpWorkflowService mvpWorkflowService;

    @GetMapping
    public String workflows(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        User user = userDetails.getUser();

        model.addAttribute("acteurUser", user);
        model.addAttribute("guideRequests", mvpWorkflowService.guideRequests(user));
        model.addAttribute("myCertificates", mvpWorkflowService.certificatesByOwner(user));
        model.addAttribute("myEvents", mvpWorkflowService.eventsByOrganizer(user));

        model.addAttribute("pendingGuideRequests", mvpWorkflowService.pendingGuideValidations());
        model.addAttribute("pendingCertificates", mvpWorkflowService.pendingCertificates());
        model.addAttribute("attendanceRecords", mvpWorkflowService.recentAttendance());
        return "user/acteur-workflows";
    }

    @PostMapping("/guide/submit")
    public String submitGuideValidation(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String dossierReference,
            RedirectAttributes redirectAttributes) {
        mvpWorkflowService.submitGuideValidation(userDetails.getUser(), dossierReference);
        redirectAttributes.addFlashAttribute("successMessage", "Demande de validation guide envoyée.");
        return "redirect:/acteur/workflows";
    }

    @PostMapping("/guide/{id}/review")
    public String reviewGuideValidation(@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestParam boolean approve,
            @RequestParam(required = false) String note,
            RedirectAttributes redirectAttributes) {
        User reviewer = userDetails.getUser();
        if (reviewer.getRole() != ecom_blog.model.Role.ROLE_MINISTERE && reviewer.getRole() != ecom_blog.model.Role.ROLE_ADMIN) {
            redirectAttributes.addFlashAttribute("errorMessage", "Action réservée au ministère.");
            return "redirect:/acteur/workflows";
        }

        mvpWorkflowService.reviewGuideValidation(id, approve, note, reviewer);
        redirectAttributes.addFlashAttribute("successMessage", "Demande guide traitée.");
        return "redirect:/acteur/workflows";
    }

    @PostMapping("/certificate/request")
    public String requestCertificate(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String certificateType,
            @RequestParam String externalReference,
            RedirectAttributes redirectAttributes) {
        mvpWorkflowService.requestCertificate(userDetails.getUser(), certificateType, externalReference);
        redirectAttributes.addFlashAttribute("successMessage", "Demande de certificat enregistrée.");
        return "redirect:/acteur/workflows";
    }

    @PostMapping("/certificate/{id}/issue")
    public String issueCertificate(@AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            RedirectAttributes redirectAttributes) {
        User issuer = userDetails.getUser();
        if (issuer.getRole() != ecom_blog.model.Role.ROLE_MINISTERE && issuer.getRole() != ecom_blog.model.Role.ROLE_ADMIN) {
            redirectAttributes.addFlashAttribute("errorMessage", "Action réservée au ministère.");
            return "redirect:/acteur/workflows";
        }

        mvpWorkflowService.issueCertificate(id, issuer);
        redirectAttributes.addFlashAttribute("successMessage", "Certificat émis avec hash de traçabilité.");
        return "redirect:/acteur/workflows";
    }

    @PostMapping("/ticket/create")
    public String createTicketBatch(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String eventName,
            @RequestParam String eventDate,
            @RequestParam Integer totalCapacity,
            RedirectAttributes redirectAttributes) {
        mvpWorkflowService.createEventBatch(userDetails.getUser(), eventName, LocalDate.parse(eventDate), totalCapacity);
        redirectAttributes.addFlashAttribute("successMessage", "Billetterie événement créée.");
        return "redirect:/acteur/workflows";
    }

    @PostMapping("/ticket/{id}/sell")
    public String sellTickets(@PathVariable Long id,
            @RequestParam Integer quantity,
            RedirectAttributes redirectAttributes) {
        try {
            mvpWorkflowService.sellTickets(id, quantity);
            redirectAttributes.addFlashAttribute("successMessage", "Vente de billets enregistrée.");
        } catch (Exception exception) {
            redirectAttributes.addFlashAttribute("errorMessage", exception.getMessage());
        }
        return "redirect:/acteur/workflows";
    }

    @PostMapping("/attendance/add")
    public String addAttendance(@AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String zone,
            @RequestParam String observationDate,
            @RequestParam Integer visitorsCount,
            @RequestParam String sourceChannel,
            RedirectAttributes redirectAttributes) {
        mvpWorkflowService.addAttendance(
                userDetails.getUser(),
                zone,
                LocalDate.parse(observationDate),
                visitorsCount,
                sourceChannel);

        redirectAttributes.addFlashAttribute("successMessage", "Fréquentation enregistrée.");
        return "redirect:/acteur/workflows";
    }
}
