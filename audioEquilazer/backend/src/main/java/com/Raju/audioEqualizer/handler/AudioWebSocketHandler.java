package com.Raju.audioEqualizer.handler;



import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

public class AudioWebSocketHandler extends BinaryWebSocketHandler {

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {

        byte[] audioBytes = message.getPayload().array();

        System.out.println("Received audio chunk: " + audioBytes.length + " bytes");

        // MOCK transcription (for demo purpose)
        String response = "Listening... (mock transcription)";
        session.sendMessage(new TextMessage(response));
    }
}

