package ecom_blog.repository;

import ecom_blog.model.EventTicketBatch;
import ecom_blog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventTicketBatchRepository extends JpaRepository<EventTicketBatch, Long> {
    List<EventTicketBatch> findTop10ByOrganizerOrderByIdDesc(User organizer);
}
