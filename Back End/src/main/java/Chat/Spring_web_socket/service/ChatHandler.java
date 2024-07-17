package Chat.Spring_web_socket.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class ChatHandler extends TextWebSocketHandler {

    // Logger para registrar información y eventos importantes
    public static final Logger LOGGER = LoggerFactory.getLogger(ChatHandler.class);

    // Lista de sesiones WebSocket activas
    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    // Método llamado cuando se establece una nueva conexión WebSocket
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Añadir la nueva sesión a la lista de sesiones activas
        sessions.add(session);
    }

    // Método llamado cuando se cierra una conexión WebSocket
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Eliminar la sesión cerrada de la lista de sesiones activas
        sessions.remove(session);
    }

    // Método llamado cuando se recibe un mensaje de texto
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Obtener el contenido del mensaje
        String payload = message.getPayload();

        // Verificar si el mensaje es válido
        if (isValidMessage(payload)) {
            // Si el mensaje es válido, reenviar el mensaje a todas las sesiones activas
            for (WebSocketSession webSocketSession : sessions) {
                webSocketSession.sendMessage(message);
            }
        } else {
            // Si el mensaje no es válido, enviar un mensaje de error al cliente que envió el mensaje
            session.sendMessage(new TextMessage("Error: Mensaje no válido."));
        }
    }

    // Método para validar el mensaje
    private boolean isValidMessage(String message) {
        // El mensaje no debe estar vacío y debe contener un ":"
        if (message == null || message.trim().isEmpty()) {
            return false;
        }

        // Dividir el mensaje en partes usando ":" como delimitador
        String[] parts = message.split(":");
        if (parts.length != 2) {
            return false;
        }

        // Obtener el nombre de usuario y el mensaje del usuario
        String username = parts[0].trim();
        String userMessage = parts[1].trim();

        // Ambos, nombre de usuario y mensaje, no deben estar vacíos
        return !username.isEmpty() && !userMessage.isEmpty();
    }
}
