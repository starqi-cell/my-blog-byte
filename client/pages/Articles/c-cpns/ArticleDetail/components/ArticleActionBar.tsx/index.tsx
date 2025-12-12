// client/pages/Articles/c-cpns/ArticleDetail/components/ArticleActionBar.tsx
// 文章互动操作栏组件

import { memo, useState } from 'react';
import type { FC, ReactNode, RefObject } from 'react';
import { Button, Space, message, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  LikeOutlined,
  LikeFilled,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { ArticleActions } from '../../style'; // 注意检查样式导入路径
import { useAppDispatch } from '@/store/hooks';
import { likeArticle, deleteArticle } from '@/store/slices/articlesSlice';
import { exportToPDF, exportToMarkdown, exportToText } from '@/utils/export';

interface IProps {
  children?: ReactNode;
  article?: any;
  canEdit?: boolean | null;
  id?: string;
  // 接收父组件传来的 ref
  contentRef?: RefObject<HTMLDivElement>;
}

const ArticleActionBar: FC<IProps> = memo((props) => {
  const { article, canEdit, id, contentRef } = props;
  const dispatch = useAppDispatch();
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!id || !article) return;
    try {
      await dispatch(likeArticle(parseInt(id))).unwrap();
      setLiked(true);
      message.success('点赞成功');
    } catch (error) {
      message.error('点赞失败');
    }
  };

  const handleEdit = () => {
    navigate(`/article/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await dispatch(deleteArticle(parseInt(id))).unwrap();
      message.success('文章已删除');
      navigate('/');
    } catch (error: any) {
      message.error(error || '删除失败');
    }
  };

  const handleExport = async (type: 'pdf' | 'markdown' | 'text') => {
    // 关键校验：确保 article 和 ref.current 均存在
    if (!article || !contentRef || !contentRef.current) {
        if(!contentRef?.current) console.warn("DOM Ref is missing");
        return;
    } 
    
    try {
      message.loading({ content: '导出中...', key: 'export' });
      switch (type) {
        case 'pdf':
          await exportToPDF(article, contentRef.current);
          break;
        case 'markdown':
          exportToMarkdown(article);
          break;
        case 'text':
          exportToText(article);
          break;
      }
      message.success({ content: '导出成功', key: 'export' });
    } catch (error) {
      console.error(error);
      message.error({ content: '导出失败', key: 'export' });
    }
  };

  const exportMenuItems = [
    {
      key: 'pdf',
      label: '导出为 PDF',
      onClick: () => handleExport('pdf'),
    },
    {
      key: 'markdown',
      label: '导出为 Markdown',
      onClick: () => handleExport('markdown'),
    },
    {
      key: 'text',
      label: '导出为文本',
      onClick: () => handleExport('text'),
    },
  ];

  return (
    <ArticleActions>
      <Space>
        <Button
          type={liked ? 'primary' : 'default'}
          icon={liked ? <LikeFilled /> : <LikeOutlined />}
          onClick={handleLike}
          disabled={liked}
        >
          {liked ? '已点赞' : '点赞'}
        </Button>

        <Dropdown menu={{ items: exportMenuItems }} placement="bottomLeft">
          <Button icon={<DownloadOutlined />}>导出</Button>
        </Dropdown>
      </Space>

      {canEdit && (
        <Space>
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            编辑
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
            删除
          </Button>
        </Space>
      )}
    </ArticleActions>
  );
});

export default ArticleActionBar;