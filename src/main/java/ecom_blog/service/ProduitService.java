package ecom_blog.service;

import ecom_blog.model.Produit;
import ecom_blog.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProduitService {

    private final ProduitRepository repo;

    private static final String UPLOAD_DIR = "uploads/";

    public List<Produit> getAll() {
        return repo.findAll();
    }

    public Produit save(Produit produit, MultipartFile image) {
        try {
            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, image.getBytes());
                produit.setImageUrl("/uploads/" + fileName);
            }
        } catch (IOException e) {
            throw new RuntimeException("Erreur upload image");
        }

        return repo.save(produit);
    }

    // 🔥 Méthode OBLIGATOIRE pour résoudre ton erreur
    public Produit findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public long count() {
        return repo.count();
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
