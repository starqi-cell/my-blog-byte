import React, { useState } from 'react';
import { Modal, Button, Input, message, Spin, Tabs } from 'antd';
import { BulbOutlined, ThunderboltOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  selectedText?: string;
  fullContent?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  visible,
  onClose,
  onInsert,
  selectedText = '',
  fullContent = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'polish' | 'generate' | 'complete'>('polish');
  const [result, setResult] = useState('');
  
  // 润色功能的输入
  const [polishInput, setPolishInput] = useState('');
  
  // 生成功能的输入
  const [generatePrompt, setGeneratePrompt] = useState('');
  
  // 补全功能的输入
  const [completeInput, setCompleteInput] = useState('');

  // 当选中文本变化时，更新输入框
  React.useEffect(() => {
    if (selectedText) {
      if (activeTab === 'polish') {
        setPolishInput(selectedText);
      } else if (activeTab === 'complete') {
        setCompleteInput(selectedText);
      }
    }
  }, [selectedText, activeTab]);

  const handleGenerate = async () => {
    let input = '';
    let context = '';
    let type = activeTab;

    switch (activeTab) {
      case 'polish':
        input = polishInput;
        if (!input.trim()) {
          message.warning('请输入需要润色的文本');
          return;
        }
        break;
      case 'generate':
        input = generatePrompt;
        context = fullContent;
        if (!input.trim()) {
          message.warning('请输入生成要求');
          return;
        }
        break;
      case 'complete':
        input = completeInput;
        context = fullContent;
        if (!input.trim()) {
          message.warning('请输入需要补全的内容');
          return;
        }
        break;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/ai/generate', {
        type,
        input,
        context,
        language: 'zh-CN',
      });

      setResult(response.data.result);
      message.success('生成成功！');
    } catch (error) {
      console.error('AI生成失败:', error);
      message.error('生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (!result) {
      message.warning('没有可插入的内容');
      return;
    }
    onInsert(result);
    message.success('内容已插入');
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setResult('');
    setPolishInput('');
    setGeneratePrompt('');
    setCompleteInput('');
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  return (
    <StyledModal
      title="AI 写作助手"
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="generate" type="primary" onClick={handleGenerate} loading={loading}>
          生成
        </Button>,
        <Button
          key="insert"
          type="primary"
          onClick={handleInsert}
          disabled={!result}
          style={{ background: '#52c41a' }}
        >
          插入到编辑器
        </Button>,
      ]}
    >
      <Container>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as any)}>
          <TabPane
            tab={
              <TabTitle>
                <EditOutlined />
                <span>润色文本</span>
              </TabTitle>
            }
            key="polish"
          >
            <TabContent>
              <Label>输入需要润色的文本：</Label>
              <TextArea
                value={polishInput}
                onChange={(e) => setPolishInput(e.target.value)}
                placeholder="粘贴或输入需要润色的文本内容..."
                rows={6}
                disabled={loading}
              />
              <Hint>AI 会优化语言表达，改善句式结构，使内容更加流畅和专业</Hint>
            </TabContent>
          </TabPane>

          <TabPane
            tab={
              <TabTitle>
                <BulbOutlined />
                <span>智能生成</span>
              </TabTitle>
            }
            key="generate"
          >
            <TabContent>
              <Label>描述你想生成的内容：</Label>
              <TextArea
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
                placeholder="例如：生成一段关于 React Hooks 使用技巧的内容..."
                rows={4}
                disabled={loading}
              />
              <Hint>AI 会根据已有内容的风格，生成与之相配的新内容</Hint>
            </TabContent>
          </TabPane>

          <TabPane
            tab={
              <TabTitle>
                <ThunderboltOutlined />
                <span>智能补全</span>
              </TabTitle>
            }
            key="complete"
          >
            <TabContent>
              <Label>输入未完成的内容：</Label>
              <TextArea
                value={completeInput}
                onChange={(e) => setCompleteInput(e.target.value)}
                placeholder="输入未完成的段落或章节，AI 会帮你补全..."
                rows={6}
                disabled={loading}
              />
              <Hint>AI 会自然地延续你的内容，补全到一个完整的结束点</Hint>
            </TabContent>
          </TabPane>
        </Tabs>

        {loading && (
          <LoadingContainer>
            <Spin size="large" tip="AI 正在生成内容，请稍候..." />
          </LoadingContainer>
        )}

        {result && !loading && (
          <ResultContainer>
            <ResultLabel>生成结果：</ResultLabel>
            <ResultBox>
              <pre>{result}</pre>
            </ResultBox>
          </ResultContainer>
        )}
      </Container>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  .ant-modal-body {
    max-height: 70vh;
    overflow-y: auto;
  }
`;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const TabTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  span {
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

const TabContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const Label = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Hint = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border-left: 3px solid ${({ theme }) => theme.colors.info};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  margin-top: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ResultContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ResultLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ResultBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  max-height: 300px;
  overflow-y: auto;

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: ${({ theme }) => theme.fontSize.sm};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default AIAssistant;
