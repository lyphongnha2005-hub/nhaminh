package com.group04.controllers;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.group04.services.MessageService;
import com.group04.services.MessageService.MessageView;

@RestController
@RequestMapping("/api")
public class MessageController {
    private final MessageService service;
    public MessageController(MessageService service) { this.service = service; }

    @GetMapping("/messages")
    public List<MessageView> visible() { return service.list(false); }

    @PostMapping("/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageView create(@Valid @RequestBody CreateMessage body) { return service.create(body.text()); }

    @GetMapping("/admin/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public List<MessageView> all() { return service.list(true); }

    @PatchMapping("/admin/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void moderate(@PathVariable String id, @Valid @RequestBody ModerateMessage body) {
        service.moderate(id, body.status());
    }

    @DeleteMapping("/admin/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) { service.delete(id); }

    public record CreateMessage(@NotBlank @Size(max = 500) String text) {}
    public record ModerateMessage(@NotBlank String status) {}
}
