package ecom_blog.config;

import ecom_blog.model.Fournisseur;
import ecom_blog.model.GuideValidationRequest;
import ecom_blog.model.GuideValidationStatus;
import ecom_blog.model.BlockchainCertificate;
import ecom_blog.model.CertificateStatus;
import ecom_blog.model.EventTicketBatch;
import ecom_blog.model.AttendanceRecord;
import ecom_blog.model.Role;
import ecom_blog.model.Secteur;
import ecom_blog.model.ServiceFournisseur;
import ecom_blog.model.User;
import ecom_blog.repository.AttendanceRecordRepository;
import ecom_blog.repository.BlockchainCertificateRepository;
import ecom_blog.repository.EventTicketBatchRepository;
import ecom_blog.repository.FournisseurRepository;
import ecom_blog.repository.GuideValidationRequestRepository;
import ecom_blog.repository.ServiceFournisseurRepository;
import ecom_blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final FournisseurRepository fournisseurRepository;
    private final ServiceFournisseurRepository serviceFournisseurRepository;
    private final GuideValidationRequestRepository guideValidationRequestRepository;
    private final BlockchainCertificateRepository blockchainCertificateRepository;
    private final EventTicketBatchRepository eventTicketBatchRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("=====================================");
        log.info("DÉMARRAGE DE L'INITIALISATION");
        log.info("=====================================");

        try {
            log.info("UserRepository injecté: {}", userRepository != null);
            log.info("PasswordEncoder injecté: {}", passwordEncoder != null);

            long userCount = userRepository.count();
            log.info("Nombre d'utilisateurs existants: {}", userCount);

            String adminEmail = "admin@unevie.ci";
            log.info("Recherche de l'admin avec email: {}", adminEmail);

            User existingAdmin = userRepository.findByEmail(adminEmail);

            if (existingAdmin != null) {
                log.info("L'administrateur existe déjà!");
                log.info("   - ID: {}", existingAdmin.getId());
                log.info("   - Nom: {}", existingAdmin.getNom());
                log.info("   - Email: {}", existingAdmin.getEmail());
                log.info("   - Role: {}", existingAdmin.getRole());
            } else {
                log.info("Aucun admin trouvé, création en cours...");

                User admin = new User();
                admin.setNom("Administrateur");
                admin.setEmail(adminEmail);

                String rawPassword = "admin123";
                String encodedPassword = passwordEncoder.encode(rawPassword);
                log.info("Mot de passe encodé: {}", encodedPassword.substring(0, 20) + "...");

                admin.setPassword(encodedPassword);
                admin.setRole(Role.ROLE_ADMIN);
                admin.setTelephone("0000000000");

                log.info("Sauvegarde de l'admin...");
                userRepository.save(admin);

            }

            mettreAJourContrainteRolesUsers();
            initialiserActeursDemo();
            initialiserDonneesDemoTourisme();
            initialiserWorkflowsMvpDemo();
            normaliserImagesServicesExistants();

            userCount = userRepository.count();
            log.info(" Nombre total d'utilisateurs après initialisation: {}", userCount);

            log.info("Liste de tous les utilisateurs:");
            userRepository.findAll().forEach(user -> {
                log.info("   - ID: {}, Email: {}, Role: {}",
                        user.getId(), user.getEmail(), user.getRole());
            });

        } catch (Exception e) {
            log.error("ERREUR CRITIQUE lors de l'initialisation!", e);
            log.error("Message: {}", e.getMessage());
            log.error("Type: {}", e.getClass().getName());
            e.printStackTrace();
        }

        log.info("=====================================");
        log.info("✓ FIN DE L'INITIALISATION");
        log.info("=====================================");
    }

    private void mettreAJourContrainteRolesUsers() {
        try {
            jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            jdbcTemplate.execute("""
                    ALTER TABLE users
                    ADD CONSTRAINT users_role_check
                    CHECK (role IN (
                        'ROLE_ADMIN',
                        'ROLE_USER',
                        'ROLE_LIVREUR',
                        'ROLE_FOURNISSEUR',
                        'ROLE_GUIDE',
                        'ROLE_ARTISAN',
                        'ROLE_ORGANISATEUR',
                        'ROLE_MINISTERE'
                    ))
                    """);
            log.info("✅ Contrainte users_role_check mise à jour pour les nouveaux acteurs.");
        } catch (Exception ex) {
            log.warn("Impossible de mettre à jour users_role_check automatiquement: {}", ex.getMessage());
        }
    }

    private void initialiserActeursDemo() {
        creerActeurSiAbsent("touriste@tourismhub.ci", "Touriste Demo", Role.ROLE_USER, "0700000100");
        creerActeurSiAbsent("guide@tourismhub.ci", "Guide Demo", Role.ROLE_GUIDE, "0700000101");
        creerActeurSiAbsent("artisan@tourismhub.ci", "Artisan Demo", Role.ROLE_ARTISAN, "0700000102");
        creerActeurSiAbsent("organisateur@tourismhub.ci", "Organisateur Demo", Role.ROLE_ORGANISATEUR, "0700000103");
        creerActeurSiAbsent("ministere@tourismhub.ci", "Ministere Demo", Role.ROLE_MINISTERE, "0700000104");
        log.info("✅ Acteurs démo initialisés (mot de passe par défaut: demo123)");
    }

    private User creerActeurSiAbsent(String email, String nom, Role role, String telephone) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return user;
        }

        User nouveau = new User();
        nouveau.setEmail(email);
        nouveau.setNom(nom);
        nouveau.setRole(role);
        nouveau.setTelephone(telephone);
        nouveau.setPassword(passwordEncoder.encode("demo123"));
        nouveau.setActif(true);
        nouveau.setDisponible(true);
        return userRepository.save(nouveau);
    }

    private void initialiserDonneesDemoTourisme() {
        if (serviceFournisseurRepository.count() > 0) {
            log.info("Données services déjà présentes, seed tourisme ignoré.");
            return;
        }

        log.info("Initialisation des données démo TOURISME CI...");

        Fournisseur culturel = creerFournisseurDemo(
            "patrimoine@tourismhub.ci",
            "Patrimoine CI Expériences",
            Secteur.LOISIRS,
            "Cocody - Riviera Palmeraie",
            "Abidjan",
            "0700000001",
            "Circuits culturels et patrimoines vivants de Côte d'Ivoire.");

        Fournisseur balneaire = creerFournisseurDemo(
            "balneaire@tourismhub.ci",
            "Lagune & Océan Séjours",
            Secteur.LOISIRS,
            "Boulevard de France",
            "Assinie",
            "0700000002",
            "Séjours balnéaires, détente, sports nautiques et hôtels partenaires.");

        Fournisseur ecotourisme = creerFournisseurDemo(
            "ecotourisme@tourismhub.ci",
            "EcoTrails Côte d'Ivoire",
            Secteur.LOISIRS,
            "Quartier Commerce",
            "Daloa",
            "0700000003",
            "Parcours nature, biodiversité et tourisme durable traçable.");

        Fournisseur urbain = creerFournisseurDemo(
            "urbain@tourismhub.ci",
            "Abidjan Events Hub",
            Secteur.EVENEMENTIEL,
            "Plateau - Avenue Chardy",
            "Abidjan",
            "0700000004",
            "Agenda urbain, concerts, festivals et billetterie événementielle.");

        List<ServiceFournisseur> services = List.of(
            creerServiceDemo(culturel,
                "Circuit Patrimoine Grand-Bassam",
                "Tourisme culturel : visite guidée du patrimoine colonial, storytelling numérique et gastronomie locale.",
                95000.0, 8.4, 62, 140, 20, "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80"),
            creerServiceDemo(culturel,
                "Pass Musée des Civilisations + Guide Certifié",
                "Expérience culturelle au Musée des Civilisations de Côte d'Ivoire avec guide certifié.",
                75000.0, 8.1, 32, 95, 15, "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80"),
            creerServiceDemo(culturel,
                "MASA Arts Live Experience",
                "Immersion dans les arts du spectacle africain avec accès premium événementiel.",
                120000.0, 8.7, 49, 110, 12, "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80"),

            creerServiceDemo(balneaire,
                "Escapade Assinie-Mafia Week-end",
                "Séjour balnéaire 2 nuits : plage, activités nautiques et détente.",
                140000.0, 8.6, 88, 220, 30, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"),
            creerServiceDemo(balneaire,
                "Grand-Béréby Ocean Break",
                "Parenthèse balnéaire à Grand-Béréby avec hébergement et loisirs maritimes.",
                112000.0, 8.3, 41, 135, 18, "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80"),

            creerServiceDemo(ecotourisme,
                "Aventure Parc National de Taï",
                "Écotourisme durable : randonnée guidée et observation de la biodiversité UNESCO.",
                98000.0, 8.5, 36, 120, 14, "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80"),
            creerServiceDemo(ecotourisme,
                "Safari Comoé Nature Trail",
                "Circuit intelligent nature : découverte faune, flore et sensibilisation environnementale.",
                105000.0, 8.2, 27, 90, 14, "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80"),

            creerServiceDemo(urbain,
                "Abidjan Nightlife & Food Tour",
                "Tourisme urbain : restaurants, nightlife et expériences premium en ville.",
                89000.0, 8.0, 53, 170, 25, "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"),
            creerServiceDemo(urbain,
                "FEMUA City Event Pass",
                "Pass événementiel Abidjan : billetterie sécurisée et agenda intelligent des temps forts.",
                110000.0, 8.8, 74, 260, 30, "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"));

        serviceFournisseurRepository.saveAll(services);
        log.info("✅ Seed tourisme démo créé: {} fournisseurs, {} offres", 4, services.size());
        }

    private void initialiserWorkflowsMvpDemo() {
        User guide = userRepository.findByEmail("guide@tourismhub.ci");
        User artisan = userRepository.findByEmail("artisan@tourismhub.ci");
        User organisateur = userRepository.findByEmail("organisateur@tourismhub.ci");
        User ministere = userRepository.findByEmail("ministere@tourismhub.ci");

        if (guide != null && guideValidationRequestRepository.count() == 0) {
            GuideValidationRequest request = new GuideValidationRequest();
            request.setGuide(guide);
            request.setDossierReference("REF-GUIDE-2026-001");
            request.setStatus(GuideValidationStatus.PENDING);
            guideValidationRequestRepository.save(request);
        }

        if (artisan != null && blockchainCertificateRepository.count() == 0) {
            BlockchainCertificate certificate = new BlockchainCertificate();
            certificate.setOwner(artisan);
            certificate.setCertificateType("ARTISAN_AUTHENTICITY");
            certificate.setExternalReference("ART-2026-ABJ-01");
            certificate.setStatus(CertificateStatus.REQUESTED);
            blockchainCertificateRepository.save(certificate);
        }

        if (organisateur != null && eventTicketBatchRepository.count() == 0) {
            EventTicketBatch batch = new EventTicketBatch();
            batch.setOrganizer(organisateur);
            batch.setEventName("Festival Culture & Lagune 2026");
            batch.setEventDate(LocalDate.now().plusDays(20));
            batch.setTotalCapacity(500);
            batch.setSoldCount(35);
            eventTicketBatchRepository.save(batch);
        }

        if (ministere != null && attendanceRecordRepository.count() == 0) {
            AttendanceRecord record = new AttendanceRecord();
            record.setDeclaredBy(ministere);
            record.setZone("Grand-Bassam");
            record.setObservationDate(LocalDate.now().minusDays(1));
            record.setVisitorsCount(1240);
            record.setSourceChannel("Compteurs + Billetterie");
            attendanceRecordRepository.save(record);
        }

        if (ministere != null && blockchainCertificateRepository.count() == 1) {
            BlockchainCertificate issued = new BlockchainCertificate();
            issued.setOwner(guide != null ? guide : ministere);
            issued.setCertificateType("GUIDE_LICENSE");
            issued.setExternalReference("GUIDE-2026-CI-VALID");
            issued.setStatus(CertificateStatus.ISSUED);
            issued.setIssuedBy(ministere);
            issued.setIssuedAt(LocalDateTime.now().minusDays(2));
            issued.setCertificateHash("demo-hash-guide-2026");
            blockchainCertificateRepository.save(issued);
        }

        log.info("✅ Seed workflows MVP prêt (validation, certificat, billetterie, fréquentation)");
    }

    private void normaliserImagesServicesExistants() {
        List<ServiceFournisseur> services = serviceFournisseurRepository.findAll();
        if (services.isEmpty()) {
            return;
        }

        int misAJour = 0;
        for (ServiceFournisseur service : services) {
            String imageUrl = service.getImageUrl();
            boolean imageWebValide = imageUrl != null
                    && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));

            if (imageWebValide) {
                continue;
            }

            service.setImageUrl(urlParDefautParSecteur(service.getSecteur()));
            misAJour++;
        }

        if (misAJour > 0) {
            serviceFournisseurRepository.saveAll(services);
            log.info("✅ Migration images: {} service(s) normalisé(s) vers des URLs web stables.", misAJour);
        } else {
            log.info("Migration images: aucune correction nécessaire.");
        }
    }

    private String urlParDefautParSecteur(Secteur secteur) {
        if (secteur == null) {
            return "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80";
        }

        return switch (secteur) {
            case VOITURE -> "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";
            case ALIMENTAIRE -> "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80";
            case EVENEMENTIEL -> "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80";
            case LOISIRS -> "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80";
        };
    }

        private Fournisseur creerFournisseurDemo(String email,
            String nomEntreprise,
            Secteur secteur,
            String adresse,
            String ville,
            String telephone,
            String description) {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setNom(nomEntreprise);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("demo123"));
            user.setTelephone(telephone);
            user.setRole(Role.ROLE_FOURNISSEUR);
            user = userRepository.save(user);
        }

        final User fournisseurUser = user;

        return fournisseurRepository.findByUserId(fournisseurUser.getId()).orElseGet(() -> {
            Fournisseur fournisseur = new Fournisseur();
            fournisseur.setUser(fournisseurUser);
            fournisseur.setNomEntreprise(nomEntreprise);
            fournisseur.setSecteur(secteur);
            fournisseur.setAdresse(adresse);
            fournisseur.setVille(ville);
            fournisseur.setTelephone(telephone);
            fournisseur.setDescription(description);
            fournisseur.setActif(true);
            fournisseur.setContratAccepte(true);
            return fournisseurRepository.save(fournisseur);
        });
        }

        private ServiceFournisseur creerServiceDemo(Fournisseur fournisseur,
            String nom,
            String description,
            double prix,
            double note,
            int avis,
            int reservations,
            int capacite,
            String image) {

        ServiceFournisseur service = new ServiceFournisseur();
        service.setFournisseur(fournisseur);
        service.setSecteur(fournisseur.getSecteur());
        service.setNom(nom);
        service.setDescription(description);
        service.setPrix(prix);
        service.setPrixParJour(prix / 2);
        service.setDisponible(true);
        service.setNoteMoyenne(note);
        service.setNombreAvis(avis);
        service.setNombreReservations(reservations);
        service.setCapacite(capacite);
        service.setDuree(4);
        service.setImageUrl(image);
        return service;
        }
}