package Chat.Spring_web_socket.config;

import Chat.Spring_web_socket.service.ChatHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket // Activa el soporte para WebSockets en la aplicacion
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    ChatHandler chatHandler; // Manejador de eventos de chat

    // Registra el manejador de WebSocket y lo asocia con la URL "/chat"
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatHandler, "/chat").setAllowedOrigins("*");
    }
}
