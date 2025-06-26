
import React, { useState } from 'react';
import './ChatBot.css';
import axios from 'axios';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "👋 Hi! I'm SagarBot. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [show, setShow] = useState(false);

  const options = [
    "Track My Order",
    "Product Details",
    "Return Policy",
    "Talk to Support"
  ];

  const handleUserInput = async (text) => {
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInput('');

    let response = "";

    if (text.toLowerCase().includes("track")) {
      response = "Please provide your order ID.";
    } else if (text.toLowerCase().includes("return")) {
      response = "Our return policy lasts 30 days. Want full details?";
    } else if (text.toLowerCase().includes("product")) {
      response = "Which product do you want to know about?";
    } else if (text.startsWith("order#")) {
      const orderId = text.replace("order#", "").trim();
      response = await getOrderDetail(orderId);
    } else {
      response = "I'm sorry, I didn't understand that. You can try asking about order tracking, return policy, or product details.";
    }

    setMessages((prev) => [...prev, { sender: 'bot', text: response }]);
  };

  const getOrderDetail = async (orderId) => {
    try {
      const res = await axios.get(`https://q400w6-4p.myshopify.com/admin/api/2023-01/orders/${orderId}.json`, {
        headers: {
          'X-Shopify-Access-Token': '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'
        }
      });
      const order = res.data.order;
      return `Order #${order.id} is currently: ${order.fulfillment_status || "Pending"}. Total: ₹${order.total_price}`;
    } catch (err) {
      return "❌ Order not found. Please check your order ID.";
    }
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={() => setShow(!show)}>💬</div>
      {show && (
        <div className="chatbot-box">
          <div className="chat-header">SagarBot</div>
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>{msg.text}</div>
            ))}
          </div>
          <div className="chat-options">
            {options.map((opt, i) => (
              <button key={i} onClick={() => handleUserInput(opt)}>{opt}</button>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUserInput(input)}
            />
          </div>
        </div>
      )}
    </>
  );
}
