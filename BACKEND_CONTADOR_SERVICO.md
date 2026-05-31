# Atualização do backend para o contador do serviço

O contador não deve ser renderizado no front-end. Ele deve ser incrementado no backend quando o usuário clicar em um card de serviço.

## `ServicoController.java`

Adicione este endpoint ao controller `com.itb.inf2am.divulgai.controller.ServicoController`:

```java
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
```

## `ServicoService.java`

Adicione o método abaixo ao service `com.itb.inf2am.divulgai.model.services.ServicoService`:

```java
import org.springframework.transaction.annotation.Transactional;

@Transactional
public Servico incrementarContador(Long id) {
    Servico servico = servicoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Serviço não encontrado: " + id));

    int contadorAtual = servico.getContador() == null ? 0 : servico.getContador();
    servico.setContador(contadorAtual + 1);

    return servicoRepository.save(servico);
}
```

No método `saveFromDTO`, garanta também que todo serviço novo comece com contador zero:

```java
servico.setContador(0);
```

## Fluxo esperado

1. O front-end chama `PATCH /api/v1/servico/{id}/contador` ao clicar no card.
2. O backend soma `+1` no campo `contador` daquele serviço.
3. O front-end navega para o perfil sem exibir o valor do contador.
