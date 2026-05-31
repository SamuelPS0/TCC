# Backend completo do contador do serviço

Abaixo estão os arquivos completos para copiar e colar no backend Spring Boot. O contador continua sendo usado apenas no backend: o front-end só chama `PATCH /api/v1/servico/{id}/contador` quando o usuário clica no card.

## `ServicoDTO.java`

```java
package com.itb.inf2am.divulgai.dto;

public class ServicoDTO {

    private String nome;
    private String descricao;
    private String foto; // BASE64 STRING

    private Long prestadorId;
    private Long categoriaId;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public Long getPrestadorId() { return prestadorId; }
    public void setPrestadorId(Long prestadorId) { this.prestadorId = prestadorId; }

    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
}
```

## `ServicoController.java`

```java
package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.dto.ServicoDTO;
import com.itb.inf2am.divulgai.model.entity.Servico;
import com.itb.inf2am.divulgai.model.services.ServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/servico")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping
    public List<Servico> findAll() {
        return servicoService.findAll();
    }

    @PostMapping
    public Servico create(@RequestBody ServicoDTO dto) {
        return servicoService.saveFromDTO(dto);
    }

    @PatchMapping("/{id}/contador")
    public ResponseEntity<Object> incrementarContador(@PathVariable String id) {
        try {
            return ResponseEntity.ok(servicoService.incrementarContador(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "status", 400,
                            "error", "Bad Request",
                            "message", "ID inválido: " + id
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                    Map.of(
                            "status", 404,
                            "error", "Not Found",
                            "message", e.getMessage()
                    )
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> listarServicoPorId(@PathVariable String id) {
        try {
            return ResponseEntity.ok(servicoService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "status", 400,
                            "error", "Bad Request",
                            "message", "ID inválido: " + id
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                    Map.of(
                            "status", 404,
                            "error", "Not Found",
                            "message", e.getMessage()
                    )
            );
        }
    }
}
```

## `Servico.java`

```java
package com.itb.inf2am.divulgai.model.entity;

import jakarta.persistence.*;

@Entity
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contador", nullable = false)
    private Integer contador;

    @Column(length = 100, nullable = false)
    private String nome;

    @Column(length = 200, nullable = false)
    private String descricao;

    @Column(nullable = false)
    private boolean statusServico;

    @Lob
    @Column(nullable = true)
    private byte[] foto;

    @ManyToOne
    @JoinColumn(name = "prestador_id")
    private Prestador prestador;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getContador() {
        return contador;
    }

    public void setContador(Integer contador) {
        this.contador = contador;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public boolean getStatusServico() {
        return statusServico;
    }

    public void setStatusServico(boolean statusServico) {
        this.statusServico = statusServico;
    }

    public byte[] getFoto() {
        return foto;
    }

    public void setFoto(byte[] foto) {
        this.foto = foto;
    }

    public Prestador getPrestador() {
        return prestador;
    }

    public void setPrestador(Prestador prestador) {
        this.prestador = prestador;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}
```

## `ServicoService.java`

```java
package com.itb.inf2am.divulgai.model.services;

import com.itb.inf2am.divulgai.dto.ServicoDTO;
import com.itb.inf2am.divulgai.model.entity.Categoria;
import com.itb.inf2am.divulgai.model.entity.Prestador;
import com.itb.inf2am.divulgai.model.entity.Servico;
import com.itb.inf2am.divulgai.model.repository.CategoriaRepository;
import com.itb.inf2am.divulgai.model.repository.PrestadorRepository;
import com.itb.inf2am.divulgai.model.repository.ServicoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PrestadorRepository prestadorRepository;

    public List<Servico> findAll() {
        return servicoRepository.findAll();
    }

    public Servico findById(Long id) {
        return servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado: " + id));
    }

    public Servico save(Servico servico) {
        servico.setStatusServico(true);

        if (servico.getContador() == null) {
            servico.setContador(0);
        }

        return servicoRepository.save(servico);
    }

    @Transactional
    public Servico incrementarContador(Long id) {
        Servico servico = findById(id);

        int contadorAtual = servico.getContador() == null ? 0 : servico.getContador();
        servico.setContador(contadorAtual + 1);

        return servicoRepository.save(servico);
    }

    public Servico saveFromDTO(ServicoDTO dto) {

        if (dto == null) {
            throw new RuntimeException("DTO nulo");
        }

        Servico servico = new Servico();

        servico.setNome(dto.getNome());
        servico.setDescricao(dto.getDescricao());
        servico.setStatusServico(true);
        servico.setContador(0);

        // =========================
        // FOTO BASE64 → BYTE[]
        // =========================
        if (dto.getFoto() != null && !dto.getFoto().isEmpty()) {
            try {
                byte[] imagemBytes = Base64.getDecoder().decode(dto.getFoto());
                servico.setFoto(imagemBytes);
            } catch (Exception e) {
                throw new RuntimeException("Erro ao decodificar imagem Base64", e);
            }
        }

        // PRESTADOR
        if (dto.getPrestadorId() == null) {
            throw new RuntimeException("prestadorId ausente");
        }

        Prestador prestador = prestadorRepository.findById(dto.getPrestadorId())
                .orElseThrow(() -> new RuntimeException("Prestador não encontrado"));

        servico.setPrestador(prestador);

        // CATEGORIA
        if (dto.getCategoriaId() == null) {
            throw new RuntimeException("categoriaId ausente");
        }

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        servico.setCategoria(categoria);

        return servicoRepository.save(servico);
    }
}
```

## O que mudou para o contador funcionar

- `ServicoController.java`: ganhou o endpoint `PATCH /api/v1/servico/{id}/contador`.
- `ServicoService.java`: ganhou o método `incrementarContador(Long id)`.
- `ServicoService.java`: o método `save(Servico servico)` agora garante contador `0` se vier `null`.
- `ServicoService.java`: o método `saveFromDTO(ServicoDTO dto)` já inicia `servico.setContador(0)`.
- `ServicoDTO.java` e `Servico.java`: podem ficar como estão.
