import { useState, useEffect, useRef } from "react";
import {
  Layout,
  Avatar,
  Typography,
  Divider,
  Space,
  Tag,
  Card,
  Row,
  Col,
  Spin,
  message as antdMessage,
  Input,
  Button,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { marked } from "marked";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const genAI = useRef(null);
  const modelRef = useRef(null);

  // Khởi tạo AI model
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      antdMessage.error("Chưa thiết lập VITE_GEMINI_API_KEY trong file .env");
      return;
    }
    genAI.current = new GoogleGenerativeAI(apiKey);
    modelRef.current = genAI.current.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      sender: "me",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const modelMessage = {
      sender: "model",
      content: "",
      timestamp: Date.now() + 1,
    };
    setMessages((prev) => [...prev, modelMessage]);

    try {
      const chat = modelRef.current.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: "Bạn là một trợ lý ảo chuyên về lĩnh vực bất động sản cho thuê tại Việt Nam...",
              },
            ],
          },
          ...messages.map((m) => ({
            role: m.sender === "me" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
          { role: "user", parts: [{ text }] },
        ],
      });

      const result = await chat.sendMessageStream(text);
      let fullText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.timestamp === modelMessage.timestamp
              ? { ...msg, content: fullText }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.timestamp === modelMessage.timestamp
            ? {
                ...msg,
                content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendClick = () => {
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <Layout className="p-4 mt-10 bg-white rounded-xl shadow-md max-w-[700px] mx-auto h-[calc(80vh)] flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-4 shrink-0">
        <Avatar style={{ backgroundColor: "#fa8c16" }} size={48}>
          AI
        </Avatar>
        <div className="ml-3">
          <Title level={4} className="mb-0">
            ROOMIEHUB AI
          </Title>
          <Paragraph className="text-sm mb-0">
            Hỏi mình bất cứ điều gì về thuê phòng trọ, căn hộ, hoặc tìm bạn cùng
            phòng tại Việt Nam.
          </Paragraph>
          <Paragraph className="text-sm mb-0">
            Chỉ mang tính chất tham khảo. Các thông tin có thể có tỷ lệ sai lệch
          </Paragraph>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto pb-4 mb-4">
        {messages.map((msg, idx) => (
          <MessageItemUI key={idx} data={msg} />
        ))}

        {isLoading &&
          messages[messages.length - 1]?.sender === "model" &&
          messages[messages.length - 1]?.content === "" && (
            <Row justify="center" align="middle" className="mt-2">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                tip="Đang phản hồi..."
              />
            </Row>
          )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && !isLoading && (
        <>
          <Divider>Gợi ý câu hỏi</Divider>
          <Space wrap>
            {suggestions.map((s, i) => (
              <Tag
                key={i}
                color="orange"
                className="cursor-pointer"
                onClick={() => sendMessage(s.question)}
              >
                {s.title}
              </Tag>
            ))}
          </Space>
        </>
      )}

      {/* Input + Send button */}
      <div className="flex items-center gap-2 mt-2">
        <TextArea
          rows={2}
          placeholder="Nhập câu hỏi..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={(e) => {
            if (!isLoading && !e.shiftKey && e.currentTarget.value.trim()) {
              e.preventDefault();
              handleSendClick();
            }
          }}
          disabled={isLoading}
        />
        <Button
          type="primary"
          style={{
            backgroundColor: "#fa8c16",
            borderColor: "#fa8c16",
            color: "white",
          }}
          onClick={handleSendClick}
          disabled={isLoading || !inputValue.trim()}
        >
          Gửi
        </Button>
      </div>
    </Layout>
  );
}

// Component tin nhắn
function MessageItemUI({ data }) {
  const isUser = data.sender === "me";
  const htmlContent = marked(data.content || "", { breaks: true, gfm: true });

  return (
    <Row
      justify={isUser ? "end" : "start"}
      style={{ marginBottom: 12, display: "flex" }}
    >
      {!isUser && (
        <Avatar style={{ backgroundColor: "#fa8c16", marginRight: 8 }}>
          AI
        </Avatar>
      )}
      <Col xs={20} md={16}>
        <Card
          style={{
            background: isUser ? "#fa8c16" : "#f0f0f0",
            color: isUser ? "white" : "black",
            borderRadius: isUser ? "12px 12px 0 12px" : "12px 12px 12px 0",
          }}
          bodyStyle={{ padding: "8px 14px" }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{ wordBreak: "break-word" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
