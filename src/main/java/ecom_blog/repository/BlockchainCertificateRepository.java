package ecom_blog.repository;

import ecom_blog.model.BlockchainCertificate;
import ecom_blog.model.CertificateStatus;
import ecom_blog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlockchainCertificateRepository extends JpaRepository<BlockchainCertificate, Long> {
    List<BlockchainCertificate> findTop10ByOwnerOrderByIdDesc(User owner);

    List<BlockchainCertificate> findTop10ByStatusOrderByIdDesc(CertificateStatus status);
}
