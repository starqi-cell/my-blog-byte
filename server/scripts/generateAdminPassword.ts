import bcrypt from 'bcrypt';

async function generateAdminPassword() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('管理员密码哈希值:');
  console.log(hash);
  console.log('\n用户名: admin');
  console.log('密码: admin123');
  console.log('邮箱: admin@blog.com');
}

generateAdminPassword();
