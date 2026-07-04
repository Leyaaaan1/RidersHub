package leyans.RidersHub.Controller.Api;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
public class InviteRedirectController {

    @GetMapping(value = "/invite/link/{token}", produces = MediaType.TEXT_HTML_VALUE)
    public String inviteRedirect(@PathVariable String token) throws IOException {
        ClassPathResource resource = new ClassPathResource("static/link/invite-redirect.html");
        try (var inputStream = resource.getInputStream()) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}