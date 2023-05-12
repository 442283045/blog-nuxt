import nodemailer from 'nodemailer'

// 创建一个SMTP客户端配置
const config = {
    service: 'QQ',
    secure: true,
    auth: {
        // 发件人邮箱账号
        user: '442283045@qq.com',
        //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
        pass: 'kfvyhjipgfbbbiji'
    }
}

export default function sendMail(userMail, code, fn) {
    const transporter = nodemailer.createTransport(config)
    // 验证码随机数

    const mail = {
        // 发件人 邮箱  '昵称<发件人邮箱>'
        from: `"Blog website"<442283045@qq.com>`,
        // 主题
        subject: '激活验证码',
        // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
        to: userMail,
        //这里可以添加html标签
        html: `<b>您的激活验证码为：${code}, 24小时内有效，请谨慎保管。</b>`
    }
    console.log(mail)
    // transporter.sendMail(mail, function (error, info) {
    //     if (error) {
    //         notice()
    //         return console.log(error)
    //     }
    //     notice()
    //     transporter.close()
    //     console.log('mail sent:', info.response)
    // })

    transporter.sendMail(mail, fn)
}
