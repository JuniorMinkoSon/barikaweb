package ecom_blog.service;

import ecom_blog.model.Devis;
import ecom_blog.repository.DevisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DevisService {

    @Autowired
    private DevisRepository devisRepository;

    public Devis save(Devis devis) {
        return devisRepository.save(devis);
    }

    public List<Devis> getAll() {
        return devisRepository.findAll();
    }

    public Devis getById(Long id) {
        return devisRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        devisRepository.deleteById(id);
    }
}
