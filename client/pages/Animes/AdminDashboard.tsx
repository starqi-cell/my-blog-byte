import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Card, Table, Button, Space, message, Modal, Tag, Statistic, Row, Col } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CommentOutlined,
  EyeOutlined,
  LikeOutlined,
  DeleteOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAppSelector } from '../../store/hooks';
import type { Article } from '@shared/types';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatsCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
//   created_at: string;
// }

interface Comment {
  id: number;
  article_id: number;
  user_name: string;
  content: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalArticles: number;
  totalComments: number;
  totalViews: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  

  const [articles, setArticles] = useState<Article[]>([]);
  const [comments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalArticles: 0,
    totalComments: 0,
    totalViews: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      message.error('您没有权限访问此页面');
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 这里需要添加对应的后端API
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // 加载统计数据
      const articlesRes = await fetch('/api/articles?pageSize=100', { headers });
      const articlesData = await articlesRes.json();
      
      if (articlesData.items) {
        setArticles(articlesData.items);
        const totalViews = articlesData.items.reduce((sum: number, article: Article) => sum + article.view_count, 0);
        setStats({
          totalUsers: 0, // 需要添加用户列表API
          totalArticles: articlesData.total || 0,
          totalComments: 0, // 需要添加评论列表API
          totalViews,
        });
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？此操作不可恢复。',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/articles/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            message.success('删除成功');
            loadData();
          } else {
            const data = await response.json();
            message.error(data.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleApproveComment = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        message.success('审核成功');
        loadData();
      } else {
        const data = await response.json();
        message.error(data.message || '审核失败');
      }
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleDeleteComment = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条评论吗？',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/comments/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            message.success('删除成功');
            loadData();
          } else {
            const data = await response.json();
            message.error(data.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const articleColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author_name',
      key: 'author_name',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'published' ? 'success' : 'default'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '阅读量',
      dataIndex: 'view_count',
      key: 'view_count',
      width: 100,
      render: (count: number) => (
        <Space>
          <EyeOutlined />
          {count}
        </Space>
      ),
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
      key: 'like_count',
      width: 100,
      render: (count: number) => (
        <Space>
          <LikeOutlined />
          {count}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Article) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/article/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDeleteArticle(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const commentColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 120,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'approved' ? 'success' : 'warning'}>
          {status === 'approved' ? '已审核' : '待审核'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Comment) => (
        <Space>
          {record.status === 'pending' && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApproveComment(record.id)}
            >
              通过
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteComment(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'stats',
      label: (
        <span>
          <UserOutlined /> 数据统计
        </span>
      ),
      children: (
        <StatsCard>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="总用户数"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="总文章数"
                value={stats.totalArticles}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="总评论数"
                value={stats.totalComments}
                prefix={<CommentOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="总阅读量"
                value={stats.totalViews}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
          </Row>
        </StatsCard>
      ),
    },
    {
      key: 'articles',
      label: (
        <span>
          <FileTextOutlined /> 文章管理
        </span>
      ),
      children: (
        <Card>
          <Table
            columns={articleColumns}
            dataSource={articles}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'comments',
      label: (
        <span>
          <CommentOutlined /> 评论管理
        </span>
      ),
      children: (
        <Card>
          <Table
            columns={commentColumns}
            dataSource={comments}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageTitle>管理后台</PageTitle>
      <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} />
    </PageContainer>
  );
};

export default AdminDashboard;
