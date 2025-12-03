import bcrypt from 'bcrypt';

const password = process.argv[2] || 'admin123';

async function hashPassword() {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('\n密码加密结果:');
    console.log('原始密码:', password);
    console.log('加密后:', hash);
    console.log('\n你可以使用以下 SQL 更新用户密码:');
    console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
  } catch (error) {
    console.error('加密失败:', error);
  }
}

hashPassword();
