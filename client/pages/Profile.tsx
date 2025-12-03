import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Descriptions, Button, List, Tag, Tabs, message } from 'antd';
import { UserOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAppSelector } from '../store/hooks';
import type { Article } from '@shared/types';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ProfileHeader = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const UserAvatar = styled(Avatar)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UserName = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ArticleCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }
`;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('published');

  useEffect(() => {
    if (!user) {
      message.error('请先登录');
      navigate('/login');
      return;
    }
    loadMyArticles();
  }, [user, activeTab, navigate]);

  const loadMyArticles = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const status = activeTab === 'published' ? 'published' : 'draft';
      const response = await fetch(`/api/articles?authorId=${user.id}&status=${status}&pageSize=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.items) {
        setArticles(data.items);
      }
    } catch (error) {
      console.error('加载文章失败:', error);
      message.error('加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const tabItems = [
    {
      key: 'published',
      label: `已发布 (${activeTab === 'published' ? articles.length : 0})`,
      children: (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
          dataSource={articles}
          loading={loading}
          renderItem={(article) => (
            <List.Item>
              <ArticleCard
                hoverable
                onClick={() => navigate(`/article/${article.id}`)}
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/article/edit/${article.id}`);
                    }}
                  >
                    编辑
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={article.title}
                  description={
                    <>
                      <div style={{ marginTop: 8 }}>
                        {article.tags?.slice(0, 3).map((tag) => (
                          <Tag key={tag.id} color={tag.color}>
                            {tag.name}
                          </Tag>
                        ))}
                      </div>
                      <div style={{ marginTop: 8, color: '#999' }}>
                        阅读 {article.view_count} · 点赞 {article.like_count}
                      </div>
                    </>
                  }
                />
              </ArticleCard>
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'draft',
      label: `草稿箱 (${activeTab === 'draft' ? articles.length : 0})`,
      children: (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
          dataSource={articles}
          loading={loading}
          renderItem={(article) => (
            <List.Item>
              <ArticleCard
                hoverable
                onClick={() => navigate(`/article/edit/${article.id}`)}
              >
                <Card.Meta
                  title={article.title}
                  description={
                    <>
                      <Tag color="default">草稿</Tag>
                      <div style={{ marginTop: 8, color: '#999' }}>
                        创建于 {new Date(article.created_at).toLocaleDateString('zh-CN')}
                      </div>
                    </>
                  }
                />
              </ArticleCard>
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <ProfileContainer>
      <ProfileHeader>
        <UserAvatar size={100} icon={<UserOutlined />} src={user.avatar} />
        <UserName>{user.username}</UserName>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
          <Descriptions.Item label="角色">
            {user.role === 'admin' ? '管理员' : '普通用户'}
          </Descriptions.Item>
          <Descriptions.Item label="文章数">{articles.length}</Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => navigate('/article/create')}
          >
            写文章
          </Button>
        </div>
      </ProfileHeader>

      <Card title="我的文章">
        <Tabs
          activeKey={activeTab}
          items={tabItems}
          onChange={setActiveTab}
        />
      </Card>
    </ProfileContainer>
  );
};

export default Profile;
