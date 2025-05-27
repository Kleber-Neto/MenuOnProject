package com.menuon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comandas")
@CrossOrigin(origins = "*")
public class ComandaController {

    @Autowired
    private ComandaRepository repository;

    public ComandaController(ComandaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Comanda> listarPendentes() {
        return repository.findByStatus("pendente");
    }

    @GetMapping("/em_aberto")
    public List<Comanda> listarEmAberto() {
        return repository.findByStatus("em_aberto");
    }

    @GetMapping("/pagas")
    public List<Comanda> listarPagas() {
        return repository.findByStatus("paga");
    }

    @PostMapping
    public Comanda criar(@RequestBody Comanda c) {
        c.setStatus("pendente");
        return repository.save(c);
    }

    // ✅ Atualizar TODOS os campos de uma comanda
    // @PutMapping("/{id}")
    // public Comanda atualizar(@PathVariable Long id, @RequestBody Comanda
    // atualizada) {
    // Comanda c = repository.findById(id).orElseThrow();

    // c.setCliente(atualizada.getCliente());
    // c.setPedidos(atualizada.getPedidos());
    // c.setValorTotal(atualizada.getValorTotal());
    // c.setData(atualizada.getData());
    // c.setStatus(atualizada.getStatus());

    // return repository.save(c);
    // }

    @PutMapping("/{id}")
    public Comanda atualizar(@PathVariable Long id, @RequestBody Comanda atualizada) {
        Comanda comanda = repository.findById(id).orElseThrow();
        comanda.setCliente(atualizada.getCliente());
        comanda.setItens(atualizada.getItens());
        comanda.setValorTotal(atualizada.getValorTotal());
        comanda.setData(atualizada.getData());
        comanda.setStatus(atualizada.getStatus());
        return repository.save(comanda);
    }

    @PutMapping("/{id}/status")
    public Comanda atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Comanda c = repository.findById(id).orElseThrow();
        c.setStatus(body.get("status"));
        return repository.save(c);
    }

    // @PutMapping("/{id}/status")
    // public Comanda atualizarStatus(@PathVariable Long id, @RequestBody
    // Map<String, String> body) {
    // Comanda c = repository.findById(id).orElseThrow();
    // c.setStatus(body.get("status"));
    // return repository.save(c);
    // }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
