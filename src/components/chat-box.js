(function() {
  let open = false;
  let input = '';
  let loading = false;
  // get data for div
  const chatbotDiv = document.getElementById('chatbot-widget-website');
  const keyId = chatbotDiv.getAttribute('keyId')
  const webhook = chatbotDiv.getAttribute('webhook')
  const welcomeText = chatbotDiv.getAttribute('welcome-text')
  const userIcon = chatbotDiv.getAttribute('user-icon')
  const botIcon = chatbotDiv.getAttribute('bot-icon')
  const buttonIcon = chatbotDiv.getAttribute('button-icon')
  const fileBotIcon = chatbotDiv.getAttribute('file-bot-icon')
  const inputConfirmIcon = chatbotDiv.getAttribute('input-confirm-icon')
  const headerIcon = chatbotDiv.getAttribute('icon-header')
  const headerTitle = chatbotDiv.getAttribute('title-header')
  const getTitleUser = chatbotDiv.getAttribute('title-user')
  const getDescriptionUser = chatbotDiv.getAttribute('description-user')
  const getTitleBot = chatbotDiv.getAttribute('title-bot')
  const getDescriptionBot = chatbotDiv.getAttribute('description-bot')
  const getBotBackgroundColor = chatbotDiv.getAttribute('bot-background-color')
  const getUserBackgroundColor = chatbotDiv.getAttribute('user-background-color')
  // check value
  let defaultUserBg = getUserBackgroundColor ? getUserBackgroundColor : "rgb(247, 108, 94)";
  let defaultBotBg = getBotBackgroundColor ? getBotBackgroundColor : "rgb(50, 67, 118)";
  let titleBot = getTitleBot ? getTitleBot : "Bot";
  let descriptionBot = getDescriptionBot ? getDescriptionBot : "บอท"
  let titleUser = getTitleUser ? getTitleUser : "User";
  let descriptionUser = getDescriptionUser ? getDescriptionUser : "ผู้ทดสอบ"
  let defaultTitle = headerTitle ? headerTitle : "Test bot";
  let defaultIcon = headerIcon ? headerIcon : "https://i.ibb.co/2g1TMRz/chatbot-modern-semi.png";
  let defaultInputSendIcon = inputConfirmIcon ? inputConfirmIcon : "https://i.ibb.co/M9bKCtx/send.png";
  let defaultFile = fileBotIcon ? fileBotIcon : "https://i.ibb.co/Kw7xN7F/files.png";
  let defaultIconButton = buttonIcon ? buttonIcon : "https://i.ibb.co/Krjnjzw/comment.png";
  let defaultUserAvatar = userIcon ? userIcon : "https://i.ibb.co/TTpDxk0/none-image-user.png";
  let defaultRobotAvatar = botIcon ? botIcon : "https://i.ibb.co/WGJBC1F/robot.png";
  let defaultWelcomeMessage = welcomeText ? [{type: "text", value: welcomeText}] : []
  let messages = defaultWelcomeMessage;

  const containerMain = document.createElement('div');
  containerMain.id = 'container-main';
  document.body.appendChild(containerMain);

  const scrollToBottom = () => {
    const messagesEndRef = document.getElementById('messages-end-ref');
    if (messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: "smooth" });
    }
  };

  window.quickReplySend = async (text) => {
    input = text;
    await handleSend();
  };

  const handleSend = async () => {
    if (input.trim().length > 0) {
      loading = true;
      messages.push({ type: "text", value: input, role: 'USER' });
      const data = JSON.stringify({
        "uid": "89aed2f8-17ce-42c4-9ef3-0724316b8339",
        "question": input
      });
      input = '';
      renderChatbox();
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${webhook}?keyId=${keyId}`,
        headers: { 
          'Content-Type': 'application/json',
        },
        data : data
      };

      try {
        const response = await fetch(config.url, {
          method: config.method,
          headers: config.headers,
          body: config.data,
        });
        const result = await response.json();
        if (result?.answer?.length > 0) messages.push(...result.answer);
        loading = false;
      } catch (error) {
        loading = false;
        console.log('err chat widget :', error);
      }

      renderChatbox();
      scrollToBottom();
    }
  };

  const _onResetBubble = () => {
    open = false;
    messages = defaultWelcomeMessage;
    renderChatbox();
  };

  const checkAndTruncate = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const checkRenderBot = (data) => {
    switch(data?.type || data?.template?.type) {
      case "image":
        return `<img alt="default" src="${data?.value}" width="200" height="200" onclick="previewImage('${data?.value}')" />`;
      case "quickreply":
        return `
          <div class="grid-wrapper">
            ${data?.quick_replies?.map((e, i) => 
              `<div key="${i}" class="button-default" style="width: auto; cursor: pointer;" onclick="quickReplySend('${e?.payload}')"> 
                ${checkAndTruncate(e?.title, 15)}
              </div>`
            ).join('')}
          </div>
        `;
      case "template":
        let carousel = data?.template?.columns?.length > 0 ? data?.template?.columns[0] : {};
        return `
          <div class="body-card">
            <div class="body-card-cover">
              <img class="img" alt="body-card-cover" src="${carousel?.thumbnailImageUrl}" width="250" height="200" />
            </div>
            <div class="body-card-detail">
              <div class="body-card-detail-title">
                ${checkAndTruncate(carousel?.title, 40)}
              </div>
              <div class="body-card-detail-description">
                ${checkAndTruncate(carousel?.text, 80)}
              </div>
              <div style="width: 100%; margin-top: 10px;">
                ${carousel?.actions?.map((e,i) => 
                  `<div key="${i}" class="button-default" style="margin-top: ${i > 0 ? 5 : 0}px; width: 83%; cursor: pointer;" onclick="window.open('${e?.url}')"> 
                    ${checkAndTruncate(e?.title, 15)}
                  </div>`
                ).join('')}
              </div>
            </div>
          </div>
        `;
      case "file":
        return `
          <div>
            <img alt="file" src="${defaultFile}" width="100" height="100" />
            <div class="title-file">
              ${data?.value}
            </div>
          </div>
        `;
      default:
        return `<div class="title-default">${data?.value || data?.text}</div>`;
    }
  };

  const renderUser = (data) => {
    const userBody = document.createElement('div');
    userBody.className = 'user-body';

    const header = document.createElement('div');
    header.className = 'header';

    const userInfo = document.createElement('div');
    userInfo.style.marginRight = '5px';

    const title = document.createElement('div');
    title.className = 'title';
    title.innerText = titleUser;

    const description = document.createElement('div');
    description.className = 'description';
    description.innerText = descriptionUser;

    userInfo.appendChild(title);
    userInfo.appendChild(description);

    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.alt = 'user-avatar';
    avatar.src = defaultUserAvatar;

    header.appendChild(userInfo);
    header.appendChild(avatar);

    const body = document.createElement('div');
    body.className = 'body';

    const box = document.createElement('div');
    box.className = 'box';
    box.style.marginTop = "5px"
    box.style.background = defaultUserBg;
    box.innerText = data.value;

    body.appendChild(box);
    userBody.appendChild(header);
    userBody.appendChild(body);

    return userBody;
  };

  const renderBot = (data) => {
    const botBody = document.createElement('div');
    botBody.className = 'bot-body';

    const header = document.createElement('div');
    header.className = 'header-container';

    const avatar = document.createElement('img');
    avatar.className = 'header-avatar';
    avatar.alt = 'robot-avatar';
    avatar.src = defaultRobotAvatar;
    avatar.style.marginRight = '5px';

    const botInfo = document.createElement('div');

    const title = document.createElement('div');
    title.className = 'header-title';
    title.innerText = titleBot;

    const description = document.createElement('div');
    description.className = 'header-description';
    description.innerText = descriptionBot;

    botInfo.appendChild(title);
    botInfo.appendChild(description);

    header.appendChild(avatar);
    header.appendChild(botInfo);

    const body = document.createElement('div');
    body.className = 'container-bot';

    const box = document.createElement('div');
    box.className = 'body-box';
    box.style.marginTop = "5px"
    box.style.background = defaultBotBg;
    box.innerHTML = checkRenderBot(data);

    body.appendChild(box);
    botBody.appendChild(header);
    botBody.appendChild(body);

    return botBody;
  };

  const renderChatbox = () => {
    containerMain.innerHTML = '';

    if (!open) {
      const bubbleBtn = document.createElement('div');
      bubbleBtn.id = 'buble-btn';
      bubbleBtn.onclick = () => { open = true; renderChatbox(); };

      const textBubble = document.createElement('div');
      textBubble.className = 'text-buble';

      const bubbleIcon = document.createElement('img');
      bubbleIcon.alt = "default-icon-button";
      bubbleIcon.src = defaultIconButton;
      bubbleIcon.width = 40;
      bubbleIcon.height = 40;

      textBubble.appendChild(bubbleIcon);
      bubbleBtn.appendChild(textBubble);
      containerMain.appendChild(bubbleBtn);
    } else {
      const chatboxContainer = document.createElement('div');
      chatboxContainer.id = 'chatbox-container';

      const chatboxHeader = document.createElement('div');
      chatboxHeader.className = 'chatbox-header';

      const title = document.createElement('div');
      title.className = 'title';

      const iconImg = document.createElement('img');
      iconImg.alt = "default-icon";
      iconImg.src = defaultIcon;
      iconImg.width = 40;
      iconImg.height = 40;

      title.appendChild(iconImg);

      const titleText = document.createElement('div');
      titleText.style.marginLeft = "10px";
      titleText.innerText = defaultTitle;

      title.appendChild(titleText);

      const close = document.createElement('div');
      close.className = 'close';

      const closeIcon = document.createElement('img');
      closeIcon.className = 'close-icon';
      closeIcon.alt = 'close-icon';
      closeIcon.src = 'https://i.ibb.co/jhCxsbM/close.png';
      closeIcon.onclick = _onResetBubble;

      close.appendChild(closeIcon);
      chatboxHeader.appendChild(title);
      chatboxHeader.appendChild(close);

      const chatboxBody = document.createElement('div');
      chatboxBody.id = 'chatbox-body';

      const chatboxMessages = document.createElement('div');
      chatboxMessages.id = 'chatbox-messages';

      messages.forEach((msg) => {
        const messageElement = document.createElement('div');
        messageElement.style.margin = '10px 0';
        messageElement.style.width = "100%";

        if (msg.role === 'USER') {
          messageElement.appendChild(renderUser(msg));
        } else {
          messageElement.appendChild(renderBot(msg));
        }

        chatboxMessages.appendChild(messageElement);
      });

      const messagesEndRef = document.createElement('div');
      messagesEndRef.id = 'messages-end-ref';
      chatboxMessages.appendChild(messagesEndRef);

      chatboxBody.appendChild(chatboxMessages);

      const inputField = document.createElement('input');
      inputField.id = 'chatbox-input';
      inputField.type = 'text';
      inputField.value = input;
      inputField.onkeypress = (e) => {
        if (e.key === 'Enter') handleSend();
      };

      inputField.oninput = (e) => {
        input = e.target.value;
      };

      chatboxBody.appendChild(inputField);

      const sendButton = document.createElement('div');
      sendButton.className = 'icon-send-button';
      sendButton.onclick = async (e) => {
        if (loading) return;
        e.stopPropagation();
        await handleSend();
      };

      const sendIcon = document.createElement('img');
      sendIcon.alt = "message-send";
      sendIcon.src = defaultInputSendIcon;
      sendIcon.width = 20;
      sendIcon.height = 20;

      sendButton.appendChild(sendIcon);
      chatboxBody.appendChild(sendButton);

      chatboxContainer.appendChild(chatboxHeader);
      chatboxContainer.appendChild(chatboxBody);
      containerMain.appendChild(chatboxContainer);

      scrollToBottom();
    }
  };

  window.previewImage = (imageUrl) => {
    const modal = document.createElement('div');
    modal.id = 'image-preview-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '9999';
  
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
  
    const closeButton = document.createElement('img');
    closeButton.src = 'https://i.ibb.co/jhCxsbM/close.png';  // URL of your "X" icon
    closeButton.alt = 'Close';

    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.width = '40px';  // Size of the close icon
    closeButton.style.height = '40px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };
  
    modal.appendChild(img);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
  };

  renderChatbox();
})();
