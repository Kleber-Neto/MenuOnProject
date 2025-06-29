// package com.menuon;

// import jakarta.persistence.*;

// @Entity
// public class ItemComanda {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String produto;
//     private int quantidade;
//     private double precoUnitario;

//     @ManyToOne
//     @JoinColumn(name = "comanda_id")
//     private Comanda comanda;

//     // Getters e Setters
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }

//     public String getProduto() { return produto; }
//     public void setProduto(String produto) { this.produto = produto; }

//     public int getQuantidade() { return quantidade; }
//     public void setQuantidade(int quantidade) { this.quantidade = quantidade; }

//     public double getPrecoUnitario() { return precoUnitario; }
//     public void setPrecoUnitario(double precoUnitario) { this.precoUnitario = precoUnitario; }

//     public Comanda getComanda() { return comanda; }
//     public void setComanda(Comanda comanda) { this.comanda = comanda; }
// }




package com.menuon;

import jakarta.persistence.*;

@Entity
public class ItemComanda {

    @Id
    @GeneratedValue
    private Long id;

    private String produto;
    private Integer quantidade;
    private Double precoUnitario;

    // ✅ Construtor padrão
    public ItemComanda() {
    }

    // ✅ Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProduto() {
        return produto;
    }

    public void setProduto(String produto) {
        this.produto = produto;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Double getPrecoUnitario() {
        return precoUnitario;
    }

    public void setPrecoUnitario(Double precoUnitario) {
        this.precoUnitario = precoUnitario;
    }
}