package ecom_blog.dto;

import ecom_blog.model.ServiceFournisseur;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class WeekendDealDto {

    private ServiceFournisseur service;
    private LocalDate startDate;
    private LocalDate endDate;
    private int nights;
    private double originalPrice;
    private double dealPrice;
    private int discountPercent;
    private String ratingLabel;
}
