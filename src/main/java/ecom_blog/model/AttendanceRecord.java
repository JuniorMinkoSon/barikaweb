package ecom_blog.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "attendance_record")
@Getter
@Setter
public class AttendanceRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "declared_by", nullable = false)
    private User declaredBy;

    @Column(nullable = false, length = 120)
    private String zone;

    @Column(nullable = false)
    private LocalDate observationDate;

    @Column(nullable = false)
    private Integer visitorsCount;

    @Column(nullable = false, length = 50)
    private String sourceChannel;
}
