package com.menuon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comandas")
@CrossOrigin(origins = "*")
public class ComandaController {

    private final ComandaRepository repository;

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
    public Comanda criar(@RequestBody Comanda comanda) {
        comanda.setStatus("pendente");
        return repository.save(comanda);
    }

    @PutMapping("/{id}")
    public Comanda atualizar(@PathVariable Long id, @RequestBody Comanda atualizada) {
        Comanda comanda = repository.findById(id).orElseThrow();
        if (atualizada.getStatus() != null) {
            comanda.setStatus(atualizada.getStatus());
        }
        return repository.save(comanda);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        comandaRepository.deleteById(id);
    }
}
