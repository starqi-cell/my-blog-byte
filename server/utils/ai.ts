import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AI_API_KEY = process.env.AI_API_KEY || 'cbc236e1-c18c-4e87-b2a6-15729a20fd1f';
const AI_API_URL = process.env.AI_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

export interface AIGenerateOptions {
  type: 'content' | 'summary' | 'title' | 'polish' | 'generate' | 'complete';
  input: string;
  context?: string;
  language?: string;
}

export async function generateWithAI(options: AIGenerateOptions): Promise<string> {
  const { type, input, context, language = 'zh-CN' } = options;

  let prompt = '';
  
  switch (type) {
    case 'content':
      prompt = `请根据以下标题或关键词，生成一篇博客文章的内容（使用 Markdown 格式）：\n\n${input}\n\n要求：\n1. 内容详实、结构清晰\n2. 包含引言、正文、总结\n3. 适当使用标题、列表等格式\n4. 字数在 800-1500 字之间`;
      break;
    case 'summary':
      prompt = `请为以下文章生成一段简洁的摘要（100-200字）：\n\n${input}`;
      break;
    case 'title':
      prompt = `请根据以下内容，生成 5 个合适的博客文章标题：\n\n${input}\n\n要求：\n1. 标题简洁有力\n2. 吸引读者点击\n3. 准确反映内容`;
      break;
    case 'polish':
      prompt = `请润色以下文本内容，使其更加流畅、专业、易读，同时保持原意不变（使用 Markdown 格式）：\n\n${input}\n\n要求：\n1. 优化语言表达，使其更加准确和流畅\n2. 改善句式结构，增强可读性\n3. 修正语法和标点错误\n4. 保持原有的格式和结构\n5. 保持原文风格和语气`;
      break;
    case 'generate':
      prompt = `请根据以下已有内容和要求，生成新的内容部分（使用 Markdown 格式）：\n\n已有内容：\n${context || '无'}\n\n生成要求：\n${input}\n\n要求：\n1. 与已有内容风格保持一致\n2. 内容连贯、逻辑清晰\n3. 适当使用技术术语和示例\n4. 保持 Markdown 格式规范`;
      break;
    case 'complete':
      prompt = `请补全以下未完成的内容，使其成为完整的段落或章节（使用 Markdown 格式）：\n\n未完成内容：\n${input}\n\n${context ? `上下文参考：\n${context}\n\n` : ''}要求：\n1. 自然延续未完成的内容\n2. 保持与前文风格一致\n3. 补全到一个完整的结束点\n4. 内容充实、逻辑连贯`;
      break;
  }

  if (!AI_API_KEY) {
    return generateMockAI(type, input);
  }

  try {
    // DeepSeek API 兼容
    const response = await axios.post(
      AI_API_URL,
      {
        model: 'deepseek-v3-2-251201',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        // DeepSeek 支持 temperature/max_tokens，可按需传递
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    // DeepSeek 返回结构兼容
    if (response.data && response.data.choices && response.data.choices[0]?.message?.content) {
      return response.data.choices[0].message.content;
    }
    return '生成失败';
  } catch (error) {
    console.error('AI 生成错误:', error);
    return generateMockAI(type, input);
  }
}

function generateMockAI(type: string, input: string): string {
  switch (type) {
    case 'content':
      return `# ${input}\n\n## 引言\n\n这是一篇关于"${input}"的技术文章。在现代 Web 开发中，这个主题非常重要。\n\n## 核心内容\n\n### 1. 基础概念\n\n首先，我们需要了解基础概念和原理。\n\n### 2. 实践应用\n\n在实际项目中，我们可以这样应用：\n\n\`\`\`javascript\n// 示例代码\nconst example = () => {\n  console.log('Hello World');\n};\n\`\`\`\n\n### 3. 最佳实践\n\n遵循以下最佳实践可以提高代码质量：\n- 保持代码简洁\n- 注重性能优化\n- 编写测试用例\n\n## 总结\n\n通过本文的学习，我们掌握了相关知识和技能。希望对你有所帮助！`;
    case 'summary':
      return `本文深入探讨了"${input.substring(0, 20)}..."的相关内容，从基础概念到实践应用，为读者提供了全面的技术指导。`;
    case 'title':
      return `1. 深入理解 ${input}\n2. ${input} 完全指南\n3. 从零开始学习 ${input}\n4. ${input} 最佳实践\n5. ${input} 实战教程`;
    case 'polish':
      return `${input}\n\n[已润色：语言更加流畅，结构更加清晰，表达更加专业]`;
    case 'generate':
      return `## 新生成的内容\n\n基于您的要求，这里是生成的内容：\n\n${input.substring(0, 50)}...\n\n这部分内容与前文保持一致的风格和深度。`;
    case 'complete':
      return `${input}\n\n此外，我们还需要注意以下几点：\n\n1. 保持代码的可维护性\n2. 注重性能优化\n3. 遵循最佳实践\n\n通过以上方法，我们可以更好地实现目标。`;
    default:
      return '生成失败';
  }
}
