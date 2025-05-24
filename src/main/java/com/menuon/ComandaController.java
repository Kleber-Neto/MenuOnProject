package com.menuon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comandas")
@CrossOrigin(origins = "*")
public class ComandaController {

    @Autowired
    private ComandaRepository comandaRepository;

    // Listar todas as comandas
    @GetMapping
    public List<Comanda> listar() {
        return comandaRepository.findAll().stream()
                .filter(c -> !c.isPaga()) // ✅ Mostra só as NÃO pagas na tela principal
                .toList();
    }

    // Listar comandas pagas
    @GetMapping("/pagas")
    public List<Comanda> listarPagas() {
        return comandaRepository.findAll().stream()
                .filter(Comanda::isPaga)
                .toList();
    }

    // Criar nova comanda
    @PostMapping
    public Comanda criar(@RequestBody Comanda comanda) {
        return comandaRepository.save(comanda);
    }

    // Atualizar comanda
    @PutMapping("/{id}")
    public Comanda atualizar(@PathVariable Long id, @RequestBody Comanda comandaAtualizada) {
        return comandaRepository.findById(id).map(comanda -> {
            comanda.setCliente(comandaAtualizada.getCliente());
            comanda.setPedidos(comandaAtualizada.getPedidos());
            comanda.setValorTotal(comandaAtualizada.getValorTotal());
            comanda.setData(comandaAtualizada.getData());
            return comandaRepository.save(comanda);
        }).orElseThrow(() -> new RuntimeException("Comanda não encontrada"));
    }

    // Marcar comanda como paga
    @PutMapping("/{id}/pagar")
    public Comanda marcarComoPaga(@PathVariable Long id) {
        return comandaRepository.findById(id).map(comanda -> {
            comanda.setPaga(true);
            return comandaRepository.save(comanda);
        }).orElseThrow(() -> new RuntimeException("Comanda não encontrada"));
    }

    // Excluir comanda
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        comandaRepository.deleteById(id);
    }
}
