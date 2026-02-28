package ecom_blog.repository;

import ecom_blog.model.GuideValidationRequest;
import ecom_blog.model.GuideValidationStatus;
import ecom_blog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuideValidationRequestRepository extends JpaRepository<GuideValidationRequest, Long> {
    List<GuideValidationRequest> findTop10ByGuideOrderByIdDesc(User guide);

    List<GuideValidationRequest> findTop10ByStatusOrderByIdDesc(GuideValidationStatus status);
}
