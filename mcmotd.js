/**
 * 原作者：https://www.npmjs.com/~dogxi
 * 原插件：https://www.npmjs.com/package/kivibot-plugin-mcmotd
 * 原协议：ISC
 * 使用方法：mcmotd.md
 */

const { axios } = require('@pupbot/core')
const colors = ['§1', '§2', '§3', '§4', '§5', '§6', '§7', '§8', '§9', '§0', '§a', '§b', '§c', '§d', '§e', '§f', '§l']

async function main(e) {
    if (e.raw_message.startsWith('!motd')) {
        if (e.raw_message.length == 5 || e.raw_message.length == 6) {
            return e.reply(`使用帮助:
!motd <服务器IP> (Java版)
!motdpe <服务器IP> (基岩版) 
!on <服务器IP> (Java版玩家在线列表)
(查在线列表不好使)`, true)
        }
        //!set ip <服务器IP> (设置本群IP)
        if (e.raw_message.startsWith('!motdpe ')) {
            let ip = e.raw_message.slice(8)
            if (!ip.includes(':')) {
                ip = ip + ':19132'
            }
            const res = await axios.get('https://motdbe.blackbe.work/api?host=' + ip)
            if (res.status != '200') {
                return e.reply('[MCBE服务器信息]' + '\n' + '请求超时')
            }
            if (res.data.status != 'online') {
                return e.reply('[MCBE服务器信息]' + '\n' + '服务器离线')
            }
            let motd = res.data.motd
            if (motd.includes('§')) {
                for (let i of colors) {
                    while (motd.includes(i)) {
                        motd = motd.replace(i, '')
                    }
                }
            }
            const msg = `[MCBE服务器信息]
协议版本：${res.data.agreement}
游戏版本：${res.data.version}
描述文本：${motd}
在线人数：${res.data.online}/${res.data.max}
存档名称：${res.data.level_name}
游戏延迟：${res.data.delay}ms`
            return e.reply(msg, true)
        }
        if (e.raw_message.startsWith('!motd ')) {
            let ip = e.raw_message.slice(6)
            if (!ip.includes(':')) {
                ip = ip + ':25565'
            }
            const res = await axios.get('https://motdbe.blackbe.work/api/java?host=' + ip)
            if (res.status != '200') {
                return e.reply('[MCJE服务器信息]' + '\n' + '请求超时')
            }
            if (res.data.status != 'online') {
                return e.reply('[MCJE服务器信息]' + '\n' + '服务器离线')
            }
            let motd = res.data.motd
            if (motd.includes('§')) {
                for (let i of colors) {
                    while (motd.includes(i)) {
                        motd = motd.replace(i, '')
                    }
                }
            }
            const msg = `[MCJE服务器信息]
协议版本：${res.data.agreement}
游戏版本：${res.data.version}
描述文本：${motd}
在线人数：${res.data.online}/${res.data.max}
存档名称：${res.data.level_name}
游戏延迟：${res.data.delay}ms`
            return e.reply(msg, true)
        }
    }
    if (e.raw_message.startsWith('!on ')) {
        let ip = e.raw_message.slice(4)
        if (!ip.includes(':')) {
            ip = ip + ':25565'
        }
        const res = await axios.get('https://motdbe.blackbe.work/api/java?host=' + ip)
        if (res.status != '200') {
            return e.reply('[MCJE服务器在线]' + '\n' + '请求超时')
        }
        if (res.data.status != 'online') {
            return e.reply('[MCJE服务器在线]' + '\n' + '服务器离线')
        }
        if (res.data.sample) {
            const arr = res.data.sample
            let msg = '[MCJE服务器在线]' + '\n'
            if (arr.length <= 50) {
                arr.forEach(obj => {
                    msg += obj.name + '\n'
                })
                return e.reply(msg, true)
            } else {
                let msg = '[MCJE服务器在线]' + '\n' + '在线人数：' + res.data.online + '/' + res.data.max + '\n' + '(人数超过50不显示名称)'
                return e.reply(msg, true)
            }
        } else {
            return e.reply('[MCJE服务器在线]' + '\n' + '暂无玩家在线', true)
        }
    }
}

module.exports = { main }