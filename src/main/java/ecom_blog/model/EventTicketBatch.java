package ecom_blog.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "event_ticket_batch")
@Getter
@Setter
public class EventTicketBatch extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @Column(nullable = false, length = 140)
    private String eventName;

    @Column(nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private Integer totalCapacity;

    @Column(nullable = false)
    private Integer soldCount = 0;

    public int remaining() {
        return Math.max(0, (totalCapacity != null ? totalCapacity : 0) - (soldCount != null ? soldCount : 0));
    }
}
