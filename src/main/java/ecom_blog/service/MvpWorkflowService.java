package ecom_blog.service;

import ecom_blog.model.*;
import ecom_blog.repository.AttendanceRecordRepository;
import ecom_blog.repository.BlockchainCertificateRepository;
import ecom_blog.repository.EventTicketBatchRepository;
import ecom_blog.repository.GuideValidationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MvpWorkflowService {

    private final GuideValidationRequestRepository guideValidationRepository;
    private final BlockchainCertificateRepository certificateRepository;
    private final EventTicketBatchRepository eventTicketBatchRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;

    @Transactional
    public GuideValidationRequest submitGuideValidation(User guide, String dossierReference) {
        GuideValidationRequest request = new GuideValidationRequest();
        request.setGuide(guide);
        request.setDossierReference(dossierReference);
        request.setStatus(GuideValidationStatus.PENDING);
        return guideValidationRepository.save(request);
    }

    @Transactional
    public GuideValidationRequest reviewGuideValidation(Long requestId, boolean approve, String note, User reviewer) {
        GuideValidationRequest request = guideValidationRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Demande de validation introuvable"));

        request.setStatus(approve ? GuideValidationStatus.APPROVED : GuideValidationStatus.REJECTED);
        request.setNote(note);
        request.setReviewedBy(reviewer);
        request.setReviewedAt(LocalDateTime.now());
        return guideValidationRepository.save(request);
    }

    @Transactional
    public BlockchainCertificate requestCertificate(User owner, String type, String externalReference) {
        BlockchainCertificate certificate = new BlockchainCertificate();
        certificate.setOwner(owner);
        certificate.setCertificateType(type);
        certificate.setExternalReference(externalReference);
        certificate.setStatus(CertificateStatus.REQUESTED);
        return certificateRepository.save(certificate);
    }

    @Transactional
    public BlockchainCertificate issueCertificate(Long certificateId, User issuer) {
        BlockchainCertificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new IllegalArgumentException("Certificat introuvable"));

        certificate.setCertificateHash(genererHash(certificate));
        certificate.setStatus(CertificateStatus.ISSUED);
        certificate.setIssuedBy(issuer);
        certificate.setIssuedAt(LocalDateTime.now());
        return certificateRepository.save(certificate);
    }

    @Transactional
    public EventTicketBatch createEventBatch(User organizer, String eventName, LocalDate eventDate, Integer totalCapacity) {
        EventTicketBatch batch = new EventTicketBatch();
        batch.setOrganizer(organizer);
        batch.setEventName(eventName);
        batch.setEventDate(eventDate);
        batch.setTotalCapacity(totalCapacity);
        batch.setSoldCount(0);
        return eventTicketBatchRepository.save(batch);
    }

    @Transactional
    public EventTicketBatch sellTickets(Long batchId, int quantity) {
        EventTicketBatch batch = eventTicketBatchRepository.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Billetterie introuvable"));

        int sold = batch.getSoldCount() != null ? batch.getSoldCount() : 0;
        int capacity = batch.getTotalCapacity() != null ? batch.getTotalCapacity() : 0;

        if (sold + quantity > capacity) {
            throw new IllegalArgumentException("Capacité dépassée pour cette vente");
        }

        batch.setSoldCount(sold + quantity);
        return eventTicketBatchRepository.save(batch);
    }

    @Transactional
    public AttendanceRecord addAttendance(User declaredBy, String zone, LocalDate observationDate, Integer visitorsCount,
            String sourceChannel) {
        AttendanceRecord record = new AttendanceRecord();
        record.setDeclaredBy(declaredBy);
        record.setZone(zone);
        record.setObservationDate(observationDate);
        record.setVisitorsCount(visitorsCount);
        record.setSourceChannel(sourceChannel);
        return attendanceRecordRepository.save(record);
    }

    public List<GuideValidationRequest> pendingGuideValidations() {
        return guideValidationRepository.findTop10ByStatusOrderByIdDesc(GuideValidationStatus.PENDING);
    }

    public List<GuideValidationRequest> guideRequests(User guide) {
        return guideValidationRepository.findTop10ByGuideOrderByIdDesc(guide);
    }

    public List<BlockchainCertificate> pendingCertificates() {
        return certificateRepository.findTop10ByStatusOrderByIdDesc(CertificateStatus.REQUESTED);
    }

    public List<BlockchainCertificate> certificatesByOwner(User owner) {
        return certificateRepository.findTop10ByOwnerOrderByIdDesc(owner);
    }

    public List<EventTicketBatch> eventsByOrganizer(User organizer) {
        return eventTicketBatchRepository.findTop10ByOrganizerOrderByEventDateDesc(organizer);
    }

    public List<AttendanceRecord> recentAttendance() {
        return attendanceRecordRepository.findTop20ByOrderByIdDesc();
    }

    private String genererHash(BlockchainCertificate certificate) {
        String payload = certificate.getOwner().getEmail() + "|"
                + certificate.getCertificateType() + "|"
                + certificate.getExternalReference() + "|"
                + LocalDateTime.now();

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(payload.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Algorithme SHA-256 indisponible", exception);
        }
    }
}
