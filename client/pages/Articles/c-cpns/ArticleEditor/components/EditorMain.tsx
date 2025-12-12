// client/pages/ArticleEditor/components/EditorMain.tsx
// 文章编辑器主内容组件

import React, { useRef } from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { PlusOutlined, RobotOutlined } from '@ant-design/icons';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { EditorGrid, PreviewCard, AIButton, Toolbar } from '../style';
import { useImageUpload } from '../hooks/useImageUpload';

const { TextArea } = Input;

interface IProps {
  content: string;
  onContentChange: (val: string) => void;
  onAIGenerate: () => void;
  aiLoading: boolean;
}

const EditorMain: React.FC<IProps> = ({ 
  content, onContentChange, onAIGenerate, aiLoading 
}) => {
  const { uploadImage, loading: uploadLoading } = useImageUpload();
  const textAreaRef = useRef<any>(null);

  const handleInsertImage = async (file: File) => {
    const url = await uploadImage(file);
    if (url) {
      const textarea = textAreaRef.current?.resizableTextArea?.textArea;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const markdownImage = `\n![图片](${url})\n`;
        const newContent = content.substring(0, start) + markdownImage + content.substring(end);
        onContentChange(newContent);
        message.success('图片已插入');
      }
    }
    return false; 
  };

  return (
    <EditorGrid>
      <div>
        <Toolbar>
          <AIButton icon={<RobotOutlined />} onClick={onAIGenerate} loading={aiLoading}>
            AI 生成内容
          </AIButton>
          <Upload
            beforeUpload={handleInsertImage}
            showUploadList={false}
          >
            <Button icon={<PlusOutlined />} loading={uploadLoading}>
              插入图片
            </Button>
          </Upload>
        </Toolbar>
        
        <Form.Item
          name="content"
          label="内容 (Markdown)"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <TextArea
            ref={textAreaRef}
            rows={20}
            placeholder="输入 Markdown 格式的文章内容"
            onChange={(e) => onContentChange(e.target.value)}
          />
        </Form.Item>
      </div>

      <div>
        <p style={{ marginBottom: 16, fontWeight: 600 }}>预览</p>
        <PreviewCard>
          <MarkdownRenderer content={content} />
        </PreviewCard>
      </div>
    </EditorGrid>
  );
};

export default EditorMain;