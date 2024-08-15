## Getting Started
Node version 22
Next version 14

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

```bash
# run file min js
npm run build:min
```

how to use chatwidget 
```bash
# how to use chatwidget 
    <div 
        id="chatbot-widget-website"
        keyId="id-bot"
        webhook="http://localhost:3000/webhook-api"
    >
    </div>
    <script src="/chatbox-widget.min.js"></script>
    <link rel="stylesheet" href="/chatbot-widget.min.css">
```

Suport Chat 
- Text
    format 
        - [{"role": "USER", type: "text", value: "Hello"}] or [{"role": "BOT", type: "text", value: "Welcome to Chat bot"}]
- File
    format 
        - [{"role": "BOT", type: "file", value: "https://i.ibb.co/Krjnjzw/file-test.pdf"}]
- Image
    format 
        - [{"role": "BOT", type: "image", value: "https://i.ibb.co/Krjnjzw/comment.png"}]
- Quick reply
    format 
        - [{"role": "BOT", type: "quickreply", quick_replies: [{title: "Quick reply 1", payload: "Hello"}]}]
- Carousel
    format 
        - [{
            "role": "BOT", 
            type: "template", 
            template: {
                type: "carousel",
                columns: [
                    {
                        thumbnailImageUrl: "url-image",
                        title: "Carousel Title",
                        text: "Carousel Description",
                        actions: [
                            {
                                title: "button 1",
                                url: "https://i.ibb.co"
                            }
                        ]
                    }
                ]
            } 
          }]

Custom Widget Chatbot
- welcome-text
- user-icon
- bot-icon
- button-icon
- file-bot-icon
- input-confirm-icon
- icon-header 
- title-header
- title-user
- description-user
- title-bot
- description-bot
- bot-background-color
- user-background-color
