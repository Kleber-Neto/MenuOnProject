
package com.menuon;

import jakarta.persistence.*;

@Entity
public class ItemComanda {
    @Id @GeneratedValue
    private Long id;
    private String produto;
    private Integer quantidade;
    private Double precoUnitario;

    // getters e setters
}
