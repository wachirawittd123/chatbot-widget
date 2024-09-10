// pages/index.js
import React from 'react';
// import Chatbox from '../components/chat-box-next';


export default function Home() {
  return (
    <div>
      {/* <Chatbox /> */}
      <div 
          dangerouslySetInnerHTML={{ __html:  `
              <div
                id="chatbot-widget-website"
                keyId="62f9d4ef0f9fc4001b7fe80c"
                bot-icon="https://dpt-chatbot.digitaltouchpointserver.com/static/images/dpt/logo-footer.png"
                icon-header="https://dpt-chatbot.digitaltouchpointserver.com/static/images/dpt/logo-footer.png"
                button-icon="https://dpt-chatbot.digitaltouchpointserver.com/static/images/dpt/logo-footer.png"
                title-bot="กรมโยธาธิการและผังเมือง"
                title-header="Test bot"
                webhook=https://dpt-chatbot.digitaltouchpointserver.com/webhook-website
                ></div>
                <script src="https://dpt-chatbot.digitaltouchpointserver.com/static/script/chatbox-widget.min.js"></script>
                <link rel="stylesheet" href="https://dpt-chatbot.digitaltouchpointserver.com/static/script/chatbot-widget.min.css">
              `
          }}
      />
    </div>
  );
}