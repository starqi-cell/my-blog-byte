import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import type { Article } from '@shared/types';

/**
 * 导出文章为 PDF
 */
export async function exportToPDF(article: Article, contentElement: HTMLElement): Promise<void> {
  try {
    // 创建临时容器用于生成 PDF
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      width: 800px;
      padding: 40px;
      background: white;
      color: black;
    `;
    
    tempContainer.innerHTML = `
      <h1 style="font-size: 28px; margin-bottom: 16px;">${article.title}</h1>
      <div style="color: #666; font-size: 14px; margin-bottom: 32px;">
        <div>作者: ${article.author_name || '匿名'}</div>
        <div>发布时间: ${new Date(article.published_at || article.created_at).toLocaleString('zh-CN')}</div>
        <div>阅读量: ${article.view_count}</div>
      </div>
      <div style="line-height: 1.8;">
        ${contentElement.innerHTML}
      </div>
    `;
    
    document.body.appendChild(tempContainer);

    // 使用 html2canvas 将内容转为图片
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // 移除临时容器
    document.body.removeChild(tempContainer);

    // 创建 PDF
    const imgWidth = 210; // A4 宽度（mm）
    const pageHeight = 297; // A4 高度（mm）
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // 添加第一页
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，添加更多页
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 保存 PDF
    pdf.save(`${article.title}.pdf`);
  } catch (error) {
    console.error('导出 PDF 失败:', error);
    throw new Error('导出 PDF 失败');
  }
}

/**
 * 导出文章为 Markdown
 */
export function exportToMarkdown(article: Article): void {
  try {
    const markdown = `# ${article.title}

---

**作者:** ${article.author_name || '匿名'}  
**发布时间:** ${new Date(article.published_at || article.created_at).toLocaleString('zh-CN')}  
**阅读量:** ${article.view_count}  
**点赞数:** ${article.like_count}

---

${article.content}

---

${article.tags && article.tags.length > 0 ? `\n**标签:** ${article.tags.join(', ')}\n` : ''}
`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${article.title}.md`);
  } catch (error) {
    console.error('导出 Markdown 失败:', error);
    throw new Error('导出 Markdown 失败');
  }
}

/**
 * 导出文章为纯文本
 */
export function exportToText(article: Article): void {
  try {
    const text = `${article.title}

作者: ${article.author_name || '匿名'}
发布时间: ${new Date(article.published_at || article.created_at).toLocaleString('zh-CN')}
阅读量: ${article.view_count}
点赞数: ${article.like_count}

---

${article.content}

${article.tags && article.tags.length > 0 ? `\n标签: ${article.tags.join(', ')}\n` : ''}
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${article.title}.txt`);
  } catch (error) {
    console.error('导出文本失败:', error);
    throw new Error('导出文本失败');
  }
}
