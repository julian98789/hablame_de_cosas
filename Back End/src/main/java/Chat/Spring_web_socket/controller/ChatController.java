package Chat.Spring_web_socket.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChatController {

    @GetMapping("/")
    public String showChatPage() {
        return "chat";
    }

}
