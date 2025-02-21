import React, { useState } from 'react';
import {
  FaComment,
  FaRobot,
  FaLightbulb,
  FaShieldAlt,
  FaRocket,
  FaRegSmile,
} from 'react-icons/fa';

const ChatbotPage = () => {
  // State for the chat messages and the current input.
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content:
        "Hello! I'm MedSync AI. Ask me anything about healthcare, medications, or symptoms.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Function to send a message to the Gemini API.
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Append the user message to the conversation immediately.
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send the message to the Gemini API endpoint.
      const response = await fetch('https://api.gemini.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Pass your API key from an environment variable.
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          message: inputMessage,
          // You might include additional parameters required by Gemini here.
        }),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
      }

      const data = await response.json();

      // Gemini’s API response should include the chatbot’s reply.
      // Adjust the property name ("reply") according to Gemini’s response format.
      const botMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: data.reply || 'No response received.',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally add an error message to the chat.
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content:
            'Sorry, there was an error processing your request. Please try again later.',
        },
      ]);
    }

    // Clear the input field after sending.
    setInputMessage('');
  };

  // Render all chat messages.
  const renderMessages = () =>
    messages.map((msg) => (
      <div key={msg.id} className={`message ${msg.role}`}>
        {msg.role === 'ai' && <FaRobot className="bot-icon" />}
        <p>{msg.content}</p>
      </div>
    ));

  return (
    <div className="chatbot-landing">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>
            <FaRobot className="hero-icon" />
            MedSync AI Assistant
          </h1>
          <p className="hero-subtitle">
            Your 24/7 Intelligent Healthcare Companion
          </p>
          <div className="chat-demo">
            <div className="message ai">
              <FaRobot className="bot-icon" />
              <p>How can I assist you today? 😊</p>
            </div>
            <div className="message user">
              <p>I need help with my medication schedule</p>
            </div>
          </div>
          <button className="cta-button">
            Start Free Trial <FaRocket />
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose MedSync AI?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaLightbulb className="feature-icon" />
            <h3>Smart Diagnostics</h3>
            <p>Advanced symptom analysis powered by machine learning</p>
          </div>
          <div className="feature-card">
            <FaShieldAlt className="feature-icon" />
            <h3>HIPAA Compliant</h3>
            <p>Secure and confidential health data protection</p>
          </div>
          <div className="feature-card">
            <FaRegSmile className="feature-icon" />
            <h3>Natural Conversations</h3>
            <p>Human-like interactions using NLP technology</p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="live-demo">
        <h2>Try It Yourself</h2>
        <div className="chat-interface">
          <div className="chat-messages">{renderMessages()}</div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button className="send-button" onClick={handleSendMessage}>
              <FaComment />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Experience the Future of Healthcare?</h2>
        <div className="cta-buttons">
          <button className="cta-button primary">Get Started Now</button>
          <button className="cta-button secondary">Schedule Demo</button>
        </div>
      </section>
    </div>
  );
};

export default ChatbotPage;
