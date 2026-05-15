const nodemailer = require('nodemailer');

async function testEmail() {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hezekiahojenike@gmail.com',
      pass: 'upvu erez durr wlwc'
    }
  });

  console.log('Testing connection...');
  try {
    await transporter.verify();
    console.log('✅ Success: Connection verified!');
  } catch (error) {
    console.error('❌ Failed:', error.message);
    if (error.response) console.error('Response:', error.response);
  }
}

testEmail();
