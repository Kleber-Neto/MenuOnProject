
package com.menuon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comandas")
@CrossOrigin(origins = "*") // ou especifique: "https://kleber-neto.github.io"
public class ComandaController {

    @Autowired
    private ComandaRepository comandaRepository;

    // GET: listar todas as comandas
    @GetMapping
    public List<Comanda> listar() {
        return comandaRepository.findAll();
    }

    // POST: criar nova comanda
    @PostMapping
    public Comanda criar(@RequestBody Comanda comanda) {
        return comandaRepository.save(comanda);
    }

    // PUT: atualizar comanda existente
    @PutMapping("/{id}")
    public Comanda atualizar(@PathVariable Long id, @RequestBody Comanda comandaAtualizada) {
        return comandaRepository.findById(id).map(comanda -> {
            comanda.setCliente(comandaAtualizada.getCliente());
            comanda.setPedidos(comandaAtualizada.getPedidos());
            comanda.setValorTotal(comandaAtualizada.getValorTotal());
            comanda.setData(comandaAtualizada.getData());
            return comandaRepository.save(comanda);
        }).orElseThrow(() -> new RuntimeException("Comanda não encontrada com id: " + id));
    }

    // DELETE: excluir comanda
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        comandaRepository.deleteById(id);
    }
}
