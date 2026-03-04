package ecom_blog.model;

import jakarta.persistence.*;

@Entity
@Table(name = "article")
public class Article extends BaseEntity {

    private String titre;
    private String categorie;

    @Column(length = 5000)
    private String contenu;

    private String imageUrl;

    // --- Getters et Setters ---
    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}
