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

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonProperty("pedidos") // ✅ força o nome no JSON
    private List<ItemComanda> pedidos;

    // ✅ Construtor padrão
    public Comanda() {
    }

    // ✅ Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<ItemComanda> getPedido() {
        return pedidos;
    }

    public void setPedidos(List<ItemComanda> pedidos) {
        this.pedidos = pedidos;
    }
}
