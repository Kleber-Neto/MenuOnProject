
package com.menuon;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comandas")
public class ComandaController {
    private final ComandaRepository repository;

    public ComandaController(ComandaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Comanda> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Comanda adicionar(@RequestBody Comanda comanda) {
        return repository.save(comanda);
    }
}
