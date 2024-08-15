import React, { useState, useRef, useEffect } from 'react';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false)
  let defaultTitle = "Test bot"
  let defaultIcon = "https://i.ibb.co/2g1TMRz/chatbot-modern-semi.png"
  let defaultUserAvatar = "https://i.ibb.co/TTpDxk0/none-image-user.png"
  let defaultRobotAvatar = "https://i.ibb.co/WGJBC1F/robot.png"
  let defaultUserBg = "rgb(247, 108, 94)"
  let defaultBotBg = "rgb(50, 67, 118)"
  let defaultFile = "https://i.ibb.co/Kw7xN7F/files.png"
  let defaultInputSendIcon = "https://i.ibb.co/M9bKCtx/send.png"
  let defaultIconButton = "https://i.ibb.co/Krjnjzw/comment.png"
  let titleBot = "Bot" 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()?.length > 0) {
      setLoading(true)
      setMessages([...messages, { type: "text", value: input, role: 'USER' }]);
      setInput('');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      fetch(`http://localhost:3000/webhook-website?keyId=62f9d4ef0f9fc4001b7fe80c`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          "uid": "chatbot-widget-website",
          "question": input
        }),
        redirect: "follow"
      })
        .then((response) => response.json())
        .then((result) => {
          if(result?.answer?.length > 0) setMessages((ms) => ([...ms, ...result?.answer]))
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log('err chat widget :', error)
        });
    }
    return
  };

  const _onResetBubble = () => {
    setInput("")
    setMessages([])
    setOpen(false)
  }

  const checkAndTruncate = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
  }

  const renderUser = (data) => {
    return (
      <div className="user-body">
        <div className="header">
          <div style={{ marginRight: 5  }}>
            <div className="title">User</div>
            <div className='description'>ผู้ทดสอบ</div>
          </div>
          <div>
            <img className="avatar" alt="user-avatar" src={defaultUserAvatar} />
          </div>
        </div>
        <div className="body">
          <div className="box" style={{ background: defaultUserBg, marginTop: "5px" }}>
            <div className="title-default">
              {data?.value}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderBot = (data) => {
    return (
      <div className="bot-body">
        <div className="header">
          <div style={{ marginRight: 5  }}>
            <img className="avatar" alt="user-avatar" src={defaultRobotAvatar} />
          </div>
          <div>
            <div className="title">{titleBot}</div>
            <div className='description'>บอท</div>
          </div>
        </div>
        <div className="body">
          <div className="box" style={{ background: defaultBotBg, maringTop: "5px" }}>
            {checkRenderBot(data)}
          </div>
        </div>
      </div>
    )
  }

  

  const checkRenderBot = (data) => {
    switch(data?.type || data?.template?.type) {
      case "image":
        return <img alt="default" src={data?.value} width={200} height={200} />
      case "quickreply" :
        return <div className="grid-wrapper">
          {data?.quick_replies?.map((e, i) => 
              <div key={i} className='button-default' style={{ width: "auto" }}> 
                {checkAndTruncate(e?.title, 15)}
              </div>
          )}
        </div>
      case "template":
        let carousel = data?.template?.columns?.length > 0 ? data?.template?.columns[0] : {}
        return (
          <div className="body-card">
            <div className='body-card-cover'>
              <img className='img' alt="body-card-cover" src={carousel?.thumbnailImageUrl} width={250} height={200} />
            </div>
            <div className='body-card-detail'>
              <div className='body-card-detail-title'>
                {checkAndTruncate(carousel?.title, 40)}
              </div>
              <div className='body-card-detail-description'>
                {checkAndTruncate(carousel?.text, 80)}
              </div>
              <div style={{ width: "100%", marginTop: 10 }}>
                  {
                    carousel?.actions?.map((e,i) => 
                      <div key={i} className='button-default' style={{ marginTop: i > 0 ? 5 : 0, width: "83%" }}> 
                        {checkAndTruncate(e?.title, 15)}
                      </div>
                    )
                  }
              </div>
            </div>
          </div>
        )
      case "file":
        return (
          <div>
            <img alt="file" src={defaultFile} width={100} height={100} />
            <div className='title-file'>
              {data?.value}
            </div>
          </div>
        ) 
      default: 
        return (
          <div className='title-default'>
            {data?.value}
          </div>
        )
    }
  }

  return (
    <div id="container-main">
      { !open ?
        <div id="buble-btn" style={{ background: "#f8f9fa" }} onClick={() => setOpen(true)}>
            <div className="text-buble">
              <img alt="default-icon-button" src={defaultIconButton} width={40} height={40} />
            </div>
        </div>
        : 
        <div id="chatbox-container">
            <div className="chatbox-header">
                <div className="title">
                   <img alt="default-icon" src={defaultIcon} width={40} height={40} />   <div style={{ marginLeft: 10 }}>{defaultTitle}</div>
                </div>
                <div className="close">
                    <img 
                      onClick={_onResetBubble}
                      className="icon"
                      alt="close-icon" 
                      src="https://i.ibb.co/jhCxsbM/close.png" 
                    />
                </div>
            </div>
            <div id="chatbox-body">
              <div id="chatbox-messages">
                {messages.map((msg, index) => (
                  <div key={index} style={{ width: "100%" }}>
                    {
                      msg?.role === "USER" 
                        ? renderUser(msg)
                        : renderBot(msg)
                    }
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <input
                id="chatbox-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                onKeyPress={async(e) => e.key === 'Enter' ? await handleSend() : null}
              />
              <div 
                className='icon-send-button' 
                onClick={async(e) => {
                  if(loading) return
                  e.stopPropagation()
                  await handleSend()
                }}
              >
                <img alt="message-send" src={defaultInputSendIcon} width={20} height={20} />
              </div>
            </div>
        </div>
      }
     
    </div>
  );
};

export default Chatbox;