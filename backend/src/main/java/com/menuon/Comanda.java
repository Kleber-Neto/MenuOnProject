
package com.menuon;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Comanda {
    @Id @GeneratedValue
    private Long id;
    private String cliente;
    private Double valorTotal;
    private String data;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ItemComanda> itens;

    // getters e setters
}
