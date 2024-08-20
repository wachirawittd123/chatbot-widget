// pages/index.js
import React from 'react';
import Chatbox from '../components/chat-box-next';


export default function Home() {
  return (
    <div>
      <Chatbox />
      <div 
          dangerouslySetInnerHTML={{ __html:  `
              <div 
                  id="chatbot-widget-website"
                  keyId="62f9d4ef0f9fc4001b7fe80c"
                  webhook=https://dpt-chatbot.digitaltouchpointserver.com/webhook-website
              >
              </div>
              <script src="/chatbox-widget.min.js"></script>
              <link rel="stylesheet" href="/chatbot-widget.min.css">
              `
          }}
      />
    </div>
  );
}