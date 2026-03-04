package ecom_blog.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class MessageContact extends BaseEntity {

    private String nom;

    private String email;

    private String telephone;

    private String sujet;

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime dateEnvoi = LocalDateTime.now();
}
