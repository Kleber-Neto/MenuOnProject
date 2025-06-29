// package com.menuon;

// import jakarta.persistence.*;
// import java.util.List;

// @Entity
// public class Comanda {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String cliente;
//     private String data;
//     private double valorTotal;
//     private String status;

//     @OneToMany(mappedBy = "comanda", cascade = CascadeType.ALL, orphanRemoval = true)
//     private List<ItemComanda> pedidos;

//     // Getters e Setters
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }

//     public String getCliente() { return cliente; }
//     public void setCliente(String cliente) { this.cliente = cliente; }

//     public String getData() { return data; }
//     public void setData(String data) { this.data = data; }

//     public double getValorTotal() { return valorTotal; }
//     public void setValorTotal(double valorTotal) { this.valorTotal = valorTotal; }

//     public String getStatus() { return status; }
//     public void setStatus(String status) { this.status = status; }

//     public List<ItemComanda> getPedidos() { return pedidos; }
//     public void setPedidos(List<ItemComanda> pedidos) { this.pedidos = pedidos; }
// }




package com.menuon;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class Comanda {
    @Id
    @GeneratedValue
    private Long id;

    private String cliente;

    private Double valorTotal;

    private String data;

    private boolean paga;

    @Column(nullable = false)
    private String status = "pendente"; // pendente, em_aberto, paga

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ItemComanda> pedidos;

    // ✅ Construtor padrão
    public Comanda() {
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public boolean isPaga() {
        return paga;
    }

    public void setPaga(boolean paga) {
        this.paga = paga;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<ItemComanda> getPedidos() {
        return pedidos;
    }

    public void setPedidos(List<ItemComanda> pedidos) {
        this.pedidos = pedidos;
    }
}