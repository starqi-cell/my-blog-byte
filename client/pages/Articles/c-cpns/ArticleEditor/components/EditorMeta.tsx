// client/pages/ArticleEditor/components/EditorMeta.tsx
// 文章编辑器元信息组件

import React from 'react';
import { Form, Input, Upload, Select } from 'antd';
import { PlusOutlined, RobotOutlined } from '@ant-design/icons';
import { AIButton } from '../style';
import { useImageUpload } from '../hooks/useImageUpload';

const { TextArea } = Input;
const { Option } = Select;

interface IProps {
  tags: any[];
  coverImageUrl: string;
  onCoverChange: (url: string) => void;
  onGenerateSummary: () => void;
  aiLoading: boolean;
}

const EditorMeta: React.FC<IProps> = ({ 
  tags, coverImageUrl, onCoverChange, onGenerateSummary, aiLoading 
}) => {
  const { uploadImage, loading: uploadLoading } = useImageUpload();

  const handleCoverUpload = async (file: File) => {
    const url = await uploadImage(file);
    if (url) {
      onCoverChange(url);
    }
    return false;
  };

  return (
    <>
      <Form.Item label="摘要" style={{ marginTop: 24 }}>
        <Form.Item name="summary" noStyle>
          <TextArea rows={3} placeholder="文章摘要（选填）" />
        </Form.Item>
        <AIButton
          size="small"
          type="link"
          icon={<RobotOutlined />}
          onClick={onGenerateSummary}
          loading={aiLoading}
          style={{ marginTop: 8 }}
        >
          AI 生成摘要
        </AIButton>
      </Form.Item>

      <Form.Item name="cover_image" label="封面图片">
        <Input 
          placeholder="封面图片 URL（选填）" 
          value={coverImageUrl}
          onChange={(e) => onCoverChange(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={handleCoverUpload}
        >
          {coverImageUrl ? (
            <img src={coverImageUrl} alt="封面" style={{ width: '100%' }} />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传封面</div>
            </div>
          )}
        </Upload>
        {uploadLoading && <span style={{ color: '#1890ff' }}>上传中...</span>}
      </Form.Item>

      <Form.Item name="tags" label="标签">
        <Select 
          mode="tags" 
          placeholder="输入标签后按回车添加"
          tokenSeparators={[',']}
          maxTagCount={10}
        >
          {tags.map((tag) => (
            <Option key={tag.id} value={tag.name}>{tag.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="status" label="状态" initialValue="draft">
        <Select>
          <Option value="draft">草稿</Option>
          <Option value="published">发布</Option>
        </Select>
      </Form.Item>
    </>
  );
};

export default EditorMeta;