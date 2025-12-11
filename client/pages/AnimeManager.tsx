import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { crawlFromBangumi, createAnime } from '../store/slices/animeSlice';
import type { Anime } from '@shared/types';

const AnimeManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.anime);
  const { user } = useAppSelector((state) => state.auth);

  const [bangumiUrl, setBangumiUrl] = useState('');
  const [crawledData, setCrawledData] = useState<Partial<Anime> | null>(null);
  const [myRating, setMyRating] = useState('');
  const [watchDate, setWatchDate] = useState('');

  // 如果不是管理员,重定向
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleCrawl = async () => {
    if (!bangumiUrl.trim()) {
      alert('请输入 Bangumi URL');
      return;
    }

    try {
      const result = await dispatch(crawlFromBangumi(bangumiUrl)).unwrap();
      setCrawledData(result);
    } catch (err: any) {
      alert(err || '爬取失败');
    }
  };

  const handleSubmit = async () => {
    if (!crawledData) {
      alert('请先爬取动漫数据');
      return;
    }

    const animeData: Partial<Anime> = {
      ...crawledData,
      my_rating: myRating ? parseFloat(myRating) : undefined,
      watch_date: watchDate || undefined,
    };

    try {
      await dispatch(createAnime(animeData)).unwrap();
      alert('动漫添加成功!');
      navigate('/anime');
    } catch (err: any) {
      alert(err || '添加失败');
    }
  };

  const handleReset = () => {
    setBangumiUrl('');
    setCrawledData(null);
    setMyRating('');
    setWatchDate('');
  };

  return (
    <Container>
      <Title>🎬 添加动漫</Title>
        <Subtitle>从 Bangumi 爬取动漫数据并添加到数据库</Subtitle>

        <FormSection>
          <InputGroup>
            <Label>Bangumi URL</Label>
            <UrlInput
              type="text"
              placeholder="https://bgm.tv/subject/xxxxx"
              value={bangumiUrl}
              onChange={(e) => setBangumiUrl(e.target.value)}
              disabled={loading}
            />
            <HelpText>支持格式: https://bgm.tv/subject/xxxxx 或 https://bangumi.tv/subject/xxxxx</HelpText>
          </InputGroup>

          <ButtonGroup>
            <Button onClick={handleCrawl} disabled={loading || !bangumiUrl.trim()}>
              {loading ? '爬取中...' : '🔍 爬取数据'}
            </Button>
            {crawledData && (
              <Button variant="secondary" onClick={handleReset}>
                🔄 重置
              </Button>
            )}
          </ButtonGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormSection>

        {crawledData && (
          <DataSection>
            <SectionTitle>📝 爬取到的数据</SectionTitle>
            
            <PreviewGrid>
              {crawledData.cover_url && (
                <CoverPreview>
                  <img src={crawledData.cover_url} alt={crawledData.cn_name} />
                </CoverPreview>
              )}
              
              <DataList>
                <DataItem>
                  <DataLabel>中文名:</DataLabel>
                  <DataValue>{crawledData.cn_name}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>原名:</DataLabel>
                  <DataValue>{crawledData.original_title}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>类型:</DataLabel>
                  <DataValue>{crawledData.anime_class}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>首播:</DataLabel>
                  <DataValue>{crawledData.air_date}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>集数:</DataLabel>
                  <DataValue>{crawledData.episodes}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>制作:</DataLabel>
                  <DataValue>{crawledData.studio}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>国家:</DataLabel>
                  <DataValue>{crawledData.country}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>评分:</DataLabel>
                  <DataValue>{crawledData.rating}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>标签:</DataLabel>
                  <DataValue>{crawledData.tags}</DataValue>
                </DataItem>
              </DataList>
            </PreviewGrid>

            <SectionTitle>✏️ 补充个人信息</SectionTitle>
            
            <PersonalForm>
              <InputGroup>
                <Label>我的评分 (可选)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="0.0 - 10.0"
                  value={myRating}
                  onChange={(e) => setMyRating(e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <Label>观看完成时间 (可选)</Label>
                <Input
                  type="date"
                  value={watchDate}
                  onChange={(e) => setWatchDate(e.target.value)}
                />
              </InputGroup>
            </PersonalForm>

            <ButtonGroup>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? '保存中...' : '✅ 保存到数据库'}
              </Button>
            </ButtonGroup>
          </DataSection>
        )}
      </Container>
  );
};

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  text-align: center;
`;

const FormSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const UrlInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HelpText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 32px;
  background: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.border : theme.colors.primary};
  color: ${({ variant }) => (variant === 'secondary' ? '#333' : 'white')};
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  border: 1px solid #fcc;
`;

const DataSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: ${({ theme }) => theme.colors.text};
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CoverPreview = styled.div`
  img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const DataList = styled.div`
  display: grid;
  gap: 12px;
`;

const DataItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const DataLabel = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DataValue = styled.div`
  color: ${({ theme }) => theme.colors.text};
`;

const PersonalForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export default AnimeManager;
