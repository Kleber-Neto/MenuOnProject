
package com.menuon;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@Repository
public interface ComandaRepository extends JpaRepository<Comanda, Long> {
    List<Comanda> findByStatus(String status);
}
