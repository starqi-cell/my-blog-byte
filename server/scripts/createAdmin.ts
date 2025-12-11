import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blog_db',
  });

  try {
    // 生成密码哈希
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('生成的密码哈希:', hashedPassword);

    // 检查是否已存在admin用户
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      // 更新现有管理员密码
      await connection.execute(
        'UPDATE users SET password = ?, email = ?, role = ? WHERE username = ?',
        [hashedPassword, 'admin@blog.com', 'admin', 'admin']
      );
      console.log('✅ 管理员账户已更新');
    } else {
      // 插入新管理员账户
      await connection.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@blog.com', hashedPassword, 'admin']
      );
      console.log('✅ 管理员账户已创建');
    }

    console.log('\n📝 管理员账户信息:');
    console.log('   用户名: admin');
    console.log('   密码: admin123');
    console.log('   邮箱: admin@blog.com');
    console.log('   角色: admin');
    
  } catch (error) {
    console.error('❌ 创建管理员账户失败:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

createAdminUser()
  .then(() => {
    console.log('\n✨ 完成!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('错误:', error);
    process.exit(1);
  });
