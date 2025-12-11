// client/utils/export.ts
// 文章导出功能

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import type { Article } from '@shared/types';

// PDF 配置常量
const PDF_CONFIG = {
  A4_WIDTH: 210,        // A4 纸宽度/mm
  A4_HEIGHT: 297,       // A4 纸高度/mm
  PADDING: 15,          // 页边距/mm
  RENDER_WIDTH: 800,    // 渲染容器宽度/px
  CANVAS_SCALE: 2,      // Canvas 渲染缩放比例
} as const;

// 创建文章 HTML 内容
function createArticleHTML(article: Article, contentElement: HTMLElement): string {
  const publishDate = new Date(article.published_at || article.created_at).toLocaleString('zh-CN');
  const coverImageHTML = article.cover_image 
    ? `<div style="text-align: center; margin-bottom: 32px;">
         <img src="${article.cover_image}" alt="封面图片" style="max-width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
       </div>` 
    : '';

  return `
    <div style="font-family: 'Microsoft YaHei', Arial, sans-serif;">
      <!-- 标题 -->
      <h1 style="
        font-size: 32px; 
        font-weight: bold;
        margin-bottom: 24px; 
        padding-bottom: 16px;
        border-bottom: 2px solid #1890ff;
        color: #262626;
        line-height: 1.4;
      ">${article.title}</h1>
      
      <!-- 文章元信息 -->
      <div style="
        color: #8c8c8c; 
        font-size: 14px; 
        margin-bottom: 32px;
        padding: 16px;
        background: #f5f5f5;
        border-radius: 8px;
        line-height: 1.8;
      ">
        <p style="margin: 4px 0;"><strong>作者：</strong>${article.author_name || '匿名'}</p>
        <p style="margin: 4px 0;"><strong>发布时间：</strong>${publishDate}</p>
        <p style="margin: 4px 0;"><strong>阅读量：</strong>${article.view_count} | <strong>点赞数：</strong>${article.like_count}</p>
      </div>
      
      <!-- 封面图片 -->
      ${coverImageHTML}
      
      <!-- 正文内容 -->
      <div class="article-content" style="
        line-height: 1.8; 
        font-size: 16px;
        color: #262626;
        word-wrap: break-word;
      ">
        ${contentElement.innerHTML}
      </div>
    </div>
  `;
}

//创建隐藏的渲染容器
function createRenderContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: ${PDF_CONFIG.RENDER_WIDTH}px;
    background: white;
    color: black;
    padding: 40px;
    box-sizing: border-box;
  `;
  document.body.appendChild(container);
  return container;
}


//导出文章为 PDF
export async function exportToPDF(article: Article, contentElement: HTMLElement): Promise<void> {
  let tempContainer: HTMLDivElement | null = null;
  let hiddenSource: HTMLDivElement | null = null;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const contentWidth = PDF_CONFIG.A4_WIDTH - PDF_CONFIG.PADDING * 2;
    const contentHeight = PDF_CONFIG.A4_HEIGHT - PDF_CONFIG.PADDING * 2;
    
    const scaleFactor = PDF_CONFIG.RENDER_WIDTH / contentWidth;
    const pixelPageHeight = contentHeight * scaleFactor;

    // 创建渲染容器
    tempContainer = createRenderContainer();
    const pageContainer = document.createElement('div');
    tempContainer.appendChild(pageContainer);

    // 准备文章内容
    hiddenSource = document.createElement('div');
    hiddenSource.style.cssText = `
      position: absolute;
      left: -9999px;
      width: ${PDF_CONFIG.RENDER_WIDTH}px;
    `;
    hiddenSource.innerHTML = createArticleHTML(article, contentElement);
    document.body.appendChild(hiddenSource);

    let isFirstPage = true;
    const wrapperDiv = hiddenSource.firstElementChild as HTMLElement;
    const nodes = wrapperDiv ? Array.from(wrapperDiv.children) : [];

    //将页面渲染为 PDF 页面的函数
    const renderCurrentPage = async (): Promise<void> => {
      const canvas = await html2canvas(tempContainer!, {
        scale: PDF_CONFIG.CANVAS_SCALE,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfImgHeight = (imgProps.height * contentWidth) / imgProps.width;

      if (!isFirstPage) {
        pdf.addPage();
      } else {
        isFirstPage = false;
      }

      pdf.addImage(imgData, 'PNG', PDF_CONFIG.PADDING, PDF_CONFIG.PADDING, contentWidth, pdfImgHeight);
      
      pageContainer.innerHTML = '';
    };

    for (const node of nodes) {
      const cloneNode = node.cloneNode(true) as HTMLElement;
      pageContainer.appendChild(cloneNode);

      const currentHeight = tempContainer.scrollHeight;
      
      if (currentHeight > pixelPageHeight) {
        pageContainer.removeChild(cloneNode);
        await renderCurrentPage();
        
        pageContainer.appendChild(cloneNode);
      }
    }

    if (pageContainer.children.length > 0) {
      await renderCurrentPage();
    }

    pdf.save(`${article.title}.pdf`);

  } catch (error) {
    console.error('导出 PDF 失败:', error);
    throw new Error('导出 PDF 失败，请稍后重试');
  } finally {
    if (tempContainer) document.body.removeChild(tempContainer);
    if (hiddenSource) document.body.removeChild(hiddenSource);
  }
}

// 导出文章为 Markdown 格式
export function exportToMarkdown(article: Article): void {
  try {
    const publishDate = new Date(article.published_at || article.created_at).toLocaleString('zh-CN');
    const tagsSection = article.tags && article.tags.length > 0 
      ? `\n**标签:** ${article.tags.map(tag => `\`${tag}\``).join(' ')}\n` 
      : '';
    const contentWithoutImages = article.content.replace(/!\[.*?\]\(.*?\)/g, '');
    const markdown = `# ${article.title}

---

**作者:** ${article.author_name || '匿名'}  
**发布时间:** ${publishDate}  
**阅读量:** ${article.view_count}  
**点赞数:** ${article.like_count}
---

${contentWithoutImages}
`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${article.title}.md`);
  } catch (error) {
    console.error('导出 Markdown 失败:', error);
    throw new Error('导出 Markdown 失败，请稍后重试');
  }
}

// 导出文章为纯文本格式
export function exportToText(article: Article): void {
  try {
    const publishDate = new Date(article.published_at || article.created_at).toLocaleString('zh-CN');
    const contentWithoutImages = article.content.replace(/!\[.*?\]\(.*?\)/g, '');


    const text = `${article.title}

${'='.repeat(50)}

作者: ${article.author_name || '匿名'}
发布时间: ${publishDate}
阅读量: ${article.view_count}
点赞数: ${article.like_count}
${'='.repeat(50)}

${contentWithoutImages}
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${article.title}.txt`);
  } catch (error) {
    console.error('导出文本失败:', error);
    throw new Error('导出文本失败，请稍后重试');
  }
}   