import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blog_db',
  });

  try {
    // 测试用户名和密码
    const testUsername = 'admin';
    const testPassword = 'admin123';

    console.log('🔍 测试登录功能...\n');
    console.log('测试账号:', testUsername);
    console.log('测试密码:', testPassword);
    console.log('-----------------------------------\n');

    // 1. 查询用户
    const [users] = await connection.execute(
      'SELECT id, username, email, password, role FROM users WHERE username = ?',
      [testUsername]
    );

    if (Array.isArray(users) && users.length === 0) {
      console.log('❌ 用户不存在');
      return;
    }

    const user = (users as any[])[0];
    console.log('✅ 找到用户:');
    console.log('   ID:', user.id);
    console.log('   用户名:', user.username);
    console.log('   邮箱:', user.email);
    console.log('   角色:', user.role);
    console.log('   密码哈希 (前20字符):', user.password.substring(0, 20) + '...');
    console.log('');

    // 2. 验证密码
    console.log('🔐 验证密码...');
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    
    if (isPasswordValid) {
      console.log('✅ 密码验证成功！');
      console.log('\n✨ 登录测试通过！可以使用以下信息登录:');
      console.log('   用户名: admin');
      console.log('   密码: admin123');
    } else {
      console.log('❌ 密码验证失败！');
      console.log('');
      console.log('🔧 尝试重新生成密码哈希...');
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log('新的密码哈希:', newHash);
      
      // 更新密码
      await connection.execute(
        'UPDATE users SET password = ? WHERE username = ?',
        [newHash, testUsername]
      );
      console.log('✅ 密码已更新！请重新测试登录。');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

testLogin()
  .then(() => {
    console.log('\n✨ 测试完成!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('错误:', error);
    process.exit(1);
  });
