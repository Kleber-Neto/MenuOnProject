package com.menuon;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comandas")
public class ComandaController {

    @Autowired
    private ComandaRepository comandaRepository;

    @GetMapping
    public List<Comanda> listarComandas() {
        return comandaRepository.findAll();
    }

    @PostMapping
    public Comanda criarComanda(@RequestBody Comanda comanda) {
        if (comanda.getPedidos() != null) {
            for (ItemComanda item : comanda.getPedidos()) {
                item.setComanda(comanda);
            }
        }
        return comandaRepository.save(comanda);
    }

    @PutMapping("/{id}/status")
    public Comanda atualizarStatus(@PathVariable Long id, @RequestBody Comanda atualizada) {
        Comanda comanda = comandaRepository.findById(id).orElseThrow();
        comanda.setStatus(atualizada.getStatus());
        return comandaRepository.save(comanda);
    }

    @PutMapping("/{id}")
    public Comanda editarComanda(@PathVariable Long id, @RequestBody Comanda atualizada) {
        Comanda comanda = comandaRepository.findById(id).orElseThrow();
        comanda.setCliente(atualizada.getCliente());
        comanda.setData(atualizada.getData());
        comanda.setValorTotal(atualizada.getValorTotal());
        comanda.setStatus(atualizada.getStatus());

        comanda.getPedidos().clear();
        if (atualizada.getPedidos() != null) {
            for (ItemComanda item : atualizada.getPedidos()) {
                item.setComanda(comanda);
                comanda.getPedidos().add(item);
            }
        }

        return comandaRepository.save(comanda);
    }
}

// import org.springframework.web.bind.annotation.*;
// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/comandas")
// @CrossOrigin(origins = "*")
// public class ComandaController {

//     private final ComandaRepository repository;

//     public ComandaController(ComandaRepository repository) {
//         this.repository = repository;
//     }

//     // Buscar todas as comandas
//     @GetMapping
//     public List<Comanda> listar() {
//         return repository.findAll();
//     }

//     // Criar uma nova comanda
//     @PostMapping
//     public Comanda criar(@RequestBody Comanda comanda) {
//         return repository.save(comanda);
//     }

//     // Atualizar a comanda inteira
//     @PutMapping("/{id}")
//     public Comanda atualizar(@PathVariable Long id, @RequestBody Comanda atualizada) {
//         Comanda c = repository.findById(id).orElseThrow();
//         c.setCliente(atualizada.getCliente());
//         c.setPedidos(atualizada.getPedidos());
//         c.setValorTotal(atualizada.getValorTotal());
//         c.setData(atualizada.getData());
//         c.setStatus(atualizada.getStatus());
//         return repository.save(c);
//     }

//     // ✅ Atualizar apenas o status
//     @PutMapping("/{id}/status")
//     public Comanda atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
//         Comanda c = repository.findById(id).orElseThrow();
//         c.setStatus(payload.get("status"));
//         return repository.save(c);
//     }

//     // Deletar (caso precise)
//     @DeleteMapping("/{id}")
//     public void deletar(@PathVariable Long id) {
//         repository.deleteById(id);
//     }
// }
